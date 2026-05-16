import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "./section";

export function FinalCTA() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-navy-950 lg:text-5xl">
          Start building a trusted
          <br />
          innovation ecosystem.
        </h2>
        <p className="mt-5 text-lg text-navy-600">
          Verify once. Connect everywhere.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild variant="primary" size="lg" className="group">
            <Link href="/start">
              Start Verification
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Request Demo</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
