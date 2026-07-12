import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
  ArrowUp,
  ArrowDown,
  Pencil,
  Eye,
  EyeOff,
  GraduationCap,
} from "lucide-react";

import {
  listAllResults,
  createResult,
  updateResult,
  deleteResult,
  reorderResults,
} from "@/lib/cms.functions";
import type { ResultRow } from "@/lib/content.functions";
import { mediaUrl } from "@/lib/media";
import { MediaInput } from "./MediaInput";

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";

type Draft = {
  name: string;
  rank: string;
  year: string;
  image_url: string | null;
  is_published: boolean;
};

const emptyDraft: Draft = { name: "", rank: "", year: "", image_url: null, is_published: true };

export function ResultsManager() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listAllResults);
  const create = useServerFn(createResult);
  const update = useServerFn(updateResult);
  const remove = useServerFn(deleteResult);
  const reorder = useServerFn(reorderResults);

  const list = useQuery({ queryKey: ["admin-results"], queryFn: () => fetchList() });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-results"] });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const createMut = useMutation({
    mutationFn: (d: Draft) => create({ data: d }),
    onSuccess: () => {
      setAdding(false);
      invalidate();
    },
  });
  const updateMut = useMutation({
    mutationFn: (d: Draft & { id: string }) => update({ data: d }),
    onSuccess: () => {
      setEditingId(null);
      invalidate();
    },
  });
  const deleteMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: invalidate,
  });
  const reorderMut = useMutation({
    mutationFn: (ids: string[]) => reorder({ data: { ids } }),
    onSuccess: invalidate,
  });

  const results = list.data ?? [];

  function move(index: number, dir: -1 | 1) {
    const next = [...results];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    reorderMut.mutate(next.map((r) => r.id));
  }

  if (list.isLoading) {
    return (
      <div className="grid place-items-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{results.length} result cards</p>
        {!adding && (
          <button
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:-translate-y-0.5 transition-transform"
          >
            <Plus className="h-4 w-4" /> Add result
          </button>
        )}
      </div>

      {adding && (
        <ResultForm
          initial={emptyDraft}
          saving={createMut.isPending}
          error={createMut.error instanceof Error ? createMut.error.message : null}
          onCancel={() => setAdding(false)}
          onSave={(d) => createMut.mutate(d)}
        />
      )}

      <ul className="space-y-3">
        {results.map((r, i) => (
          <li key={r.id}>
            {editingId === r.id ? (
              <ResultForm
                initial={{
                  name: r.name,
                  rank: r.rank,
                  year: r.year,
                  image_url: r.image_url,
                  is_published: r.is_published,
                }}
                saving={updateMut.isPending}
                error={updateMut.error instanceof Error ? updateMut.error.message : null}
                onCancel={() => setEditingId(null)}
                onSave={(d) => updateMut.mutate({ ...d, id: r.id })}
              />
            ) : (
              <ResultRowView
                result={r}
                first={i === 0}
                last={i === results.length - 1}
                onUp={() => move(i, -1)}
                onDown={() => move(i, 1)}
                onEdit={() => {
                  setEditingId(r.id);
                  setAdding(false);
                }}
                onDelete={() => {
                  if (confirm(`Delete "${r.name}"?`)) deleteMut.mutate(r.id);
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultRowView({
  result,
  first,
  last,
  onUp,
  onDown,
  onEdit,
  onDelete,
}: {
  result: ResultRow;
  first: boolean;
  last: boolean;
  onUp: () => void;
  onDown: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const img = mediaUrl(result.image_url);
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-primary to-primary/70 text-gold">
        {img ? (
          <img src={img} alt={result.name} className="h-full w-full object-cover" />
        ) : (
          <GraduationCap className="h-6 w-6" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-bold text-foreground">{result.name}</h3>
          {!result.is_published && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-semibold uppercase text-muted-foreground">
              Hidden
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {result.rank} · UPSC CSE {result.year}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={onUp}
          disabled={first}
          className="grid h-8 w-8 place-items-center rounded-lg border border-input hover:bg-accent disabled:opacity-30"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
        <button
          onClick={onDown}
          disabled={last}
          className="grid h-8 w-8 place-items-center rounded-lg border border-input hover:bg-accent disabled:opacity-30"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
        <button
          onClick={onEdit}
          className="grid h-8 w-8 place-items-center rounded-lg border border-input hover:bg-accent"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="grid h-8 w-8 place-items-center rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ResultForm({
  initial,
  saving,
  error,
  onCancel,
  onSave,
}: {
  initial: Draft;
  saving: boolean;
  error: string | null;
  onCancel: () => void;
  onSave: (d: Draft) => void;
}) {
  const [draft, setDraft] = useState<Draft>(initial);
  return (
    <div className="space-y-4 rounded-2xl border border-secondary/40 bg-accent/30 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-3">
          <label className="mb-1.5 block text-sm font-medium text-foreground">Student name</label>
          <input
            className={inputCls}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Rank</label>
          <input
            className={inputCls}
            placeholder="AIR 12"
            value={draft.rank}
            onChange={(e) => setDraft({ ...draft, rank: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Year</label>
          <input
            className={inputCls}
            placeholder="2024"
            value={draft.year}
            onChange={(e) => setDraft({ ...draft, year: e.target.value })}
          />
        </div>
      </div>
      <MediaInput
        label="Photo"
        hint="Recommended size: 400 × 400 px (square), portrait headshot. Max 5MB."
        value={draft.image_url}
        onChange={(v) => setDraft({ ...draft, image_url: v })}
      />
      <button
        type="button"
        onClick={() => setDraft({ ...draft, is_published: !draft.is_published })}
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
      >
        {draft.is_published ? (
          <Eye className="h-4 w-4 text-primary" />
        ) : (
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        )}
        {draft.is_published ? "Visible on site" : "Hidden from site"}
      </button>

      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          onClick={() => onSave(draft)}
          disabled={saving || !draft.name.trim()}
          className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground shadow-gold disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
        </button>
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          <X className="h-4 w-4" /> Cancel
        </button>
      </div>
    </div>
  );
}
