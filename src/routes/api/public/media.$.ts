import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

/**
 * Public passthrough for the private "media" bucket.
 *
 * Security: this endpoint is unauthenticated, so it must NOT serve arbitrary
 * objects from the bucket. It only streams an object when its path is actually
 * referenced by a *published* course or result, or by editable page content
 * (home banner, founder photo, etc.) — i.e. content already intended to be
 * publicly visible. Everything else returns 404, preserving the staff-only
 * storage policy for all other objects.
 */
async function isPubliclyReferenced(path: string): Promise<boolean> {
  // Anon/publishable client — reads are constrained by RLS to published rows.
  const sb = createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );

  const [{ data: course }, { data: result }, { data: pages }] = await Promise.all([
    sb
      .from("courses")
      .select("id")
      .eq("is_published", true)
      .eq("image_url", path)
      .limit(1)
      .maybeSingle(),
    sb
      .from("results")
      .select("id")
      .eq("is_published", true)
      .eq("image_url", path)
      .limit(1)
      .maybeSingle(),
    sb.from("page_content").select("data"),
  ]);

  const referencedInPages = (pages ?? []).some((row) =>
    JSON.stringify(row.data ?? {}).includes(path),
  );

  return Boolean(course) || Boolean(result) || referencedInPages;
}

export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = params._splat;
        if (!path) return new Response("Not found", { status: 404 });

        // Only serve assets referenced by published, publicly visible content.
        if (!(await isPubliclyReferenced(path))) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.storage.from("media").download(path);
        if (error || !data) return new Response("Not found", { status: 404 });

        const buffer = await data.arrayBuffer();
        return new Response(buffer, {
          headers: {
            "Content-Type": data.type || "application/octet-stream",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
