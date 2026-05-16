import type { Metadata } from "next";
import {
  Sparkles,
  Award,
  ScanSearch,
  Users,
  ScrollText,
  Network,
  Link as LinkIcon,
  FileBarChart2,
  ShieldCheck,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/landing/section";
import { FinalCTA } from "@/components/landing/final-cta";

export const metadata: Metadata = {
  title: "Product",
  description:
    "TrustPass AI: AI-powered verification, digital passports, stamps and badges, and ecosystem linkages — explained.",
};

const FEATURES = [
  {
    icon: Award,
    title: "Startup Passport",
    who: "Founders",
    why: "Get verified once, reuse the same proof across every accelerator, grant, and mentor relationship.",
    output: "A digital booklet with status, sector, stage, stamps, and a public verification link.",
  },
  {
    icon: Users,
    title: "Mentor Passport",
    who: "Mentors & advisors",
    why: "Verified expertise + a transparent track record turns mentorship into trusted infrastructure.",
    output: "A passport showing expertise areas, sector focus, and stamps like Mentor Approved and High Impact Mentor.",
  },
  {
    icon: Sparkles,
    title: "AI Verification Engine",
    who: "Programme admins",
    why: "Seven Gemini-powered agents read evidence, score readiness, flag risk, and recommend stamps — with explanations.",
    output: "Eligibility score, readiness score, risk level, evidence gaps, and stamp recommendations.",
  },
  {
    icon: ShieldCheck,
    title: "Human Review Workflow",
    who: "Programme admins",
    why: "AI accelerates judgement, but humans approve every passport, stamp, and linkage.",
    output: "Approve / conditionally approve / request evidence — every decision logged.",
  },
  {
    icon: ScrollText,
    title: "Digital Stamps & Badges",
    who: "Whole ecosystem",
    why: "Verification milestones become portable, visible, and reusable.",
    output: "Earned, pending, and locked stamps with descriptions and criteria.",
  },
  {
    icon: Network,
    title: "Ecosystem Linkage Recommendations",
    who: "Programme admins, partners",
    why: "Recommend mentors, partners, programmes, or services — sequenced by readiness, not random matching.",
    output: "Ordered linkage list with AI reasoning + admin approval.",
  },
  {
    icon: LinkIcon,
    title: "Public Verification Link",
    who: "Anyone with the link or QR",
    why: "Investors, partners, and programmes can verify a passport in one click.",
    output: "Read-only public page showing passport, status, and earned stamps.",
  },
  {
    icon: FileBarChart2,
    title: "Reporting & Governance",
    who: "Ecosystem owners",
    why: "Aggregate verification, readiness, and linkage data across programmes for funders and regulators.",
    output: "Cohort-level dashboards + auditable decision trail.",
  },
  {
    icon: ScanSearch,
    title: "AI-Assisted Data Entry",
    who: "Founders & mentors",
    why: "No long forms. Upload a pitch deck or paste a website — Gemini extracts the profile with confidence scoring.",
    output: "Pre-filled passport profile with per-field confidence and a list of missing fields.",
  },
];

export default function ProductPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Product"
          title="A trust infrastructure layer for innovation ecosystems."
          subtitle="TrustPass AI is not a CRM, not a form system, not a dashboard. It is the verification layer that sits between people, programmes, and decisions."
        />
      </Section>

      <Section>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-navy-100 bg-white p-6 transition-all hover:border-cyan-deep/30 hover:shadow-lg"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-950 text-cyan-glow shadow-sm">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-navy-950">{f.title}</h3>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-cyan-deep font-medium">{f.who}</p>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">{f.why}</p>
              <div className="mt-4 rounded-lg bg-navy-50/60 p-3 text-[12.5px] leading-relaxed text-navy-700">
                <span className="font-semibold text-navy-900">Output:</span> {f.output}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}
