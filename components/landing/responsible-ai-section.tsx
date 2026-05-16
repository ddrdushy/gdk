import { ShieldCheck, Users, FileSearch, RefreshCcw, AlertCircle, BookOpen } from "lucide-react";
import { Section } from "./section";

const POINTS = [
  { icon: ShieldCheck, body: "AI never rejects users automatically — only humans decide." },
  { icon: Users, body: "Admins approve every final verification decision." },
  { icon: BookOpen, body: "Every recommendation comes with a transparent explanation." },
  { icon: FileSearch, body: "Users can submit missing evidence to update their passport." },
  { icon: AlertCircle, body: "Risk flags are review signals — never final judgments." },
  { icon: RefreshCcw, body: "Passports can be renewed, updated, or revoked by authorised admins." },
];

export function ResponsibleAISection() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 px-8 py-16 lg:px-16 lg:py-20 text-white shadow-2xl">
        <div className="passport-grain absolute inset-0 opacity-40" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan-glow/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-indigo-400/15 blur-3xl" />

        <div className="relative grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-glow">
              Responsible AI
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight lg:text-5xl">
              AI recommends.
              <br />
              <span className="text-cyan-glow">Humans decide.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-navy-200">
              Verification affects access to opportunity. TrustPass AI was built
              so that intelligence accelerates judgment — it never replaces it.
            </p>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2">
            {POINTS.map((p) => (
              <li
                key={p.body}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <div className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-cyan-glow/15 text-cyan-glow ring-1 ring-cyan-glow/30">
                  <p.icon className="h-3.5 w-3.5" />
                </div>
                <p className="text-[13.5px] leading-relaxed text-navy-100">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
