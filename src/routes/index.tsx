import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Users, GraduationCap, HeartHandshake, Star } from "lucide-react";
import heroImg from "../assets/hero.jpg";
import { SectionHeading } from "../components/SectionHeading";
import {
  getPageContent,
  getPublicCourses,
  getPublicResults,
  type PageData,
  type CourseRow,
  type ResultRow,
} from "../lib/content.functions";
import { getIcon } from "../lib/icon-map";
import { mediaUrl } from "../lib/media";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [content, courses, results] = await Promise.all([
      getPageContent({ data: { page: "home" } }),
      getPublicCourses(),
      getPublicResults(),
    ]);
    return { content, courses, results };
  },
  component: Index,
  errorComponent: () => (
    <div className="grid min-h-[50vh] place-items-center text-muted-foreground">
      This page didn't load. Please refresh.
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Not found.</div>,
});

const highlights = [
  { icon: Award, title: "25+ Years Legacy", desc: "A trusted institution with decades of proven excellence in Civil Services coaching." },
  { icon: GraduationCap, title: "Experienced Faculty", desc: "Learn from mentors, subject experts and former civil servants who know the exam inside out." },
  { icon: Users, title: "Thousands of Toppers", desc: "A vast alumni network of successful officers serving across the nation." },
  { icon: HeartHandshake, title: "Student-First Approach", desc: "Personalised mentoring, doubt-clearing and continuous guidance at every step." },
];

const statIcons = [Award, Users, GraduationCap, Star];

function str(c: PageData, key: string, fallback: string): string {
  const v = c[key];
  return typeof v === "string" && v ? v : fallback;
}

function Index() {
  const { content, courses, results } = Route.useLoaderData();
  const c = content as PageData;
  const stats =
    (Array.isArray(c.stats) ? (c.stats as { value: string; label: string }[]) : []).length > 0
      ? (c.stats as { value: string; label: string }[])
      : [
          { value: "25+", label: "Years Legacy" },
          { value: "10,000+", label: "Successful Students" },
          { value: "500+", label: "Selections" },
          { value: "50+", label: "Expert Faculty" },
        ];

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
              {str(c, "hero_eyebrow", "India's Premier Civil Services Academy")}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              {str(c, "hero_title", "Building India's Future Civil Servants")}
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
              {str(
                c,
                "hero_subtitle",
                "ANALOG IAS ACADEMY has guided thousands of aspirants towards Civil Services success through expert faculty and structured mentoring.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
              >
                Explore Courses <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="absolute -right-6 -top-6 hidden h-24 w-24 rounded-2xl bg-secondary/30 animate-float lg:block" />
            <img
              src={heroImg}
              alt="ANALOG IAS Academy students preparing for civil services"
              width={1600}
              height={1100}
              className="relative w-full rounded-2xl object-cover shadow-card"
            />
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = statIcons[i % statIcons.length];
            return (
              <div key={s.label + i} className="flex flex-col items-center text-center">
                <Icon className="h-7 w-7 text-gold" />
                <span className="mt-2 text-3xl font-extrabold text-primary">{s.value}</span>
                <span className="text-sm text-muted-foreground">{s.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="Why Choose Us"
          title={str(c, "why_title", "A Legacy of Excellence in Civil Services")}
          subtitle={str(
            c,
            "why_subtitle",
            "Everything you need to transform your preparation into a successful career in public service.",
          )}
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="hover-lift rounded-2xl border border-border bg-card p-6 shadow-soft">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary">
                <h.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-foreground">{h.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHeading
            eyebrow="Our Courses"
            title="Programmes Built for Success"
            subtitle="Comprehensive courses covering every stage of the Civil Services journey."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((course) => {
              const Icon = getIcon(course.icon);
              const img = mediaUrl(course.image_url);
              return (
                <div key={course.id} className="hover-lift rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-primary text-primary-foreground">
                    {img ? (
                      <img src={img} alt={course.title} className="h-full w-full object-cover" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-foreground">{course.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              View All Courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="Our Results"
          title="Toppers Who Made Us Proud"
          subtitle="Consistent top ranks year after year, a testament to our proven methodology."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.slice(0, 4).map((r) => {
            const img = mediaUrl(r.image_url);
            return (
              <div key={r.id} className="hover-lift overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                <div className="grid h-40 place-items-center bg-gradient-to-br from-primary to-primary/70">
                  {img ? (
                    <img src={img} alt={r.name} className="h-full w-full object-cover" />
                  ) : (
                    <GraduationCap className="h-14 w-14 text-gold" />
                  )}
                </div>
                <div className="p-5 text-center">
                  <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                    {r.rank}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-foreground">{r.name}</h3>
                  <p className="text-sm text-muted-foreground">UPSC CSE {r.year}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/results"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            See All Results <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-primary">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            {str(c, "cta_title", "Ready to begin your journey?")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            {str(
              c,
              "cta_subtitle",
              "Join ANALOG IAS ACADEMY and take the first confident step towards becoming a civil servant.",
            )}
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-3.5 text-sm font-semibold text-secondary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
          >
            Enroll Today <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
