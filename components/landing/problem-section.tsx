import { Clock, RotateCcw, AlertTriangle, History, Unlink } from "lucide-react";
import { Section, SectionHeading } from "./section";

const PAINS = [
  {
    icon: Clock,
    title: "Manual verification",
    body: "Admins spend hours checking applications, documents, and founder details.",
  },
  {
    icon: RotateCcw,
    title: "Repeated checks",
    body: "Startups and mentors repeat the same verification across every programme.",
  },
  {
    icon: AlertTriangle,
    title: "Inconsistent review",
    body: "Different admins evaluate the same profile differently — no shared standard.",
  },
  {
    icon: History,
    title: "Lost trust history",
    body: "Past verification and engagement data is never reused or carried forward.",
  },
  {
    icon: Unlink,
    title: "Weak linkages",
    body: "Poor verification leads to poor mentor, partner, and programme matching.",
  },
];

export function ProblemSection() {
  return (
    <Section className="bg-navy-50/40 rounded-3xl max-w-[1280px]">
      <SectionHeading
        eyebrow="The problem"
        title="Innovation ecosystems still verify people manually."
        subtitle="Every programme starts from zero. Trust never compounds."
        align="center"
      />
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {PAINS.map((p) => (
          <div
            key={p.title}
            className="group rounded-xl border border-navy-100 bg-white p-5 transition-all hover:border-navy-200 hover:shadow-md"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-100">
              <p.icon className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-navy-900">{p.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-navy-600">
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
