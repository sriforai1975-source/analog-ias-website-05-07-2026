import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { courses } from "../lib/site-data";
import { SectionHeading } from "../components/SectionHeading";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "Courses — ANALOG IAS ACADEMY" },
      {
        name: "description",
        content:
          "UPSC Foundation, Prelims, Mains, Interview Guidance, Optional Subjects and State PSC courses designed for Civil Services success.",
      },
      { property: "og:title", content: "Courses — ANALOG IAS ACADEMY" },
      {
        property: "og:description",
        content: "Comprehensive UPSC and State PSC programmes for every stage of your journey.",
      },
    ],
  }),
  component: Courses,
});

function Courses() {
  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <span className="inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            Our Courses
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl">
            Programmes for Every Stage of Your Journey
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            From foundation to final interview, our structured courses cover the complete Civil
            Services syllabus with expert guidance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="Choose Your Path"
          title="Comprehensive Course Offerings"
          subtitle="Each programme is crafted by experts and backed by our proven methodology."
        />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <article
              key={c.title}
              className="hover-lift flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              <div className="relative grid h-44 place-items-center bg-gradient-to-br from-primary to-primary/70">
                <c.icon className="h-16 w-16 text-gold" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-bold text-foreground">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>
                <Link
                  to="/contact"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-gold"
                >
                  Know More <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-muted/50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Not sure which course fits you?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Talk to our counsellors and get a personalised preparation roadmap.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-3.5 text-sm font-semibold text-secondary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
          >
            Get Free Counselling <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
