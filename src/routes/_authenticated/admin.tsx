import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Phone, Trash2, MailOpen, LogOut, Loader2, Inbox, RefreshCw } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import {
  listSubmissions,
  setSubmissionRead,
  deleteSubmission,
  getMyAdminStatus,
  type ContactSubmission,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Submissions — ANALOG IAS ACADEMY" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fetchList = useServerFn(listSubmissions);
  const fetchStatus = useServerFn(getMyAdminStatus);
  const markRead = useServerFn(setSubmissionRead);
  const removeFn = useServerFn(deleteSubmission);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const statusQuery = useQuery({
    queryKey: ["admin-status"],
    queryFn: () => fetchStatus(),
  });

  const isAdmin = statusQuery.data?.isAdmin ?? false;

  const listQuery = useQuery({
    queryKey: ["submissions"],
    queryFn: () => fetchList(),
    enabled: isAdmin,
  });

  const readMutation = useMutation({
    mutationFn: (vars: { id: string; isRead: boolean }) => markRead({ data: vars }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["submissions"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeFn({ data: { id } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["submissions"] }),
  });

  async function signOut() {
    await supabase.auth.signOut();
    await router.navigate({ to: "/auth" });
  }

  if (statusQuery.isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Access restricted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account doesn't have admin permissions.
        </p>
        <button
          onClick={signOut}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-input bg-background px-5 py-2.5 text-sm font-semibold hover:bg-accent"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    );
  }

  const submissions = listQuery.data ?? [];
  const shown = filter === "unread" ? submissions.filter((s) => !s.is_read) : submissions;
  const unreadCount = submissions.filter((s) => !s.is_read).length;

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Contact Submissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {submissions.length} total · {unreadCount} unread
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => listQuery.refetch()}
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <RefreshCw className={`h-4 w-4 ${listQuery.isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 inline-flex rounded-lg bg-muted p-1 text-sm font-medium">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-4 py-1.5 capitalize transition-colors ${filter === f ? "bg-card text-primary shadow-soft" : "text-muted-foreground"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {listQuery.isLoading ? (
        <div className="grid place-items-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : shown.length === 0 ? (
        <div className="mt-10 grid place-items-center rounded-2xl border border-dashed border-border py-20 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">No submissions here yet</p>
          <p className="text-xs text-muted-foreground">New messages from the contact form appear here.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {shown.map((s) => (
            <SubmissionCard
              key={s.id}
              submission={s}
              onToggleRead={() => readMutation.mutate({ id: s.id, isRead: !s.is_read })}
              onDelete={() => {
                if (confirm("Delete this submission permanently?")) deleteMutation.mutate(s.id);
              }}
              busy={
                (readMutation.isPending && readMutation.variables?.id === s.id) ||
                (deleteMutation.isPending && deleteMutation.variables === s.id)
              }
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function SubmissionCard({
  submission,
  onToggleRead,
  onDelete,
  busy,
}: {
  submission: ContactSubmission;
  onToggleRead: () => void;
  onDelete: () => void;
  busy: boolean;
}) {
  const date = new Date(submission.created_at).toLocaleString();
  return (
    <li
      className={`rounded-2xl border p-5 shadow-soft transition-colors ${submission.is_read ? "border-border bg-card" : "border-secondary/40 bg-accent/40"}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground">{submission.name}</h3>
            {!submission.is_read && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-secondary-foreground">
                New
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <a href={`mailto:${submission.email}`} className="inline-flex items-center gap-1 hover:text-primary">
              <Mail className="h-3.5 w-3.5" /> {submission.email}
            </a>
            {submission.phone && (
              <a href={`tel:${submission.phone}`} className="inline-flex items-center gap-1 hover:text-primary">
                <Phone className="h-3.5 w-3.5" /> {submission.phone}
              </a>
            )}
          </div>
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{date}</span>
      </div>

      {submission.subject && (
        <p className="mt-3 text-sm font-semibold text-foreground">{submission.subject}</p>
      )}
      <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{submission.message}</p>

      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={onToggleRead}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-60"
        >
          <MailOpen className="h-3.5 w-3.5" />
          {submission.is_read ? "Mark unread" : "Mark read"}
        </button>
        <button
          onClick={onDelete}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-background px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 disabled:opacity-60"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </li>
  );
}
