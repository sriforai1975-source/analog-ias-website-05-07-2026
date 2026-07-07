import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { LayoutList, GraduationCap, Trophy, Inbox, Users, FileText, LogOut, Loader2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { getMyRole } from "@/lib/cms.functions";
import { PagesEditor } from "@/components/admin/PagesEditor";
import { CoursesManager } from "@/components/admin/CoursesManager";
import { ResultsManager } from "@/components/admin/ResultsManager";
import { SubmissionsPanel } from "@/components/admin/SubmissionsPanel";
import { TeamManager } from "@/components/admin/TeamManager";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — ANALOG IAS ACADEMY" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type TabId = "pages" | "courses" | "results" | "submissions" | "team";

function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const fetchRole = useServerFn(getMyRole);
  const [tab, setTab] = useState<TabId>("pages");

  const roleQuery = useQuery({ queryKey: ["my-role"], queryFn: () => fetchRole() });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    router.navigate({ to: "/auth", replace: true });
  }

  if (roleQuery.isLoading) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const role = roleQuery.data;
  const isAdmin = role?.isAdmin ?? false;
  const isStaff = role?.isStaff ?? false;

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">Access restricted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account doesn't have content or admin permissions. Ask an administrator to invite you.
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

  const tabs: { id: TabId; label: string; icon: typeof FileText; adminOnly?: boolean }[] = [
    { id: "pages", label: "Pages", icon: FileText },
    { id: "courses", label: "Courses", icon: GraduationCap },
    { id: "results", label: "Results", icon: Trophy },
    { id: "submissions", label: "Submissions", icon: Inbox },
    { id: "team", label: "Team", icon: Users, adminOnly: true },
  ];
  const visibleTabs = tabs.filter((t) => !t.adminOnly || isAdmin);
  const activeTab = visibleTabs.some((t) => t.id === tab) ? tab : "pages";

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-extrabold text-foreground">
            <LayoutList className="h-7 w-7 text-primary" /> Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Signed in as {isAdmin ? "Administrator" : "Editor"}. Manage your website content.
          </p>
        </div>
        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-border pb-3">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === t.id
                ? "bg-primary text-primary-foreground"
                : "text-foreground/80 hover:bg-accent"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === "pages" && <PagesEditor />}
        {activeTab === "courses" && <CoursesManager />}
        {activeTab === "results" && <ResultsManager />}
        {activeTab === "submissions" && <SubmissionsPanel />}
        {activeTab === "team" && isAdmin && role && (
          <TeamManagerLoader />
        )}
      </div>
    </section>
  );
}

function TeamManagerLoader() {
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);
  if (!userId) {
    return (
      <div className="grid place-items-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  return <TeamManager currentUserId={userId} />;
}
