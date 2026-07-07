import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, GraduationCap } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/courses", label: "Courses" },
  { to: "/results", label: "Results" },
  
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-soft">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-base font-extrabold text-primary">ANALOG IAS</span>
            <span className="truncate text-[0.65rem] font-semibold tracking-[0.2em] text-gold">
              ACADEMY
            </span>
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                activeProps={{ className: "text-primary bg-accent" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          to="/contact"
          className="hidden rounded-lg bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground shadow-gold transition-transform hover:-translate-y-0.5 md:inline-flex"
        >
          Enroll Now
        </Link>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-primary md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
                  activeProps={{ className: "text-primary bg-accent" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="py-2">
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-secondary px-5 py-3 text-center text-sm font-semibold text-secondary-foreground"
              >
                Enroll Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
