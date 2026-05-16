import { ClipboardList, BrainCircuit, UserCheck, Award, Network } from "lucide-react";
import { Section, SectionHeading } from "./section";

const STEPS = [
  {
    n: "01",
    icon: ClipboardList,
    title: "Submit profile",
    body: "Startup or mentor submits profile and evidence. Upload a pitch deck, paste a website, or describe in plain language.",
  },
  {
    n: "02",
    icon: BrainCircuit,
    title: "AI verification",
    body: "Seven agents check identity, eligibility, readiness, risk, and missing evidence — and return structured explanations.",
  },
  {
    n: "03",
    icon: UserCheck,
    title: "Human review",
    body: "Admin reviews AI explanations and approves, conditionally approves, or requests more evidence. Humans stay in control.",
  },
  {
    n: "04",
    icon: Award,
    title: "Passport issued",
    body: "Verified participant receives a digital Startup or Mentor Passport with earned stamps, status badge, QR, and a public verification link.",
  },
  {
    n: "05",
    icon: Network,
    title: "Linkages activated",
    body: "The passport unlocks recommended mentors, partners, programmes, and service providers — sequenced by readiness.",
  },
];

export function HowItWorksSection() {
  return (
    <Section className="bg-gradient-to-b from-navy-50/40 to-transparent rounded-3xl max-w-[1280px]">
      <SectionHeading
        eyebrow="How it works"
        title="From application to ecosystem activation, in 5 steps."
        align="center"
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="group relative overflow-hidden rounded-2xl border border-navy-100 bg-white p-6 transition-all hover:border-cyan-deep/30 hover:shadow-lg"
          >
            <div className="absolute -top-4 -right-4 text-[80px] font-bold leading-none text-navy-50 select-none">
              {s.n}
            </div>
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-950 text-cyan-glow shadow-sm">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-navy-950">{s.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-navy-600">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
