-- Drafts and published documents are separate tables: public reads cannot expose a draft column.
create table if not exists public.cms_staff (
  user_id uuid primary key references auth.users(id), email text not null,
  role text not null check (role in ('owner','editor')), active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.cms_entries (
  id uuid primary key default gen_random_uuid(), kind text not null check (kind in ('organization','story','leadership','recweek','home','about','settings','clusters')),
  slug text not null check (slug ~ '^[a-z0-9][a-z0-9-]*$'), ever_published boolean not null default false,
  published_version integer, deleted_at timestamptz, updated_at timestamptz not null default now(),
  unique(kind,slug)
);
create unique index if not exists cms_singletons on public.cms_entries(kind) where kind not in ('organization','story');
create table if not exists public.cms_drafts (
  entry_id uuid primary key references public.cms_entries(id), document jsonb not null check (jsonb_typeof(document) = 'object'),
  version integer not null default 1, updated_by uuid references auth.users(id), updated_at timestamptz not null default now()
);
create table if not exists public.cms_published (
  entry_id uuid primary key references public.cms_entries(id), kind text not null, slug text not null,
  document jsonb not null, published_at timestamptz not null default now(), unique(kind,slug)
);
create table if not exists public.cms_history (
  id uuid primary key default gen_random_uuid(), entry_id uuid not null references public.cms_entries(id),
  document jsonb not null, action text not null, created_by uuid references auth.users(id), created_at timestamptz not null default now()
);
create table if not exists public.cms_media (
  id uuid primary key default gen_random_uuid(), storage_path text unique not null, filename text not null,
  alt text not null default '', mime_type text not null, is_public boolean not null default false,
  uploaded_by uuid references auth.users(id), created_at timestamptz not null default now()
);

create or replace function public.cms_is_staff(p_owner boolean default false) returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from cms_staff where user_id = auth.uid() and active and (not p_owner or role = 'owner'))
$$;
create or replace function public.cms_assert_staff(p_owner boolean default false) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not cms_is_staff(p_owner) then raise exception '%', case when p_owner then 'Active COA owner access required' else 'Active COA staff access required' end using errcode = '42501'; end if;
end $$;

alter table public.cms_staff enable row level security;
alter table public.cms_entries enable row level security;
alter table public.cms_drafts enable row level security;
alter table public.cms_published enable row level security;
alter table public.cms_history enable row level security;
alter table public.cms_media enable row level security;
create policy cms_staff_read on public.cms_staff for select to authenticated using (user_id = auth.uid() or cms_is_staff(true));
create policy cms_entries_read on public.cms_entries for select to authenticated using (cms_is_staff());
create policy cms_drafts_read on public.cms_drafts for select to authenticated using (cms_is_staff());
create policy cms_history_read on public.cms_history for select to authenticated using (cms_is_staff());
create policy cms_published_read on public.cms_published for select to anon, authenticated using (true);
create policy cms_media_public_read on public.cms_media for select to anon using (is_public);
create policy cms_media_staff_read on public.cms_media for select to authenticated using (cms_is_staff());
revoke all on public.cms_staff, public.cms_entries, public.cms_drafts, public.cms_published, public.cms_history, public.cms_media from anon, authenticated;
grant select on public.cms_published to anon, authenticated;
grant select(id,storage_path,mime_type,is_public) on public.cms_media to anon;
grant select on public.cms_media to authenticated;
grant select on public.cms_staff, public.cms_entries, public.cms_drafts, public.cms_history to authenticated;
grant all on public.cms_staff, public.cms_entries, public.cms_drafts, public.cms_published, public.cms_history, public.cms_media to service_role;

create or replace function public.cms_validate_document(p_kind text, p_document jsonb) returns void
language plpgsql set search_path = public as $$
begin
  if jsonb_typeof(p_document) is distinct from 'object' then raise exception 'Content must be an object'; end if;
  if p_kind in ('organization','story') and (coalesce(p_document->>'slug','') !~ '^[a-z0-9][a-z0-9-]*$' or
    length(trim(coalesce(p_document->>case when p_kind = 'organization' then 'name' else 'title' end,''))) = 0)
    then raise exception 'A name/title and valid slug are required'; end if;
  if p_kind = 'leadership' and (jsonb_typeof(p_document->'members') is distinct from 'array' or jsonb_typeof(p_document->'offices') is distinct from 'array')
    then raise exception 'Leadership requires a complete members and offices list'; end if;
  if p_kind = 'recweek' and (jsonb_typeof(p_document->'milestones') is distinct from 'array' or jsonb_typeof(p_document->'faqs') is distinct from 'array')
    then raise exception 'Recruitment Week requires milestones and FAQs'; end if;
