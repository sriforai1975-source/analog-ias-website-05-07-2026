import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import type { CourseRow, ResultRow } from "@/lib/content.functions";

type AuthedContext = { supabase: SupabaseClient<Database>; userId: string };

async function getRoles(context: AuthedContext) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  if (error) throw new Error("Could not verify permissions");
  const roles = (data ?? []).map((r) => r.role as string);
  return {
    isAdmin: roles.includes("admin"),
    isEditor: roles.includes("editor"),
    isStaff: roles.includes("admin") || roles.includes("editor"),
  };
}

async function assertStaff(context: AuthedContext) {
  const { isStaff } = await getRoles(context);
  if (!isStaff) throw new Error("Forbidden");
}

export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => getRoles(context));

/* ============ Page content ============ */

export const upsertPageContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { page: string; data: Record<string, unknown> }) =>
    z.object({ page: z.string().min(1), data: z.record(z.string(), z.any()) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase
      .from("page_content")
      .upsert({ page: data.page, data: data.data as never }, { onConflict: "page" });
    if (error) throw new Error("Could not save page content");
    return { ok: true };
  });

/* ============ Courses ============ */

export const listAllCourses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CourseRow[]> => {
    await assertStaff(context);
    const { data, error } = await context.supabase
      .from("courses")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error("Could not load courses");
    return (data ?? []) as CourseRow[];
  });

const sampleVideoInput = z.object({
  title: z.string().trim().max(200).default(""),
  url: z.string().trim().url("Enter a valid video URL").max(1000),
});

const courseInput = z.object({
  title: z.string().trim().min(1, "Title is required").max(150),
  description: z.string().trim().max(2000).default(""),
  long_description: z.string().trim().max(20000).default(""),
  image_url: z.string().trim().max(500).nullable().optional(),
  icon: z.string().trim().max(60).nullable().optional(),
  sample_videos: z.array(sampleVideoInput).max(30).default([]),
  lms_url: z.string().trim().url("Enter a valid link").max(1000).nullable().optional().or(z.literal("")),
  price: z.string().trim().max(60).nullable().optional(),
  is_published: z.boolean().default(true),
});

export const createCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => courseInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { data: maxRow } = await context.supabase
      .from("courses")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = (maxRow?.sort_order ?? 0) + 1;
    const { error } = await context.supabase.from("courses").insert({
      title: data.title,
      description: data.description,
      long_description: data.long_description,
      image_url: data.image_url || null,
      icon: data.icon || null,
      sample_videos: data.sample_videos as never,
      lms_url: data.lms_url || null,
      price: data.price || null,
      is_published: data.is_published,
      sort_order: nextOrder,
    });
    if (error) throw new Error("Could not create course");
    return { ok: true };
  });

export const updateCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => courseInput.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase
      .from("courses")
      .update({
        title: data.title,
        description: data.description,
        image_url: data.image_url || null,
        icon: data.icon || null,
        is_published: data.is_published,
      })
      .eq("id", data.id);
    if (error) throw new Error("Could not update course");
    return { ok: true };
  });

export const deleteCourse = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("courses").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete course");
    return { ok: true };
  });

export const reorderCourses = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { ids: string[] }) =>
    z.object({ ids: z.array(z.string().uuid()) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    await Promise.all(
      data.ids.map((id, index) =>
        context.supabase.from("courses").update({ sort_order: index + 1 }).eq("id", id),
      ),
    );
    return { ok: true };
  });

/* ============ Results ============ */

export const listAllResults = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ResultRow[]> => {
    await assertStaff(context);
    const { data, error } = await context.supabase
      .from("results")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error("Could not load results");
    return (data ?? []) as ResultRow[];
  });

const resultInput = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  rank: z.string().trim().max(60).default(""),
  year: z.string().trim().max(20).default(""),
  image_url: z.string().trim().max(500).nullable().optional(),
  is_published: z.boolean().default(true),
});

export const createResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => resultInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { data: maxRow } = await context.supabase
      .from("results")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = (maxRow?.sort_order ?? 0) + 1;
    const { error } = await context.supabase.from("results").insert({
      name: data.name,
      rank: data.rank,
      year: data.year,
      image_url: data.image_url || null,
      is_published: data.is_published,
      sort_order: nextOrder,
    });
    if (error) throw new Error("Could not create result");
    return { ok: true };
  });

export const updateResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => resultInput.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase
      .from("results")
      .update({
        name: data.name,
        rank: data.rank,
        year: data.year,
        image_url: data.image_url || null,
        is_published: data.is_published,
      })
      .eq("id", data.id);
    if (error) throw new Error("Could not update result");
    return { ok: true };
  });

export const deleteResult = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const { error } = await context.supabase.from("results").delete().eq("id", data.id);
    if (error) throw new Error("Could not delete result");
    return { ok: true };
  });

export const reorderResults = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { ids: string[] }) =>
    z.object({ ids: z.array(z.string().uuid()) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    await Promise.all(
      data.ids.map((id, index) =>
        context.supabase.from("results").update({ sort_order: index + 1 }).eq("id", id),
      ),
    );
    return { ok: true };
  });

/* ============ Media upload ============ */

export const uploadMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected form data");
    return data;
  })
  .handler(async ({ context, data }) => {
    await assertStaff(context);
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("No file provided");
    if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5MB");
    const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await context.supabase.storage
      .from("media")
      .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
    if (error) throw new Error("Upload failed");
    return { path };
  });
