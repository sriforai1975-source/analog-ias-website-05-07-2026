import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — ANALOG IAS ACADEMY" },
      {
        name: "description",
        content:
          "Get in touch with ANALOG IAS ACADEMY. Visit our campus, call or send us a message for admissions and course counselling.",
      },
      { property: "og:title", content: "Contact Us — ANALOG IAS ACADEMY" },
      {
        property: "og:description",
        content: "Reach out for admissions, counselling and course details.",
      },
    ],
  }),
  component: Contact,
});

const details = [
  { icon: MapPin, title: "Address", lines: ["ANALOG IAS ACADEMY", "1-2-3 Ashok Nagar, Main Road", "Hyderabad, Telangana 500020"] },
  { icon: Phone, title: "Phone", lines: ["+91 98765 43210", "+91 98765 43211"] },
  { icon: Mail, title: "Email", lines: ["info@analogias.com", "admissions@analogias.com"] },
  { icon: Clock, title: "Office Hours", lines: ["Mon – Sat: 9:00 AM – 7:00 PM", "Sunday: Closed"] },
];

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    setLoading(true);
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Could not send your message. Please try again.");
      }
      setSubmitted(true);
      form.reset();
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <span className="inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
            Contact Us
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold sm:text-5xl">
            We'd Love to Hear From You
          </h1>
          <p className="mt-4 max-w-2xl text-primary-foreground/80">
            Have a question about courses or admissions? Reach out and our team will get back to you.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Details + map */}
          <div>
            <SectionHeading center={false} eyebrow="Get in Touch" title="Contact Information" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {details.map((d) => (
                <div key={d.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary">
                    <d.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-base font-bold text-foreground">{d.title}</h3>
                  <div className="mt-1 space-y-0.5">
                    {d.lines.map((line) => (
                      <p key={line} className="text-sm text-muted-foreground">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-border shadow-soft">
              <div className="grid h-64 place-items-center bg-muted">
                <div className="text-center text-muted-foreground">
                  <MapPin className="mx-auto h-10 w-10 text-gold" />
                  <p className="mt-2 text-sm font-medium">Google Maps</p>
                  <p className="text-xs">Map location placeholder</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
            <h2 className="text-2xl font-bold text-foreground">Send a Message</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the form and we'll respond within 24 hours.
            </p>

            {submitted && (
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-medium text-primary">
                <CheckCircle2 className="h-5 w-5 text-gold" />
                Thank you! Your message has been sent.
              </div>
            )}

            {error && (
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" name="name" placeholder="Your name" required />
                <Field label="Phone" name="phone" type="tel" placeholder="+91 00000 00000" required />
              </div>
              <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
              <Field label="Subject" name="subject" placeholder="How can we help?" />
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Write your message..."
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-semibold text-secondary-foreground shadow-gold transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    Sending <Loader2 className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Message <Send className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30"
      />
    </div>
  );
}