end $$;

create or replace function public.cms_media_ids(p_document jsonb) returns setof uuid
language sql immutable set search_path = public as $$
  with recursive nodes(value) as (
    select p_document
    union all
    select child.value from nodes cross join lateral (
      select value from jsonb_each(case when jsonb_typeof(nodes.value) = 'object' then nodes.value else '{}'::jsonb end)
      union all
      select value from jsonb_array_elements(case when jsonb_typeof(nodes.value) = 'array' then nodes.value else '[]'::jsonb end)
    ) child
  )
  select distinct substring(value #>> '{}', 7)::uuid from nodes
  where jsonb_typeof(value) = 'string' and (value #>> '{}') ~ '^media:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
$$;

create or replace function public.cms_validate_publication(p_kind text,p_document jsonb) returns void
language plpgsql set search_path = public as $$
declare field text; array_fields text[]; object_fields text[]; string_fields text[];
begin
  array_fields := case p_kind
    when 'organization' then array['officers'] when 'leadership' then array['members','offices']
    when 'recweek' then array['milestones','faqs','headlineLines'] when 'home' then array['purposes','gallery','statisticsLabels']
    when 'about' then array['functions','principles'] when 'settings' then array['navigation'] when 'clusters' then array['items'] else array[]::text[] end;
  object_fields := case p_kind when 'organization' then array['cluster'] when 'leadership' then array['buklodCommittee','copy']
    when 'settings' then array['socialLinks','seo','copy'] when 'recweek' then array['copy'] when 'home' then array['copy'] when 'about' then array['copy'] else array[]::text[] end;
  string_fields := case p_kind when 'organization' then array['description'] when 'story' then array['date','description','bodyHtml']
    when 'recweek' then array['name','startDate','endDate','dateLabel','location'] when 'home' then array['studentsCount']
    when 'settings' then array['name','fullName','description','email','logo'] else array[]::text[] end;
  foreach field in array array_fields loop
    if jsonb_typeof(p_document->field) is distinct from 'array' then raise exception '% requires a % list before publication',p_kind,field; end if;
  end loop;
  foreach field in array object_fields loop
    if jsonb_typeof(p_document->field) is distinct from 'object' then raise exception '% requires % before publication',p_kind,field; end if;
  end loop;
  foreach field in array string_fields loop
    if jsonb_typeof(p_document->field) is distinct from 'string' then raise exception '% requires % before publication',p_kind,field; end if;
  end loop;
  if p_kind='story' then
    if p_document->>'date' !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'Choose a valid story date'; end if;
    perform (p_document->>'date')::date;
  elsif p_kind='recweek' then
    if p_document->>'startDate' !~ '^\d{4}-\d{2}-\d{2}$' or p_document->>'endDate' !~ '^\d{4}-\d{2}-\d{2}$' then raise exception 'Choose valid campaign dates'; end if;
    if (p_document->>'startDate')::date > (p_document->>'endDate')::date then raise exception 'Campaign end must follow its start'; end if;
  elsif p_kind='clusters' then
    if exists(select 1 from cms_published p where p.kind='organization' and not exists(select 1 from jsonb_array_elements(p_document->'items') c where c->>'slug'=p.document->'cluster'->>'slug'))
      then raise exception 'Keep every cluster used by a published organization'; end if;
    if exists(select 1 from jsonb_array_elements(p_document->'items') c where coalesce(c->>'slug','') !~ '^[a-z0-9][a-z0-9-]*$' or length(trim(coalesce(c->>'name','')))=0 or coalesce(c->>'color','') not in ('red','blue','green','yellow','pink','purple','gold'))
      then raise exception 'Every cluster needs a name, valid slug, and palette color'; end if;
    if (select count(*) from jsonb_array_elements(p_document->'items')) <> (select count(distinct c->>'slug') from jsonb_array_elements(p_document->'items') c) then raise exception 'Cluster slugs must be unique'; end if;
  end if;
end $$;

-- Capture image descriptions in the published document. Editing library metadata
-- must not alter a public page until that entry is deliberately published again.
create or replace function public.cms_materialize_media(p_document jsonb) returns jsonb
language plpgsql set search_path = public as $$
declare result jsonb := p_document; child record; alt_key text; description text;
begin
  if jsonb_typeof(p_document)='array' then
    select coalesce(jsonb_agg(cms_materialize_media(value) order by ordinal),'[]'::jsonb) into result
      from jsonb_array_elements(p_document) with ordinality as items(value,ordinal);
  elsif jsonb_typeof(p_document)='object' then
    for child in select key,value from jsonb_each(p_document) loop
      result := jsonb_set(result,array[child.key],cms_materialize_media(child.value));
    end loop;
    for child in select key,value from jsonb_each(p_document) loop
      if child.key in ('src','image','logo') and (child.value #>> '{}') ~ '^media:[0-9a-fA-F-]{36}$' then
        alt_key := case when child.key='src' then 'alt' else child.key || 'Alt' end;
        if length(coalesce(p_document->>alt_key,''))=0 then
          select alt into description from cms_media where id=substring(child.value #>> '{}',7)::uuid;
          result := jsonb_set(result,array[alt_key],to_jsonb(coalesce(description,'')));
        end if;
      end if;
    end loop;
  end if;
  return result;
end $$;

create or replace function public.cms_create_entry(p_kind text, p_slug text, p_document jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare result cms_entries;
begin
  perform cms_assert_staff(); perform cms_validate_document(p_kind,p_document);
  if p_kind in ('organization','story') and p_document->>'slug' is distinct from p_slug then raise exception 'Content slug must match the entry slug'; end if;
  insert into cms_entries(kind,slug) values(p_kind,p_slug) returning * into result;
  insert into cms_drafts(entry_id,document,updated_by) values(result.id,p_document,auth.uid());
  return to_jsonb(result);
end $$;

create or replace function public.cms_save_draft(p_id uuid, p_expected_version integer, p_document jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare entry cms_entries; result cms_drafts;
begin
  perform cms_assert_staff();
  select * into entry from cms_entries where id = p_id for update;
  if not found or entry.deleted_at is not null then raise exception 'Content is missing or in trash'; end if;
  perform cms_validate_document(entry.kind,p_document);
  if entry.kind in ('organization','story') then
    if entry.ever_published and p_document->>'slug' is distinct from entry.slug then raise exception 'Published URLs are permanent'; end if;
    update cms_entries set slug = p_document->>'slug' where id = p_id;
  end if;
  update cms_drafts set document = p_document, version = version + 1, updated_by = auth.uid(), updated_at = now()
    where entry_id = p_id and version = p_expected_version returning * into result;
  if not found then raise exception 'A newer draft exists. Reload before saving.' using errcode = '40001'; end if;
  update cms_entries set updated_at = now() where id = p_id;
  return to_jsonb(result);
end $$;

create or replace function public.cms_publish(p_id uuid, p_expected_version integer) returns void
language plpgsql security definer set search_path = public as $$
declare entry cms_entries; draft cms_drafts; published_document jsonb;
begin
  perform cms_assert_staff();
  select * into entry from cms_entries where id = p_id for update;
  if not found or entry.deleted_at is not null then raise exception 'Content is missing or in trash'; end if;
  select * into draft from cms_drafts where entry_id = p_id for update;
  if draft.version is distinct from p_expected_version then raise exception 'A newer draft exists. Reload before publishing.' using errcode = '40001'; end if;
  perform cms_validate_document(entry.kind,draft.document);
  perform cms_validate_publication(entry.kind,draft.document);
  if exists(select 1 from cms_media_ids(draft.document) ids(id) left join cms_media m using(id)
    where m.id is null or not exists(select 1 from storage.objects o where o.bucket_id = 'cms-media' and o.name = m.storage_path))
    then raise exception 'An image has not finished uploading'; end if;
  update cms_media set is_public = true where id in (select cms_media_ids(draft.document));
  published_document := cms_materialize_media(draft.document);
  insert into cms_published(entry_id,kind,slug,document,published_at) values(p_id,entry.kind,entry.slug,published_document,now())
    on conflict(entry_id) do update set document = excluded.document, slug = excluded.slug, published_at = excluded.published_at;
  insert into cms_history(entry_id,document,action,created_by) values(p_id,published_document,'publish',auth.uid());
  update cms_entries set ever_published = true, published_version = draft.version, updated_at = now() where id = p_id;
end $$;

create or replace function public.cms_transition(p_id uuid, p_action text, p_expected_version integer) returns void
language plpgsql security definer set search_path = public as $$
declare entry cms_entries; draft cms_drafts;
begin
  perform cms_assert_staff();
  select * into entry from cms_entries where id = p_id for update;
  if not found then raise exception 'Content is missing'; end if;
  select * into draft from cms_drafts where entry_id = p_id for update;
  if draft.version is distinct from p_expected_version then raise exception 'A newer draft exists. Reload before changing its status.' using errcode = '40001'; end if;
  if p_action = 'restore' then
    update cms_entries set deleted_at = null, updated_at = now() where id = p_id;
  elsif p_action in ('trash','unpublish') then
    if entry.kind in ('settings','clusters') then raise exception 'Global settings and clusters must remain published'; end if;
    insert into cms_history(entry_id,document,action,created_by)
      select p_id,document,p_action,auth.uid() from cms_published where entry_id = p_id;
    delete from cms_published where entry_id = p_id;
    update cms_entries set published_version = null, deleted_at = case when p_action = 'trash' then now() else deleted_at end, updated_at = now() where id = p_id;
  else raise exception 'Unknown content action'; end if;
end $$;

create or replace function public.cms_restore_revision(p_id uuid, p_revision_id uuid, p_expected_version integer) returns jsonb
language plpgsql security definer set search_path = public as $$
declare previous jsonb; result jsonb;
begin
  perform cms_assert_staff();
  select document into previous from cms_history where id = p_revision_id and entry_id = p_id;
  if not found then raise exception 'Revision is missing'; end if;
  select cms_save_draft(p_id,p_expected_version,previous) into result;
  return result;
end $$;

create or replace function public.cms_register_media(p_filename text, p_mime_type text, p_alt text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare result cms_media; media_id uuid := gen_random_uuid();
begin
  perform cms_assert_staff();
  if p_mime_type not in ('image/jpeg','image/png','image/webp','image/gif') then raise exception 'Use JPEG, PNG, WebP, or GIF images'; end if;
  insert into cms_media(id,storage_path,filename,mime_type,alt,uploaded_by)
    values(media_id,media_id::text || '/' || regexp_replace(p_filename,'[^a-zA-Z0-9._-]','-','g'),p_filename,p_mime_type,p_alt,auth.uid()) returning * into result;
  return to_jsonb(result);
end $$;
create or replace function public.cms_update_media(p_id uuid, p_alt text) returns void
language plpgsql security definer set search_path = public as $$
begin perform cms_assert_staff(); update cms_media set alt = p_alt where id = p_id; end $$;

create or replace function public.cms_manage_staff(p_user_id uuid, p_role text, p_active boolean) returns void
language plpgsql security definer set search_path = public as $$
declare previous cms_staff;
begin
  -- Serialize owner changes to protect the last active owner even under concurrent requests.
  perform pg_advisory_xact_lock(260926);
  perform cms_assert_staff(true);
  select * into previous from cms_staff where user_id = p_user_id for update;
  if not found then raise exception 'Staff member is missing'; end if;
  if p_role not in ('owner','editor') then raise exception 'Unknown staff role'; end if;
  if previous.active and previous.role = 'owner' and (not p_active or p_role <> 'owner')
    and (select count(*) from cms_staff where active and role = 'owner') <= 1 then raise exception 'Keep at least one active owner'; end if;
  update cms_staff set role = p_role, active = p_active where user_id = p_user_id;
end $$;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
  values('cms-media','cms-media',false,10485760,array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml'])
  on conflict(id) do nothing;
create policy cms_storage_read on storage.objects for select to anon, authenticated using (
  bucket_id = 'cms-media' and (cms_is_staff() or exists(select 1 from public.cms_media where storage_path = name and is_public))
);
create policy cms_storage_upload on storage.objects for insert to authenticated with check (
  bucket_id = 'cms-media' and cms_is_staff() and exists(select 1 from public.cms_media where storage_path = name and uploaded_by = auth.uid() and not is_public)
);

revoke all on function public.cms_assert_staff(boolean), public.cms_validate_document(text,jsonb), public.cms_media_ids(jsonb) from public;
revoke all on function public.cms_validate_publication(text,jsonb) from public;
revoke all on function public.cms_materialize_media(jsonb) from public;
revoke all on function public.cms_is_staff(boolean) from public;
grant execute on function public.cms_is_staff(boolean) to anon,authenticated;
revoke all on function public.cms_create_entry(text,text,jsonb), public.cms_save_draft(uuid,integer,jsonb), public.cms_publish(uuid,integer), public.cms_transition(uuid,text,integer), public.cms_restore_revision(uuid,uuid,integer), public.cms_register_media(text,text,text), public.cms_update_media(uuid,text), public.cms_manage_staff(uuid,text,boolean) from public;
grant execute on function public.cms_create_entry(text,text,jsonb), public.cms_save_draft(uuid,integer,jsonb), public.cms_publish(uuid,integer), public.cms_transition(uuid,text,integer), public.cms_restore_revision(uuid,uuid,integer), public.cms_register_media(text,text,text), public.cms_update_media(uuid,text), public.cms_manage_staff(uuid,text,boolean) to authenticated;

notify pgrst, 'reload schema';
