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
} from "lucide-react";

import {
  listAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  reorderCourses,
  toggleCoursePublished,
} from "@/lib/cms.functions";
import type { CourseRow, SampleVideo } from "@/lib/content.functions";
import { parseSampleVideos } from "@/lib/content.functions";
import { getIcon, iconNames } from "@/lib/icon-map";
import { mediaUrl } from "@/lib/media";
import { MediaInput } from "./MediaInput";

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";

type Draft = {
  title: string;
  description: string;
  long_description: string;
  image_url: string | null;
  icon: string | null;
  sample_videos: SampleVideo[];
  lms_url: string;
  price: string;
  is_published: boolean;
};

const emptyDraft: Draft = {
  title: "",
  description: "",
  long_description: "",
  image_url: null,
  icon: "BookOpen",
  sample_videos: [],
  lms_url: "",
  price: "",
  is_published: true,
};

export function CoursesManager() {
  const qc = useQueryClient();
  const fetchList = useServerFn(listAllCourses);
  const create = useServerFn(createCourse);
  const update = useServerFn(updateCourse);
  const remove = useServerFn(deleteCourse);
  const reorder = useServerFn(reorderCourses);
  const toggle = useServerFn(toggleCoursePublished);

  const list = useQuery({ queryKey: ["admin-courses"], queryFn: () => fetchList() });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-courses"] });

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
  const toggleMut = useMutation({
    mutationFn: (v: { id: string; is_published: boolean }) => toggle({ data: v }),
    onSuccess: invalidate,
  });


  const courses = list.data ?? [];

  function move(index: number, dir: -1 | 1) {
    const next = [...courses];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    reorderMut.mutate(next.map((c) => c.id));
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
        <p className="text-sm text-muted-foreground">{courses.length} course cards</p>
        {!adding && (
          <button
            onClick={() => {
              setAdding(true);
              setEditingId(null);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:-translate-y-0.5 transition-transform"
          >
            <Plus className="h-4 w-4" /> Add course
          </button>
        )}
      </div>

      {adding && (
        <CourseForm
          initial={emptyDraft}
          saving={createMut.isPending}
          error={createMut.error instanceof Error ? createMut.error.message : null}
          onCancel={() => setAdding(false)}
          onSave={(d) => createMut.mutate(d)}
        />
      )}

      <ul className="space-y-3">
        {courses.map((c, i) => (
          <li key={c.id}>
            {editingId === c.id ? (
              <CourseForm
                initial={{
                  title: c.title,
                  description: c.description,
                  long_description: c.long_description ?? "",
                  image_url: c.image_url,
                  icon: c.icon,
                  sample_videos: parseSampleVideos(c.sample_videos),
                  lms_url: c.lms_url ?? "",
                  price: c.price ?? "",
                  is_published: c.is_published,
                }}
                saving={updateMut.isPending}
                error={updateMut.error instanceof Error ? updateMut.error.message : null}
                onCancel={() => setEditingId(null)}
                onSave={(d) => updateMut.mutate({ ...d, id: c.id })}
              />
            ) : (
              <CourseRowView
                course={c}
                first={i === 0}
                last={i === courses.length - 1}
                onUp={() => move(i, -1)}
                onDown={() => move(i, 1)}
                onToggle={() =>
                  toggleMut.mutate({ id: c.id, is_published: !c.is_published })
                }
                onEdit={() => {
                  setEditingId(c.id);
                  setAdding(false);
                }}
                onDelete={() => {
                  if (confirm(`Delete "${c.title}"?`)) deleteMut.mutate(c.id);
                }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CourseRowView({
  course,
  first,
  last,
  onUp,
  onDown,
  onToggle,
  onEdit,
  onDelete,
}: {
  course: CourseRow;
  first: boolean;
  last: boolean;
  onUp: () => void;
  onDown: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const Icon = getIcon(course.icon);
  const img = mediaUrl(course.image_url);
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-accent text-primary">
        {img ? (
          <img src={img} alt={course.title} className="h-full w-full object-cover" />
        ) : (
          <Icon className="h-6 w-6" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-bold text-foreground">{course.title}</h3>
          {!course.is_published && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] font-semibold uppercase text-muted-foreground">
              Hidden
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
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
          onClick={onToggle}
          title={course.is_published ? "Hide from website" : "Show on website"}
          className={`grid h-8 w-8 place-items-center rounded-lg border hover:bg-accent ${
            course.is_published
              ? "border-input text-foreground"
              : "border-secondary/40 bg-secondary/10 text-secondary"
          }`}
        >
          {course.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
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

function CourseForm({
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
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">Title</label>
        <input
          className={inputCls}
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Short description <span className="text-muted-foreground">(shown on the course card)</span>
        </label>
        <textarea
          rows={3}
          className={inputCls}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Full course details <span className="text-muted-foreground">(shown on the course page)</span>
        </label>
        <textarea
          rows={6}
          className={inputCls}
          placeholder="Syllabus coverage, duration, what's included, schedule, faculty…"
          value={draft.long_description}
          onChange={(e) => setDraft({ ...draft, long_description: e.target.value })}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Icon (used when no image is set)
        </label>
        <select
          className={inputCls}
          value={draft.icon ?? ""}
          onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
        >
          {iconNames.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
      <MediaInput
        label="Course image"
        hint="Recommended size: 800 × 600 px (4:3), landscape. Max 5MB."
        value={draft.image_url}
        onChange={(v) => setDraft({ ...draft, image_url: v })}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Price <span className="text-muted-foreground">(optional, e.g. ₹25,000)</span>
          </label>
          <input
            className={inputCls}
            value={draft.price}
            onChange={(e) => setDraft({ ...draft, price: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Purchase / LMS link
          </label>
          <input
            className={inputCls}
            placeholder="https://lms.example.com/course/…"
            value={draft.lms_url}
            onChange={(e) => setDraft({ ...draft, lms_url: e.target.value })}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Where the "Enroll / Buy Now" button sends visitors. Opens in a new tab.
          </p>
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="block text-sm font-medium text-foreground">Sample videos</label>
          <button
            type="button"
            onClick={() =>
              setDraft({ ...draft, sample_videos: [...draft.sample_videos, { title: "", url: "" }] })
            }
            className="inline-flex items-center gap-1 rounded-lg border border-input bg-background px-2.5 py-1 text-xs font-medium hover:bg-accent"
          >
            <Plus className="h-3.5 w-3.5" /> Add video
          </button>
        </div>
        {draft.sample_videos.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Add YouTube or video links to preview the course. Leave empty for none.
          </p>
        )}
        <div className="space-y-2">
          {draft.sample_videos.map((v, idx) => (
            <div key={idx} className="flex flex-wrap items-center gap-2">
              <input
                className={`${inputCls} min-w-[8rem] flex-1`}
                placeholder="Title"
                value={v.title}
                onChange={(e) => {
                  const next = [...draft.sample_videos];
                  next[idx] = { ...next[idx], title: e.target.value };
                  setDraft({ ...draft, sample_videos: next });
                }}
              />
              <input
                className={`${inputCls} min-w-[12rem] flex-[2]`}
                placeholder="https://youtube.com/watch?v=…"
                value={v.url}
                onChange={(e) => {
                  const next = [...draft.sample_videos];
                  next[idx] = { ...next[idx], url: e.target.value };
                  setDraft({ ...draft, sample_videos: next });
                }}
              />
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    sample_videos: draft.sample_videos.filter((_, i) => i !== idx),
                  })
                }
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

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
          onClick={() =>
            onSave({
              ...draft,
              lms_url: draft.lms_url.trim(),
              sample_videos: draft.sample_videos
                .map((v) => ({ title: v.title.trim(), url: v.url.trim() }))
                .filter((v) => v.url),
            })
          }
          disabled={saving || !draft.title.trim()}
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
