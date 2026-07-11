import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus, Save, Trash2, CheckCircle2 } from "lucide-react";

import { getPageContent } from "@/lib/content.functions";
import { upsertPageContent } from "@/lib/cms.functions";
import { MediaInput } from "@/components/admin/MediaInput";

type FieldType = "text" | "textarea" | "stringList" | "statList" | "media";
type FieldDef = { name: string; label: string; type: FieldType };
type PageDef = { key: string; label: string; fields: FieldDef[] };

const PAGES: PageDef[] = [
  {
    key: "home",
    label: "Home",
    fields: [
      { name: "hero_eyebrow", label: "Hero eyebrow", type: "text" },
      { name: "hero_title", label: "Hero headline", type: "text" },
      { name: "hero_subtitle", label: "Hero subheading", type: "textarea" },
      { name: "hero_image", label: "Hero banner image", type: "media" },
      { name: "stats", label: "Statistics", type: "statList" },
      { name: "why_title", label: "\"Why choose us\" title", type: "text" },
      { name: "why_subtitle", label: "\"Why choose us\" subtitle", type: "textarea" },
      { name: "cta_title", label: "Call-to-action title", type: "text" },
      { name: "cta_subtitle", label: "Call-to-action subtitle", type: "textarea" },
    ],
  },
  {
    key: "about",
    label: "About",
    fields: [
      { name: "hero_title", label: "Hero heading", type: "text" },
      { name: "hero_subtitle", label: "Hero intro", type: "textarea" },
      { name: "story_title", label: "Story title", type: "text" },
      { name: "story_p1", label: "Story paragraph 1", type: "textarea" },
      { name: "story_p2", label: "Story paragraph 2", type: "textarea" },
      { name: "values", label: "Value points", type: "stringList" },
      { name: "founder_name", label: "Founder name", type: "text" },
      { name: "founder_title", label: "Founder title/designation", type: "text" },
      { name: "founder_bio", label: "Founder bio paragraphs", type: "stringList" },
      { name: "founder_image", label: "Founder photo", type: "media" },
    ],
  },
  {
    key: "courses",
    label: "Courses",
    fields: [
      { name: "hero_title", label: "Hero heading", type: "text" },
      { name: "hero_subtitle", label: "Hero intro", type: "textarea" },
    ],
  },
  {
    key: "results",
    label: "Results",
    fields: [
      { name: "hero_title", label: "Hero heading", type: "text" },
      { name: "hero_subtitle", label: "Hero intro", type: "textarea" },
    ],
  },
  {
    key: "contact",
    label: "Contact",
    fields: [
      { name: "address", label: "Address lines", type: "stringList" },
      { name: "phone", label: "Phone numbers", type: "stringList" },
      { name: "email", label: "Email addresses", type: "stringList" },
      { name: "hours", label: "Office hours", type: "stringList" },
      { name: "map_embed_url", label: "Google Maps embed URL", type: "text" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    fields: [
      { name: "tagline", label: "About / tagline text", type: "textarea" },
      { name: "contact_address", label: "Footer address", type: "text" },
      { name: "contact_phone", label: "Footer phone", type: "text" },
      { name: "contact_email", label: "Footer email", type: "text" },
      { name: "social_facebook", label: "Facebook URL", type: "text" },
      { name: "social_instagram", label: "Instagram URL", type: "text" },
      { name: "social_youtube", label: "YouTube URL", type: "text" },
      { name: "social_telegram", label: "Telegram URL", type: "text" },
      { name: "social_linkedin", label: "LinkedIn URL", type: "text" },
      { name: "privacy_label", label: "Privacy Policy link label", type: "text" },
      { name: "terms_label", label: "Terms & Conditions link label", type: "text" },
      { name: "copyright", label: "Copyright text", type: "text" },
    ],
  },
];

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";

export function PagesEditor() {
  const [pageKey, setPageKey] = useState("home");
  const def = useMemo(() => PAGES.find((p) => p.key === pageKey)!, [pageKey]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPageKey(p.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              p.key === pageKey
                ? "bg-primary text-primary-foreground"
                : "border border-input bg-background hover:bg-accent"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      <PageForm key={pageKey} def={def} />
    </div>
  );
}

function PageForm({ def }: { def: PageDef }) {
  const fetchContent = useServerFn(getPageContent);
  const save = useServerFn(upsertPageContent);
  const query = useQuery({
    queryKey: ["page-content", def.key],
    queryFn: () => fetchContent({ data: { page: def.key } }),
  });

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (query.data) setValues(query.data as Record<string, unknown>);
  }, [query.data]);

  function set(name: string, value: unknown) {
    setValues((v) => ({ ...v, [name]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setErr(null);
    setSaving(true);
    try {
      await save({ data: { page: def.key, data: values } });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  if (query.isLoading) {
    return (
      <div className="grid place-items-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {def.fields.map((f) => (
        <div key={f.name}>
          <label className="mb-1.5 block text-sm font-medium text-foreground">{f.label}</label>
          {f.type === "text" && (
            <input
              className={inputCls}
              value={(values[f.name] as string) ?? ""}
              onChange={(e) => set(f.name, e.target.value)}
            />
          )}
          {f.type === "textarea" && (
            <textarea
              rows={3}
              className={inputCls}
              value={(values[f.name] as string) ?? ""}
              onChange={(e) => set(f.name, e.target.value)}
            />
          )}
          {f.type === "stringList" && (
            <StringListEditor
              items={(values[f.name] as string[]) ?? []}
              onChange={(items) => set(f.name, items)}
            />
          )}
          {f.type === "statList" && (
            <StatListEditor
              items={(values[f.name] as { value: string; label: string }[]) ?? []}
              onChange={(items) => set(f.name, items)}
            />
          )}
        </div>
      ))}

      {err && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{err}</p>}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-secondary-foreground shadow-gold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save changes
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            <CheckCircle2 className="h-4 w-4 text-gold" /> Saved
          </span>
        )}
      </div>
    </div>
  );
}

function StringListEditor({
  items,
  onChange,
}: {
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className={inputCls}
            value={item}
            onChange={(e) => onChange(items.map((v, j) => (j === i ? e.target.value : v)))}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-input text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
      >
        <Plus className="h-3.5 w-3.5" /> Add item
      </button>
    </div>
  );
}

function StatListEditor({
  items,
  onChange,
}: {
  items: { value: string; label: string }[];
  onChange: (items: { value: string; label: string }[]) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            className={inputCls}
            placeholder="Value (e.g. 25+)"
            value={item.value}
            onChange={(e) =>
              onChange(items.map((v, j) => (j === i ? { ...v, value: e.target.value } : v)))
            }
          />
          <input
            className={inputCls}
            placeholder="Label"
            value={item.label}
            onChange={(e) =>
              onChange(items.map((v, j) => (j === i ? { ...v, label: e.target.value } : v)))
            }
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-input text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { value: "", label: "" }])}
        className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
      >
        <Plus className="h-3.5 w-3.5" /> Add stat
      </button>
    </div>
  );
}
