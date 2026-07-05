import { createFileRoute } from "@tanstack/react-router";
import { ImageIcon } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — ANALOG IAS ACADEMY" },
      {
        name: "description",
        content:
          "Glimpses of life at ANALOG IAS ACADEMY — classrooms, events, seminars, felicitations and campus moments.",
      },
      { property: "og:title", content: "Gallery — ANALOG IAS ACADEMY" },
      {
        property: "og:description",
        content: "Moments from classrooms, events and celebrations at ANALOG IAS ACADEMY.",
      },
    ],
  }),
  component: Gallery,
});

const captions = [
  "Interactive Classroom Session",
  "Annual Felicitation Ceremony",
  "Expert Guest Lecture",
  "Group Discussion Workshop",
  "Motivational Seminar",
  "Study Library",
  "Mock Interview Panel",
  "Topper Interaction Meet",
  "Campus Life",
];

function Gallery() {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <span className="inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            Gallery
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl">
            Life at ANALOG IAS ACADEMY
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            A glimpse into our vibrant learning environment, events and celebrations.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading eyebrow="Moments" title="Snapshots of Our Journey" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {captions.map((caption, i) => (
            <figure
              key={caption}
              className="hover-lift group overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              <div
                className={`grid place-items-center bg-gradient-to-br from-primary to-primary/70 ${
                  i % 4 === 0 ? "h-64" : "h-52"
                }`}
              >
                <ImageIcon className="h-14 w-14 text-gold/80 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <figcaption className="px-5 py-4 text-sm font-semibold text-foreground">
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
