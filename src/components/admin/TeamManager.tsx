import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, UserPlus, ShieldCheck, PencilRuler, Trash2, CheckCircle2, Clock } from "lucide-react";

import {
  adminListUsers,
  inviteUser,
  setStaffRole,
  removeStaffAccess,
  type TeamMember,
} from "@/lib/users.functions";

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";

export function TeamManager({ currentUserId }: { currentUserId: string }) {
  const qc = useQueryClient();
  const fetchUsers = useServerFn(adminListUsers);
  const invite = useServerFn(inviteUser);
  const setRole = useServerFn(setStaffRole);
  const removeAccess = useServerFn(removeStaffAccess);

  const list = useQuery({ queryKey: ["team"], queryFn: () => fetchUsers() });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["team"] });

  const [email, setEmail] = useState("");
  const [role, setRole2] = useState<"admin" | "editor">("editor");
  const [notice, setNotice] = useState<string | null>(null);

  const inviteMut = useMutation({
    mutationFn: (vars: { email: string; role: "admin" | "editor" }) =>
      invite({
        data: { ...vars, redirectTo: `${window.location.origin}/set-password` },
      }),
    onSuccess: () => {
      setNotice(`Invitation sent to ${email}.`);
      setEmail("");
      invalidate();
      setTimeout(() => setNotice(null), 5000);
    },
  });

  const roleMut = useMutation({
    mutationFn: (vars: { userId: string; role: "admin" | "editor" }) => setRole({ data: vars }),
    onSuccess: invalidate,
  });
  const removeMut = useMutation({
    mutationFn: (userId: string) => removeAccess({ data: { userId } }),
    onSuccess: invalidate,
  });

  function submitInvite(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    inviteMut.mutate({ email: email.trim(), role });
  }

  const members = list.data ?? [];

  return (
    <div className="space-y-6">
      <form
        onSubmit={submitInvite}
        className="rounded-2xl border border-border bg-card p-5 shadow-soft"
      >
        <h3 className="text-base font-bold text-foreground">Invite a team member</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          They'll get an email with a secure link to set their password.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className={inputCls}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Role</label>
            <select
              value={role}
              onChange={(e) => setRole2(e.target.value as "admin" | "editor")}
              className={inputCls}
            >
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={inviteMut.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground shadow-gold disabled:opacity-60"
          >
            {inviteMut.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Send invite
          </button>
        </div>
        {notice && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            <CheckCircle2 className="h-4 w-4 text-gold" /> {notice}
          </p>
        )}
        {inviteMut.error instanceof Error && (
          <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {inviteMut.error.message}
          </p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          <strong>Admin</strong> can manage content and team members. <strong>Editor</strong> can
          manage content only.
        </p>
      </form>

      {list.isLoading ? (
        <div className="grid place-items-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <ul className="space-y-3">
          {members.map((m) => (
            <MemberRow
              key={m.id}
              member={m}
              isSelf={m.id === currentUserId}
              busy={
                (roleMut.isPending && roleMut.variables?.userId === m.id) ||
                (removeMut.isPending && removeMut.variables === m.id)
              }
              onSetRole={(r) => roleMut.mutate({ userId: m.id, role: r })}
              onRemove={() => {
                if (confirm(`Remove ${m.email}'s access?`)) removeMut.mutate(m.id);
              }}
            />
          ))}
        </ul>
      )}
      {removeMut.error instanceof Error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {removeMut.error.message}
        </p>
      )}
      {roleMut.error instanceof Error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {roleMut.error.message}
        </p>
      )}
    </div>
  );
}

function MemberRow({
  member,
  isSelf,
  busy,
  onSetRole,
  onRemove,
}: {
  member: TeamMember;
  isSelf: boolean;
  busy: boolean;
  onSetRole: (role: "admin" | "editor") => void;
  onRemove: () => void;
}) {
  const isAdmin = member.roles.includes("admin");
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase ${
              isAdmin
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-primary"
            }`}
          >
            {isAdmin ? <ShieldCheck className="h-3 w-3" /> : <PencilRuler className="h-3 w-3" />}
            {isAdmin ? "Admin" : "Editor"}
          </span>
          <h3 className="truncate text-sm font-semibold text-foreground">{member.email}</h3>
          {isSelf && <span className="text-xs text-muted-foreground">(you)</span>}
        </div>
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
          {member.confirmed ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> Active
            </>
          ) : (
            <>
              <Clock className="h-3.5 w-3.5" /> Invitation pending
            </>
          )}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <select
          value={isAdmin ? "admin" : "editor"}
          disabled={busy}
          onChange={(e) => onSetRole(e.target.value as "admin" | "editor")}
          className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/30 disabled:opacity-60"
        >
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={onRemove}
          disabled={busy || isSelf}
          title={isSelf ? "You cannot remove yourself" : "Remove access"}
          className="grid h-8 w-8 place-items-center rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 disabled:opacity-30"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>
    </li>
  );
}
