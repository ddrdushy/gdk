import type { Metadata } from "next";
import { ContactForm } from "@/components/landing/contact-form";
import { Section, SectionHeading } from "@/components/landing/section";

export const metadata: Metadata = {
  title: "Request Demo",
  description:
    "Tell us about your organisation and we'll show you how TrustPass AI fits your verification workflow.",
};

export default function ContactPage() {
  return (
    <Section>
      <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="lg:sticky lg:top-24">
          <SectionHeading
            eyebrow="Request demo"
            title="Show me how trust scales."
            subtitle="Tell us about your organisation and we'll show you how TrustPass AI fits your verification workflow."
          />
          <ul className="mt-8 space-y-4 text-sm leading-relaxed text-navy-700">
            <li><strong className="text-navy-950">Built for:</strong> accelerators, government innovation agencies, university hubs, corporate innovation teams, ecosystem platforms.</li>
            <li><strong className="text-navy-950">Setup:</strong> 1–2 weeks for a working pilot. Programme criteria, stamp catalogue, and admin workflows configurable.</li>
            <li><strong className="text-navy-950">Security:</strong> Firebase Auth, Firestore Security Rules, audit-ready decision logs. Cloud Run + Secret Manager.</li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}
