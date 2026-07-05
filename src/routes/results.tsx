import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Trophy } from "lucide-react";
import { results } from "../lib/site-data";
import { SectionHeading } from "../components/SectionHeading";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results — ANALOG IAS ACADEMY" },
      {
        name: "description",
        content:
          "Meet our top-ranking students. ANALOG IAS ACADEMY produces consistent UPSC and State PSC toppers year after year.",
      },
      { property: "og:title", content: "Results — ANALOG IAS ACADEMY" },
      {
        property: "og:description",
        content: "Consistent top ranks across UPSC Civil Services examinations.",
      },
    ],
  }),
  component: Results,
});

function Results() {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <span className="inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            Our Results
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl">
            Celebrating Our Achievers
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Our students consistently secure top ranks in the Civil Services examinations — a proud
            reflection of their hard work and our guidance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="Hall of Fame"
          title="Top Ranks, Year After Year"
          subtitle="A selection of our recent toppers who turned dedication into success."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.map((r) => (
            <div
              key={r.name}
              className="hover-lift overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              <div className="relative grid h-44 place-items-center bg-gradient-to-br from-primary to-primary/70">
                <GraduationCap className="h-16 w-16 text-gold" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                  <Trophy className="h-3.5 w-3.5" /> {r.rank}
                </span>
              </div>
              <div className="p-5 text-center">
                <h3 className="text-base font-bold text-foreground">{r.name}</h3>
                <p className="text-sm text-muted-foreground">UPSC CSE {r.year}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
