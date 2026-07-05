import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Users, GraduationCap, HeartHandshake, Star } from "lucide-react";
import heroImg from "../assets/hero.jpg";
import { courses, results } from "../lib/site-data";
import { SectionHeading } from "../components/SectionHeading";

export const Route = createFileRoute("/")({
  component: Index,
});

const stats = [
  { icon: Award, value: "25+", label: "Years Legacy" },
  { icon: Users, value: "10,000+", label: "Successful Students" },
  { icon: GraduationCap, value: "500+", label: "Selections" },
  { icon: Star, value: "50+", label: "Expert Faculty" },
];

const highlights = [
  { icon: Award, title: "25+ Years Legacy", desc: "A trusted institution with decades of proven excellence in Civil Services coaching." },
  { icon: GraduationCap, title: "Experienced Faculty", desc: "Learn from mentors, subject experts and former civil servants who know the exam inside out." },
  { icon: Users, title: "Thousands of Toppers", desc: "A vast alumni network of successful officers serving across the nation." },
  { icon: HeartHandshake, title: "Student-First Approach", desc: "Personalised mentoring, doubt-clearing and continuous guidance at every step." },
];

function Index() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
          <div className="animate-fade-up">
            <span className="inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
              India's Premier Civil Services Academy
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Building India's Future <span className="text-gold">Civil Servants</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
              ANALOG IAS ACADEMY has guided thousands of aspirants towards Civil Services success
              through expert faculty and structured mentoring.
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

      {/* Stats */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center text-center">
              <s.icon className="h-7 w-7 text-gold" />
              <span className="mt-2 text-3xl font-extrabold text-primary">{s.value}</span>
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="A Legacy of Excellence in Civil Services"
          subtitle="Everything you need to transform your preparation into a successful career in public service."
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

      {/* Courses preview */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHeading
            eyebrow="Our Courses"
            title="Programmes Built for Success"
            subtitle="Comprehensive courses covering every stage of the Civil Services journey."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 3).map((c) => (
              <div key={c.title} className="hover-lift rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <c.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
              </div>
            ))}
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

      {/* Results preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="Our Results"
          title="Toppers Who Made Us Proud"
          subtitle="Consistent top ranks year after year, a testament to our proven methodology."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {results.slice(0, 4).map((r) => (
            <div key={r.name} className="hover-lift overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="grid h-40 place-items-center bg-gradient-to-br from-primary to-primary/70">
                <GraduationCap className="h-14 w-14 text-gold" />
              </div>
              <div className="p-5 text-center">
                <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                  {r.rank}
                </span>
                <h3 className="mt-3 text-base font-bold text-foreground">{r.name}</h3>
                <p className="text-sm text-muted-foreground">UPSC CSE {r.year}</p>
              </div>
            </div>
          ))}
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

      {/* CTA */}
      <section className="bg-primary">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">
            Ready to begin your journey?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">
            Join ANALOG IAS ACADEMY and take the first confident step towards becoming a civil servant.
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
