import { Hero } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionFlow } from "@/components/landing/solution-flow";
import { PassportPreviewSection } from "@/components/landing/passport-preview";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { UseCasesSection } from "@/components/landing/use-cases-section";
import { ResponsibleAISection } from "@/components/landing/responsible-ai-section";
import { FinalCTA } from "@/components/landing/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionFlow />
      <PassportPreviewSection />
      <HowItWorksSection />
      <UseCasesSection />
      <ResponsibleAISection />
      <FinalCTA />
    </>
  );
}
