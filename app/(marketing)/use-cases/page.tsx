import type { Metadata } from "next";
import { UseCasesSection } from "@/components/landing/use-cases-section";
import { Section, SectionHeading } from "@/components/landing/section";
import { FinalCTA } from "@/components/landing/final-cta";

export const metadata: Metadata = {
  title: "Use Cases",
  description:
    "Accelerators, governments, universities, and corporate innovation teams use TrustPass AI to scale trusted verification.",
};

export default function UseCasesPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Use cases"
          title="One trust layer. Every ecosystem actor."
          subtitle="TrustPass AI fits the way every ecosystem already verifies — accelerators, agencies, universities, and corporates."
        />
      </Section>
      <UseCasesSection />
      <FinalCTA />
    </>
  );
}
