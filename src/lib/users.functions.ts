import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

type AuthedContext = { supabase: SupabaseClient<Database>; userId: string };

export type TeamMember = {
  id: string;
  email: string;
  roles: string[];
  created_at: string;
  last_sign_in_at: string | null;
  confirmed: boolean;
};

async function assertAdmin(context: AuthedContext) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error("Could not verify permissions");
  if (!data) throw new Error("Forbidden");
}

async function countAdmins(admin: SupabaseClient<Database>): Promise<number> {
  const { count } = await admin
    .from("user_roles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");
  return count ?? 0;
}

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<TeamMember[]> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: usersData, error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (error) throw new Error("Could not list team members");

    const { data: roleRows } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const rolesByUser = new Map<string, string[]>();
    (roleRows ?? []).forEach((r) => {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role as string);
      rolesByUser.set(r.user_id, arr);
    });

    // Only list users that have a staff role (admin/editor) or are pending invites with a role.
    return usersData.users
      .map((u) => ({
        id: u.id,
        email: u.email ?? "",
        roles: rolesByUser.get(u.id) ?? [],
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at ?? null,
        confirmed: Boolean(u.email_confirmed_at || u.last_sign_in_at),
      }))
      .filter((u) => u.roles.includes("admin") || u.roles.includes("editor"))
      .sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
  });

export const inviteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { email: string; role: "admin" | "editor"; redirectTo: string }) =>
    z
      .object({
        email: z.string().trim().email(),
        role: z.enum(["admin", "editor"]),
        redirectTo: z.string().url(),
      })
      .parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: invited, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(data.email, {
      redirectTo: data.redirectTo,
    });
    if (error || !invited?.user) {
      throw new Error(error?.message ?? "Could not send the invitation");
    }

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: invited.user.id, role: data.role });
    if (roleErr && !roleErr.message.toLowerCase().includes("duplicate")) {
      throw new Error("Invite sent, but role assignment failed. Set the role manually.");
    }
    return { ok: true };
  });

export const setStaffRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string; role: "admin" | "editor" }) =>
    z.object({ userId: z.string().uuid(), role: z.enum(["admin", "editor"]) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.role === "editor") {
      const { data: targetAdmin } = await supabaseAdmin
        .from("user_roles")
        .select("id")
        .eq("user_id", data.userId)
        .eq("role", "admin")
        .maybeSingle();
      if (targetAdmin && (await countAdmins(supabaseAdmin)) <= 1) {
        throw new Error("Cannot change the role of the only remaining admin");
      }
    }

    await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .in("role", ["admin", "editor"]);
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: data.userId, role: data.role });
    if (error) throw new Error("Could not update role");
    return { ok: true };
  });

export const removeStaffAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string }) => z.object({ userId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    if (data.userId === context.userId) throw new Error("You cannot remove your own access");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: targetAdmin } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", data.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (targetAdmin && (await countAdmins(supabaseAdmin)) <= 1) {
      throw new Error("Cannot remove the only remaining admin");
    }

    await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .in("role", ["admin", "editor"]);
    return { ok: true };
  });
