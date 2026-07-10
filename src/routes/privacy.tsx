import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "../components/SectionHeading";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ANALOG IAS ACADEMY" },
      {
        name: "description",
        content:
          "How ANALOG IAS ACADEMY collects, uses, protects and shares the personal information of students and website visitors.",
      },
      { property: "og:title", content: "Privacy Policy — ANALOG IAS ACADEMY" },
      {
        property: "og:description",
        content: "Our commitment to protecting your personal information.",
      },
    ],
  }),
  component: Privacy,
});

const sections = [
  {
    title: "1. Information We Collect",
    body: [
      "When you enquire, enrol or contact us, we may collect personal details such as your name, email address, phone number, city and the message or course preferences you share through our forms.",
      "We also automatically collect limited technical data such as your browser type, device information and pages visited, in order to improve our website and services.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    body: [
      "We use the information you provide to respond to your enquiries, process admissions and enrolments, share course-related updates, and provide academic guidance and support.",
      "With your consent, we may send you information about new batches, results, scholarships and academy events. You can opt out of such communications at any time.",
    ],
  },
  {
    title: "3. How We Protect Your Data",
    body: [
      "Contact and enquiry submissions are transmitted securely and stored in an access-controlled database. Only authorised academy staff can view submissions through a protected admin dashboard.",
      "We apply reasonable administrative and technical safeguards to prevent unauthorised access, disclosure or misuse of your information.",
    ],
  },
  {
    title: "4. Sharing of Information",
    body: [
      "We do not sell or rent your personal information. We may share limited data with trusted service providers who help us operate our website and communications, and only to the extent necessary to deliver those services.",
      "We may disclose information where required by law or to protect the rights, safety and property of the academy, our students or the public.",
    ],
  },
  {
    title: "5. Cookies",
    body: [
      "Our website may use cookies and similar technologies to remember your preferences and understand how the site is used. You can control cookies through your browser settings.",
    ],
  },
  {
    title: "6. Your Rights",
    body: [
      "You may request access to, correction of, or deletion of the personal information we hold about you. To make a request, please contact us using the details on our Contact page.",
    ],
  },
  {
    title: "7. Updates to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised effective date. Continued use of our website constitutes acceptance of the updated policy.",
    ],
  },
];

function Privacy() {
  return (
    <div className="bg-background">
      <section className="border-b border-border/60 bg-accent/40">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <SectionHeading
            eyebrow="Legal"
            title="Privacy Policy"
            subtitle="Your privacy matters to us. This policy explains how ANALOG IAS ACADEMY handles your personal information."
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
          For any privacy-related questions, please reach us via the Contact page.
        </p>
      </div>
    </div>
  );
}
