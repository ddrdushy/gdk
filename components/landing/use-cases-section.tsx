import { Rocket, Landmark, GraduationCap, Building2, Globe2 } from "lucide-react";
import { Section, SectionHeading } from "./section";

const USE_CASES = [
  {
    id: "accelerators",
    icon: Rocket,
    label: "Accelerators",
    body: "Verify startup cohorts faster and reduce repeated manual review.",
    accent: "from-amber-400/30 to-orange-400/30",
  },
  {
    id: "government",
    icon: Landmark,
    label: "Government Agency",
    body: "Create reusable trust credentials across national or regional innovation programmes.",
    accent: "from-indigo-400/30 to-blue-400/30",
  },
  {
    id: "universities",
    icon: GraduationCap,
    label: "University Innovation Hub",
    body: "Assess student, research, and spin-off startups with consistent readiness scoring.",
    accent: "from-emerald-400/30 to-teal-400/30",
  },
  {
    id: "corporate",
    icon: Building2,
    label: "Corporate Innovation",
    body: "Identify pilot-ready startups before introducing them to business units.",
    accent: "from-rose-400/30 to-pink-400/30",
  },
  {
    id: "ecosystem",
    icon: Globe2,
    label: "Ecosystem Platform",
    body: "Turn ecosystem participants into verified, reusable trust profiles.",
    accent: "from-cyan-400/30 to-sky-400/30",
  },
];

export function UseCasesSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Built for"
        title="One verification layer. Every ecosystem actor."
        subtitle="Whether you run an accelerator, a national programme, a university hub, or a corporate innovation team — TrustPass AI fits the way you already verify."
        align="center"
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {USE_CASES.map((u) => (
          <div
            key={u.id}
            id={u.id}
            className="group relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${u.accent} opacity-0 transition-opacity group-hover:opacity-100`} />
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950 text-cyan-glow shadow-md">
                <u.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-[15px] font-semibold text-navy-950">{u.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{u.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
