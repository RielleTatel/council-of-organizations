import type { SupabaseClient } from "@supabase/supabase-js";

export function createMediaHandler(publicClient: SupabaseClient) {
  return async function handle(request: Request): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD")
      return new Response("Use GET.", { status: 405 });
    const id = new URL(request.url).searchParams.get("id");
    if (
      !id ||
      !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(id)
    )
      return new Response("Image not found.", { status: 404 });
    try {
      // This client uses the anonymous role: draft media is hidden by the same RLS
      // policies used for public reads, regardless of the caller's JWT.
      const { data: media, error } = await publicClient
        .from("cms_media")
        .select("storage_path,mime_type")
        .eq("id", id)
        .eq("is_public", true)
        .maybeSingle();
      if (error) throw error;
      if (!media) return new Response("Image not found.", { status: 404 });
      const image = await publicClient.storage
        .from("cms-media")
        .download(media.storage_path);
      if (image.error || !image.data)
        return new Response("Image unavailable.", { status: 503 });
      return new Response(request.method === "HEAD" ? null : image.data, {
        headers: {
          "Content-Type": media.mime_type,
          "Cache-Control": "public, max-age=86400",
          "X-Content-Type-Options": "nosniff",
          "Content-Security-Policy": "default-src 'none'; sandbox",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch {
      return new Response("Image unavailable.", { status: 503 });
    }
  };
}
