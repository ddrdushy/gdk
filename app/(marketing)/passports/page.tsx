import type { Metadata } from "next";
import { CheckCircle2, Stamp, ShieldCheck, QrCode, Repeat, Calendar } from "lucide-react";
import { Section, SectionHeading } from "@/components/landing/section";
import { PassportPreviewSection } from "@/components/landing/passport-preview";
import { FinalCTA } from "@/components/landing/final-cta";

export const metadata: Metadata = {
  title: "The Passport Concept",
  description:
    "Why TrustPass AI built a passport — and how Startup, Mentor, and future Partner passports work.",
};

const LIFECYCLE = [
  {
    icon: ShieldCheck,
    title: "Why a passport?",
    body: "Trust should not be invisible. By giving verified participants a portable digital credential, the ecosystem can recognise them without re-verifying them.",
  },
  {
    icon: Stamp,
    title: "Stamps",
    body: "Each verified milestone earns a stamp — Identity Verified, Pitch Deck Reviewed, Programme Eligible, Pilot Ready. Stamps can be earned, pending, or locked.",
  },
  {
    icon: CheckCircle2,
    title: "Badges",
    body: "Badges aggregate stamps into status: Verified, Conditionally Verified, Pending Evidence. They are the at-a-glance signal for the ecosystem.",
  },
  {
    icon: QrCode,
    title: "Public verification",
    body: "Every passport gets a QR code and a public read-only link. Investors, partners, and programmes can verify in one click.",
  },
  {
    icon: Repeat,
    title: "Reuse",
    body: "One verification, many programmes. Carry your passport across accelerators, agencies, universities, and corporates.",
  },
  {
    icon: Calendar,
    title: "Lifecycle",
    body: "Passports remain valid for 90+ days, then trigger a review reminder. Authorised admins can renew, update, or revoke at any time.",
  },
];

export default function PassportConceptPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="The passport"
          title="Trust, made portable."
          subtitle="Instead of hiding verification inside an admin system, TrustPass AI gives every verified participant a portable digital credential."
        />
      </Section>

      <PassportPreviewSection />

      <Section>
        <SectionHeading
          eyebrow="Concept"
          title="How the passport works"
          align="center"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {LIFECYCLE.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-navy-100 bg-white p-6 transition-all hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-deep ring-1 ring-cyan-100">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-navy-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <FinalCTA />
    </>
  );
}
