import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Users, GraduationCap, HeartHandshake, CheckCircle2, ArrowRight } from "lucide-react";
import aboutImg from "../assets/about.jpg";
import { SectionHeading } from "../components/SectionHeading";
import { getPageContent, type PageData } from "../lib/content.functions";
import { mediaUrl } from "../lib/media";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — ANALOG IAS ACADEMY" },
      {
        name: "description",
        content:
          "25+ years of legacy, experienced faculty, thousands of successful students and a student-first approach — discover the ANALOG IAS ACADEMY story.",
      },
      { property: "og:title", content: "About Us — ANALOG IAS ACADEMY" },
      {
        property: "og:description",
        content: "A 25+ year legacy of shaping India's civil servants.",
      },
    ],
  }),
  loader: async () => ({ content: await getPageContent({ data: { page: "about" } }) }),
  component: About,
  errorComponent: () => (
    <div className="grid min-h-[50vh] place-items-center text-muted-foreground">
      This page didn't load. Please refresh.
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Not found.</div>,
});

const pillars = [
  { icon: Award, title: "25+ Years Legacy", desc: "Decades of trusted excellence in Civil Services coaching across generations of aspirants." },
  { icon: GraduationCap, title: "Experienced Faculty", desc: "Subject experts, mentors and former civil servants guiding you with real exam insight." },
  { icon: Users, title: "Thousands of Successful Students", desc: "A proud alumni network of officers serving the nation in key administrative roles." },
  { icon: HeartHandshake, title: "Student-First Approach", desc: "Personalised mentoring, regular feedback and unwavering support at every stage." },
];

const defaultValues = [
  "Structured, syllabus-aligned curriculum",
  "Comprehensive test series and evaluation",
  "Up-to-date current affairs coverage",
  "Small batches for focused attention",
  "Doubt-clearing and one-on-one mentoring",
  "Motivational and disciplined environment",
];

const defaultFounderBio = [
  "An entrepreneur by profession but a teacher and coach at heart, Srikanth Vinnakota founded ANALOG IAS ACADEMY in 2002 to bring India's finest Civil Services teaching to aspirants' doorsteps in Hyderabad.",
  "What began with just 9 students has grown into one of the country's most trusted UPSC institutions, with 700+ successful selections and a reputation for producing top-ranking officers nationwide.",
  "An author, motivator and philanthropist, he blends rigorous academics with strategic mentorship to shape the leaders of tomorrow.",
];

function str(c: PageData, key: string, fallback: string): string {
  const v = c[key];
  return typeof v === "string" && v ? v : fallback;
}

function About() {
  const { content } = Route.useLoaderData();
  const c = content as PageData;
  const values =
    Array.isArray(c.values) && c.values.length > 0 ? (c.values as string[]) : defaultValues;
  const founderName = str(c, "founder_name", "Srikanth Vinnakota");
  const founderTitle = str(c, "founder_title", "Founder & Managing Director");
  const founderBio =
    Array.isArray(c.founder_bio) && c.founder_bio.length > 0
      ? (c.founder_bio as string[])
      : defaultFounderBio;
  const founderImg = mediaUrl(typeof c.founder_image === "string" ? c.founder_image : null);
  const founderInitials = founderName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();


  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <span className="inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            About Us
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl">
            {str(c, "hero_title", "Shaping India's Administrators for Over Two Decades")}
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            {str(
              c,
              "hero_subtitle",
              "ANALOG IAS ACADEMY is a leading Civil Services institution committed to guiding aspirants towards success through expert faculty, structured mentoring and a proven methodology.",
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2">
        <img
          src={aboutImg}
          alt="ANALOG IAS Academy legacy"
          width={1200}
          height={900}
          loading="lazy"
          className="w-full rounded-2xl object-cover shadow-card"
        />
        <div>
          <SectionHeading
            center={false}
            eyebrow="Our Story"
            title={str(c, "story_title", "A Mission Rooted in Excellence")}
          />
          <p className="mt-5 text-muted-foreground">
            {str(
              c,
              "story_p1",
              "For more than 25 years, ANALOG IAS ACADEMY has been a trusted name in Civil Services preparation. What began as a small mentoring initiative has grown into a premier academy that has produced hundreds of successful officers.",
            )}
          </p>
          <p className="mt-4 text-muted-foreground">
            {str(
              c,
              "story_p2",
              "Our philosophy is simple — put the student first. We combine rigorous academics with personalised guidance, ensuring every aspirant receives the attention they deserve.",
            )}
          </p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {values.map((v) => (
              <li key={v} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHeading eyebrow="Leadership" title="Meet Our Founder" />
          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[320px_1fr]">
            <div className="mx-auto w-full max-w-xs">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-primary shadow-card">
                {founderImg ? (
                  <img
                    src={founderImg}
                    alt={founderName}
                    width={640}
                    height={800}
                    loading="lazy"
                    className="aspect-[4/5] w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-[4/5] w-full place-items-center bg-gradient-to-br from-primary to-primary/70">
                    <span className="text-6xl font-extrabold tracking-wide text-gold">
                      {founderInitials}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-foreground sm:text-3xl">{founderName}</h3>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-gold">
                {founderTitle}
              </p>
              <div className="mt-5 space-y-4 text-muted-foreground">
                {founderBio.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>



      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <SectionHeading eyebrow="What Sets Us Apart" title="The ANALOG Advantage" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div key={p.title} className="hover-lift rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-primary">
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Explore Our Courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
