import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Linkedin, Send } from "lucide-react";
import logo from "../assets/analog-logo.png";

const socials = [
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/AnalogIASAcademy" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/analogiasacademy/" },
  { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/c/AnalogIASAcademy" },
  { icon: Send, label: "Telegram", href: "https://t.me/analogiasacademy" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/analogias-academy" },
];

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

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={logo}
              alt="ANALOG IAS ACADEMY logo"
              width={40}
              height={40}
              loading="lazy"
              className="h-10 w-10 rounded-lg object-contain"
            />
            <span className="flex flex-col leading-tight">
              <span className="text-base font-extrabold">ANALOG IAS</span>
              <span className="text-[0.65rem] font-semibold tracking-[0.2em] text-gold">
                ACADEMY
              </span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-primary-foreground/70">
            Building India's future civil servants through expert faculty, structured mentoring and a
            25+ year legacy of excellence.
          </p>
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
            {courseLinks.map((c) => (
              <li key={c}>
                <Link
                  to="/courses"
                  className="text-sm text-primary-foreground/75 transition-colors hover:text-gold"
                >
                  {c}
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
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-sm text-primary-foreground/75 transition-colors hover:text-gold"
              >
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-center text-xs text-primary-foreground/60 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} ANALOG IAS ACADEMY. All rights reserved.</p>
          <Link to="/admin" className="transition-colors hover:text-gold">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
