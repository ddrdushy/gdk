import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { href: "/product", label: "Product" },
      { href: "/passports", label: "Passports" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/use-cases", label: "Use Cases" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "For",
    links: [
      { href: "/start?role=startup", label: "Startups" },
      { href: "/start?role=mentor", label: "Mentors" },
      { href: "/use-cases#accelerators", label: "Accelerators" },
      { href: "/use-cases#government", label: "Government" },
      { href: "/use-cases#universities", label: "Universities" },
      { href: "/use-cases#corporate", label: "Corporate Innovation" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/contact", label: "Request Demo" },
      { href: "/contact", label: "Contact" },
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="relative mt-32 border-t border-navy-100 bg-navy-950 text-navy-100">
      <div className="passport-grain absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-deep to-navy-700 text-white shadow-md">
                <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
              </span>
              <span className="text-base font-semibold tracking-tight text-white">
                TrustPass<span className="text-cyan-glow"> AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-navy-300">
              The digital passport for trusted innovation ecosystems. Verify
              startups and mentors once. Connect them everywhere.
            </p>
            <p className="mt-6 text-xs text-navy-400">
              Powered by Gemini · Built on Google Cloud
            </p>
          </div>

          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold tracking-wide text-white uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-navy-300 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-navy-800 pt-8 md:flex-row md:items-center">
          <p className="text-xs text-navy-400">
            © {new Date().getFullYear()} TrustPass AI. All rights reserved.
          </p>
          <p className="text-xs text-navy-400">
            <span className="font-medium text-navy-300">AI recommends. Humans decide.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
