import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/landing/section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free for individual founders and mentors. Programme and ecosystem plans available on request.",
};

const PLANS = [
  {
    name: "Founder",
    price: "Free",
    detail: "for verified startups",
    bullets: [
      "Startup Passport with stamps",
      "Reusable across programmes",
      "Public verification link",
      "Up to 5 evidence documents",
      "AI-assisted profile builder",
    ],
    cta: { label: "Start verification", href: "/start?role=startup" },
    accent: false,
  },
  {
    name: "Programme",
    price: "Custom",
    detail: "for accelerators & agencies",
    bullets: [
      "Everything in Founder",
      "Admin Verification Workspace",
      "AI eligibility & readiness scoring",
      "Linkage recommendations",
      "Audit-ready decision logs",
      "Multi-admin collaboration",
      "Custom programme criteria",
    ],
    cta: { label: "Request demo", href: "/contact" },
    accent: true,
  },
  {
    name: "Ecosystem",
    price: "Custom",
    detail: "for governments & networks",
    bullets: [
      "Everything in Programme",
      "Cross-programme passport reuse",
      "Regional / national reporting",
      "Custom stamp catalogue",
      "Dedicated support",
      "SLA + on-prem options",
    ],
    cta: { label: "Talk to us", href: "/contact" },
    accent: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Pricing"
          title="Free for founders. Custom for ecosystems."
          subtitle="Individuals never pay to be verified. Organisations pay for the workflow, scale, and reporting."
          align="center"
        />
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-8 transition-all",
                plan.accent
                  ? "border-navy-900 shadow-xl shadow-navy-900/10 scale-[1.02]"
                  : "border-navy-100 shadow-sm"
              )}
            >
              {plan.accent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-navy-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-glow shadow-lg">
                  Most popular
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-navy-950">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-navy-950">{plan.price}</span>
                  <span className="text-sm text-navy-500">— {plan.detail}</span>
                </div>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-navy-700">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={plan.accent ? "primary" : "outline"}
                size="lg"
                className="mt-8 w-full"
              >
                <Link href={plan.cta.href}>{plan.cta.label}</Link>
              </Button>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
