import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, PlayCircle, ShoppingCart } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import {
  getPublicCourse,
  parseSampleVideos,
  type CourseRow,
  type SampleVideo,
} from "../lib/content.functions";
import { getIcon } from "../lib/icon-map";
import { mediaUrl } from "../lib/media";

export const Route = createFileRoute("/courses/$id")({
  loader: async ({ params }) => {
    const course = await getPublicCourse({ data: { id: params.id } });
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Course not found — ANALOG IAS ACADEMY" }, { name: "robots", content: "noindex" }] };
    }
    const { course } = loaderData;
    return {
      meta: [
        { title: `${course.title} — ANALOG IAS ACADEMY` },
        { name: "description", content: course.description || `${course.title} at ANALOG IAS ACADEMY.` },
        { property: "og:title", content: `${course.title} — ANALOG IAS ACADEMY` },
        { property: "og:description", content: course.description || "" },
        ...(course.image_url ? [{ property: "og:image", content: mediaUrl(course.image_url)! }] : []),
      ],
    };
  },
  component: CourseDetail,
  errorComponent: () => (
    <div className="grid min-h-[50vh] place-items-center text-muted-foreground">
      This page didn't load. Please refresh.
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-foreground">Course not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This course may have been unpublished or removed.
      </p>
      <Link
        to="/courses"
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Courses
      </Link>
    </div>
  ),
});

function youtubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      if (u.pathname.startsWith("/embed/")) return url;
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (u.pathname.startsWith("/shorts/")) return `https://www.youtube.com/embed/${u.pathname.split("/")[2]}`;
    }
    if (host === "vimeo.com") return `https://player.vimeo.com/video/${u.pathname.split("/").filter(Boolean).pop()}`;
    return null;
  } catch {
    return null;
  }
}

function CourseDetail() {
  const { course } = Route.useLoaderData() as { course: CourseRow };
  const Icon = getIcon(course.icon);
  const img = mediaUrl(course.image_url);
  const videos: SampleVideo[] = parseSampleVideos(course.sample_videos);
  const lms = course.lms_url?.trim();

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
          <div className="flex flex-col justify-center">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:opacity-80"
            >
              <ArrowLeft className="h-4 w-4" /> All Courses
            </Link>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{course.title}</h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80">{course.description}</p>
            {course.price && (
              <p className="mt-6 text-2xl font-bold text-gold">{course.price}</p>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              {lms ? (
                <a
                  href={lms}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-secondary px-7 py-3.5 text-sm font-semibold text-secondary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
                >
                  <ShoppingCart className="h-4 w-4" /> Enroll / Buy Now
                </a>
              ) : (
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-secondary px-7 py-3.5 text-sm font-semibold text-secondary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
                >
                  Enquire Now <ArrowRight className="h-4 w-4" />
                </Link>
              )}
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10"
              >
                Talk to a Counsellor
              </Link>
            </div>
          </div>
          <div className="relative grid min-h-[16rem] place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-primary/60 to-primary/30">
            {img ? (
              <img src={img} alt={course.title} className="h-full w-full object-cover" />
            ) : (
              <Icon className="h-24 w-24 text-gold" />
            )}
          </div>
        </div>
      </section>

      {course.long_description?.trim() && (
        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
          <SectionHeading eyebrow="Course Details" title="What This Programme Covers" />
          <div className="mt-8 whitespace-pre-line text-muted-foreground leading-relaxed">
            {course.long_description}
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <section className="bg-muted/50">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <SectionHeading
              eyebrow="Sample Videos"
              title="Get a Feel for the Classes"
              subtitle="Watch a few sample sessions from this programme."
            />
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {videos.map((v, i) => {
                const embed = youtubeEmbed(v.url);
                return (
                  <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                    <div className="aspect-video w-full bg-black">
                      {embed ? (
                        <iframe
                          src={embed}
                          title={v.title || `Sample video ${i + 1}`}
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <a
                          href={v.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="grid h-full w-full place-items-center text-primary-foreground"
                        >
                          <span className="inline-flex items-center gap-2 text-sm font-semibold">
                            <PlayCircle className="h-6 w-6" /> Watch video
                          </span>
                        </a>
                      )}
                    </div>
                    {v.title && (
                      <p className="p-4 text-sm font-semibold text-foreground">{v.title}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
          Ready to begin {course.title}?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {lms
            ? "Enroll now to access the full course on our learning platform."
            : "Get in touch and our counsellors will guide you through enrolment."}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {lms ? (
            <a
              href={lms}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-3.5 text-sm font-semibold text-secondary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
            >
              <ShoppingCart className="h-4 w-4" /> Enroll / Buy Now
            </a>
          ) : (
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-secondary px-8 py-3.5 text-sm font-semibold text-secondary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
            >
              Get Free Counselling <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>
    </>
  );
}
