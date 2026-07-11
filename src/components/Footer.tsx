import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram, Youtube, Linkedin, Send, MapPin, Phone, Mail } from "lucide-react";
import logo from "../assets/analog-logo.png";
import { getPageContent, type PageData } from "../lib/content.functions";

const defaultSocials = {
  social_facebook: "https://www.facebook.com/AnalogIASAcademy",
  social_instagram: "https://www.instagram.com/analogiasacademy/",
  social_youtube: "https://www.youtube.com/c/AnalogIASAcademy",
  social_telegram: "https://t.me/analogiasacademy",
  social_linkedin: "https://www.linkedin.com/company/analogias-academy",
};

const socialMeta = [
  { key: "social_facebook", icon: Facebook, label: "Facebook" },
  { key: "social_instagram", icon: Instagram, label: "Instagram" },
  { key: "social_youtube", icon: Youtube, label: "YouTube" },
  { key: "social_telegram", icon: Send, label: "Telegram" },
  { key: "social_linkedin", icon: Linkedin, label: "LinkedIn" },
] as const;

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/results", label: "Results" },
  { to: "/contact", label: "Contact" },
] as const;

const courseLinks = [
  "UPSC Foundation",
  "UPSC Prelims",
  "UPSC Mains",
  "Interview Guidance",
  "State PSC Courses",
];

function str(c: PageData, key: string, fallback: string): string {
  const v = c[key];
  return typeof v === "string" && v ? v : fallback;
}

export function Footer() {
  const { data } = useQuery({
    queryKey: ["page-content", "footer"],
    queryFn: () => getPageContent({ data: { page: "footer" } }),
    staleTime: 5 * 60 * 1000,
  });
  const c = (data ?? {}) as PageData;

  const tagline = str(
    c,
    "tagline",
    "Building India's future civil servants through expert faculty, structured mentoring and a 25+ year legacy of excellence.",
  );
  const contact = [
    { icon: MapPin, value: str(c, "contact_address", "Ashok Nagar, Hyderabad, Telangana 500020") },
    { icon: Phone, value: str(c, "contact_phone", "+91 98765 43210") },
    { icon: Mail, value: str(c, "contact_email", "info@analogias.com") },
  ].filter((item) => item.value);

  const socials = socialMeta
    .map((s) => ({ ...s, href: str(c, s.key, defaultSocials[s.key]) }))
    .filter((s) => s.href);

  const privacyLabel = str(c, "privacy_label", "Privacy Policy");
  const termsLabel = str(c, "terms_label", "Terms & Conditions");
  const copyright = str(
    c,
    "copyright",
    `© ${new Date().getFullYear()} ANALOG IAS ACADEMY. All rights reserved.`,
  );

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="inline-flex items-center rounded-lg bg-white px-3 py-2">
            <img
              src={logo}
              alt="ANALOG IAS ACADEMY logo"
              width={2250}
              height={740}
              loading="lazy"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <p className="mt-4 text-sm text-primary-foreground/70">{tagline}</p>
          <ul className="mt-5 space-y-2.5">
            {contact.map((item) => (
              <li key={item.value} className="flex items-start gap-2 text-sm text-primary-foreground/75">
                <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">Quick Links</h3>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-gold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">Courses</h3>
          <ul className="mt-4 space-y-2.5">
            {courseLinks.map((course) => (
              <li key={course}>
                <Link
                  to="/courses"
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-gold"
                >
                  {course}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gold">Follow Us</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-lg bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <ul className="mt-6 space-y-2.5">
            <li>
              <Link
                to="/privacy"
                className="text-sm text-primary-foreground/75 transition-colors hover:text-gold"
              >
                {privacyLabel}
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-sm text-primary-foreground/75 transition-colors hover:text-gold"
              >
                {termsLabel}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-primary-foreground/60 sm:flex-row sm:px-6">
          <p>{copyright}</p>
          <Link to="/admin" className="transition-colors hover:text-gold">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
