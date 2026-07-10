import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "../components/SectionHeading";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — ANALOG IAS ACADEMY" },
      {
        name: "description",
        content:
          "The terms and conditions governing enrolment, fees, conduct and use of the ANALOG IAS ACADEMY website and services.",
      },
      { property: "og:title", content: "Terms & Conditions — ANALOG IAS ACADEMY" },
      {
        property: "og:description",
        content: "Terms governing the use of our services and website.",
      },
    ],
  }),
  component: Terms,
});

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: [
      "By accessing this website, enrolling in our programmes or using any of our services, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our website or services.",
    ],
  },
  {
    title: "2. Admissions & Enrolment",
    body: [
      "Enrolment into any course is confirmed only upon completion of the admission process and payment of the applicable fees. The academy reserves the right to accept or decline any admission at its discretion.",
      "Batch timings, schedules, faculty and course structure may be modified to maintain academic quality. Reasonable notice of significant changes will be provided.",
    ],
  },
  {
    title: "3. Fees & Payments",
    body: [
      "All fees must be paid as per the schedule communicated at the time of admission. Fees once paid are non-transferable except where expressly permitted by the academy.",
      "Refunds, if any, are governed by the refund terms shared at the time of enrolment. Please review those terms carefully before making a payment.",
    ],
  },
  {
    title: "4. Student Conduct",
    body: [
      "Students are expected to maintain discipline, respect faculty and peers, and follow academy rules. The academy may suspend or terminate enrolment for misconduct without refund.",
    ],
  },
  {
    title: "5. Intellectual Property",
    body: [
      "All study material, notes, tests, recordings, logos and website content are the property of ANALOG IAS ACADEMY and are provided solely for personal, non-commercial use by enrolled students.",
      "Reproduction, distribution or sharing of any academy material without written permission is strictly prohibited.",
    ],
  },
  {
    title: "6. No Guarantee of Results",
    body: [
      "While we are committed to providing high-quality guidance and mentoring, we do not guarantee selection, rank or any specific examination outcome, as results depend on individual effort and other factors.",
    ],
  },
  {
    title: "7. Limitation of Liability",
    body: [
      "The academy shall not be liable for any indirect or consequential loss arising from the use of our website or services, to the maximum extent permitted by law.",
    ],
  },
  {
    title: "8. Changes to These Terms",
    body: [
      "We may revise these Terms & Conditions at any time. Updates will be posted on this page and continued use of our services constitutes acceptance of the revised terms.",
    ],
  },
];

function Terms() {
  return (
    <div className="bg-background">
      <section className="border-b border-border/60 bg-accent/40">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <SectionHeading
            eyebrow="Legal"
            title="Terms & Conditions"
            subtitle="Please read these terms carefully before using the ANALOG IAS ACADEMY website and services."
          />
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-10 px-4 py-14 sm:px-6">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="text-lg font-semibold text-primary">{s.title}</h2>
            <div className="mt-3 space-y-3">
              {s.body.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
          </div>
        ))}
        <p className="border-t border-border/60 pt-6 text-xs text-muted-foreground">
          For questions about these terms, please reach us via the Contact page.
        </p>
      </div>
    </div>
  );
}
