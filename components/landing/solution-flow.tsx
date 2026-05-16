import { FileText, Sparkles, UserCheck, BadgeCheck, Stamp, Network } from "lucide-react";
import { Section, SectionHeading } from "./section";

const STEPS = [
  { icon: FileText, label: "Apply" },
  { icon: Sparkles, label: "AI Verify" },
  { icon: UserCheck, label: "Human Review" },
  { icon: BadgeCheck, label: "Passport Issued" },
  { icon: Stamp, label: "Stamps Earned" },
  { icon: Network, label: "Linkages Activated" },
];

export function SolutionFlow() {
  return (
    <Section>
      <SectionHeading
        eyebrow="The solution"
        title="TrustPass AI converts manual verification into reusable digital passports."
        subtitle="One verification. Every stamp recorded. Carried across the ecosystem."
        align="center"
      />

      <div className="mt-14">
        <div className="hidden lg:flex items-center justify-between gap-2">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center text-center">
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 text-white shadow-lg ring-1 ring-white/10">
                  <s.icon className="h-6 w-6 text-cyan-glow" strokeWidth={2} />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-navy-900 shadow ring-1 ring-navy-100">
                    {i + 1}
                  </span>
                </div>
                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-navy-700">
                  {s.label}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="mx-2 h-px flex-1 bg-gradient-to-r from-navy-200 via-cyan-deep/40 to-navy-200" />
              )}
            </div>
          ))}
        </div>

        <div className="lg:hidden grid grid-cols-2 gap-4 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-3 rounded-xl border border-navy-100 bg-white p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-cyan-glow">
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-navy-500">Step {i + 1}</p>
                <p className="text-sm font-medium text-navy-900">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
