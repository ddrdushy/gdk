import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { adminDb } from "@/lib/firebase/admin";
import { startupProfileSchema } from "@/lib/schemas/passport";
import { mentorProfileSchema } from "@/lib/schemas/mentor";
import {
  evidenceAgentSchema,
  eligibilityAgentSchema,
  readinessAgentSchema,
  stampAgentSchema,
  linkageAgentSchema,
} from "@/lib/schemas/verification";
import {
  mentorEvidenceSchema,
  mentorEligibilitySchema,
  mentorReadinessSchema,
  mentorStampsSchema,
  mentorMatchesSchema,
} from "@/lib/schemas/mentor-verification";
import { PassportDetail } from "@/components/passport/passport-detail";
import { MentorPassportDetail } from "@/components/passport/mentor-passport-detail";
import { ViewTracker } from "@/components/passport/view-tracker";
import { formatPassportId } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface PublicPassportPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicPassportPage({ params }: PublicPassportPageProps) {
  const { id } = await params;

  let kind: "startup" | "mentor" | null = null;
  let profileData: Record<string, unknown> | null = null;
  let runData: Record<string, unknown> | null = null;
  let fetchFailed = false;
  try {
    const db = adminDb();
    const [startupSnap, mentorSnap, runSnap] = await Promise.all([
      db.collection("startups").doc(id).get(),
      db.collection("mentors").doc(id).get(),
      db.collection("verification_results").doc(id).get(),
    ]);
    if (startupSnap.exists) {
      kind = "startup";
      profileData = startupSnap.data() ?? null;
    } else if (mentorSnap.exists) {
      kind = "mentor";
      profileData = mentorSnap.data() ?? null;
    }
    runData = runSnap.exists ? (runSnap.data() ?? null) : null;
  } catch (err) {
    console.error("failed to load public passport", err);
    fetchFailed = true;
  }

  if (fetchFailed) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-navy-950">Verification temporarily unavailable.</h1>
        <p className="mt-2 text-navy-600">
          We could not load this passport right now. The owner can refresh the share link.
        </p>
      </div>
    );
  }
  if (!profileData || !kind) return notFound();

  const passportId = formatPassportId(kind === "mentor" ? "MN" : "ST", new Date().getFullYear(), 1);

  return (
    <div className="min-h-screen bg-navy-50/30">
      <header className="border-b border-navy-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-navy-900">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-950 text-white shadow-md">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-glow ring-2 ring-white" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              TrustPass<span className="text-cyan-deep"> AI</span>
            </span>
          </Link>
          <p className="hidden text-xs text-navy-500 md:block">
            Public {kind === "mentor" ? "mentor" : "startup"} passport · verified credentials
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900"
          >
            Get your own passport <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {kind === "startup" ? renderStartup(profileData, runData, passportId) : renderMentor(profileData, runData, passportId)}

      <ViewTracker passportId={id} />
    </div>
  );
}

function renderStartup(
  profileData: Record<string, unknown>,
  run: Record<string, unknown> | null,
  passportId: string
) {
  const parsed = startupProfileSchema.safeParse(profileData);
  if (!parsed.success) return notFound();
  return (
    <PassportDetail
      profile={parsed.data}
      passportId={passportId}
      evidence={run?.evidence ? evidenceAgentSchema.safeParse(run.evidence).data : undefined}
      eligibility={run?.eligibility ? eligibilityAgentSchema.safeParse(run.eligibility).data : undefined}
      readiness={run?.readiness ? readinessAgentSchema.safeParse(run.readiness).data : undefined}
      stamps={run?.stamps ? stampAgentSchema.safeParse(run.stamps).data : undefined}
      linkage={run?.linkage ? linkageAgentSchema.safeParse(run.linkage).data : undefined}
      publicView
    />
  );
}

function renderMentor(
  profileData: Record<string, unknown>,
  run: Record<string, unknown> | null,
  passportId: string
) {
  const parsed = mentorProfileSchema.safeParse(profileData);
  if (!parsed.success) return notFound();
  return (
    <MentorPassportDetail
      profile={parsed.data}
      passportId={passportId}
      evidence={run?.evidence ? mentorEvidenceSchema.safeParse(run.evidence).data : undefined}
      eligibility={run?.eligibility ? mentorEligibilitySchema.safeParse(run.eligibility).data : undefined}
      readiness={run?.readiness ? mentorReadinessSchema.safeParse(run.readiness).data : undefined}
      stamps={run?.stamps ? mentorStampsSchema.safeParse(run.stamps).data : undefined}
      matches={run?.matches ? mentorMatchesSchema.safeParse(run.matches).data : undefined}
      publicView
    />
  );
}
