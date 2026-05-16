import type { Metadata } from "next";
import Link from "next/link";
import { Rocket, GraduationCap, Building2, ShieldCheck, ArrowRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/landing/section";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Start Verification",
  description:
    "Choose your verification path. TrustPass AI guides you through profile creation, evidence submission, AI verification, and passport issuance.",
};

const ROLES = [
  {
    id: "startup",
    icon: Rocket,
    label: "Startup Founder",
    description: "Create a Startup Passport, upload evidence, and earn stamps used across programmes.",
    cta: "Create Startup Passport",
    href: "/signup?role=startup",
    accent: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "mentor",
    icon: GraduationCap,
    label: "Mentor",
    description: "Get a Mentor Passport, prove your expertise, and receive verified startup linkage requests.",
    cta: "Create Mentor Passport",
    href: "/signup?role=mentor",
    accent: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "partner",
    icon: Building2,
    label: "Partner / Service Provider",
    description: "Join the ecosystem partner network and connect with pre-verified, relevant startups.",
    cta: "Join as Partner",
    href: "/signup?role=partner",
    accent: "from-violet-500/20 to-fuchsia-500/20",
  },
  {
    id: "admin",
    icon: ShieldCheck,
    label: "Programme Administrator",
    description: "Request organisation access to run AI verification, review applications, and issue passports.",
    cta: "Request Organisation Access",
    href: "/contact",
    accent: "from-sky-500/20 to-blue-500/20",
  },
];

export default function StartPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Start verification"
          title="Choose your verification path."
          subtitle="TrustPass AI will guide you through profile creation, evidence submission, AI verification, and passport issuance."
          align="center"
        />
      </Section>

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {ROLES.map((role) => (
            <Link
              key={role.id}
              href={role.href}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-7 transition-all",
                "hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-xl"
              )}
            >
              <div className={`absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${role.accent} opacity-0 blur-2xl transition-opacity group-hover:opacity-100`} />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-navy-800 to-navy-950 text-cyan-glow shadow-md">
                  <role.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-navy-950">{role.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-navy-600">{role.description}</p>
                <div className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900 group-hover:text-cyan-deep">
                  {role.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
