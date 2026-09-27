create or replace function public.cms_enforce_featured_story_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare other_featured_count integer;
begin
  if new.kind = 'story' and (new.document->'isFeatured') = 'true'::jsonb then
    -- Serialize featured publishes so concurrent editors cannot both take the last slot.
    perform pg_advisory_xact_lock(260927);
    if new.document ? 'featuredOrder'
      and new.document->'featuredOrder' <> 'null'::jsonb then
      if jsonb_typeof(new.document->'featuredOrder') is distinct from 'number' then
        raise exception 'Featured story positions must be nonnegative numbers'
          using errcode = '23514';
      end if;
      if (new.document->>'featuredOrder')::numeric < 0 then
        raise exception 'Featured story positions must be nonnegative numbers'
          using errcode = '23514';
      end if;
      if exists (
        select 1
          from public.cms_published p
          where p.kind = 'story'
            and p.entry_id <> new.entry_id
            and (p.document->'isFeatured') = 'true'::jsonb
            and jsonb_typeof(p.document->'featuredOrder') = 'number'
            and (p.document->>'featuredOrder')::numeric = (new.document->>'featuredOrder')::numeric
      ) then
        raise exception 'Featured story positions must be unique'
          using errcode = '23514';
      end if;
    end if;
    select count(*) into other_featured_count
      from public.cms_published p
      where p.kind = 'story'
        and p.entry_id <> new.entry_id
        and (p.document->'isFeatured') = 'true'::jsonb;
    if other_featured_count >= 5 then
      raise exception 'At most five stories may be featured'
        using errcode = '23514';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists cms_featured_story_limit on public.cms_published;
create trigger cms_featured_story_limit
  before insert or update on public.cms_published
  for each row execute function public.cms_enforce_featured_story_limit();

revoke all on function public.cms_enforce_featured_story_limit() from public, anon, authenticated;
