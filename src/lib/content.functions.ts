import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";

export type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
export type ResultRow = Database["public"]["Tables"]["results"]["Row"];
export type Json = Database["public"]["Tables"]["page_content"]["Row"]["data"];
export type PageData = Record<string, Json>;

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    },
  );
}

export const getPageContent = createServerFn({ method: "GET" })
  .inputValidator((d: { page: string }) => z.object({ page: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<PageData> => {
    const sb = publicClient();
    const { data: row } = await sb
      .from("page_content")
      .select("data")
      .eq("page", data.page)
      .maybeSingle();
    return (row?.data as PageData) ?? {};
  });

export const getPublicCourses = createServerFn({ method: "GET" }).handler(
  async (): Promise<CourseRow[]> => {
    const sb = publicClient();
    const { data } = await sb
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    return (data ?? []) as CourseRow[];
  },
);

export const getPublicResults = createServerFn({ method: "GET" }).handler(
  async (): Promise<ResultRow[]> => {
    const sb = publicClient();
    const { data } = await sb
      .from("results")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    return (data ?? []) as ResultRow[];
  },
);
