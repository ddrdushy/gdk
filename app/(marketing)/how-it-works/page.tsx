import type { Metadata } from "next";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { SolutionFlow } from "@/components/landing/solution-flow";
import { Section, SectionHeading } from "@/components/landing/section";
import { FinalCTA } from "@/components/landing/final-cta";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From application to passport issuance in five steps — powered by Gemini agents and human review.",
};

export default function HowItWorksPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="From application to ecosystem activation."
          subtitle="Every passport goes through the same five-step pipeline — visible to founders, mentors, and admins alike."
        />
      </Section>
      <SolutionFlow />
      <HowItWorksSection />
      <FinalCTA />
    </>
  );
}
