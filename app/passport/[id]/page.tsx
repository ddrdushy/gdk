import { notFound } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { adminDb } from "@/lib/firebase/admin";
import { startupProfileSchema } from "@/lib/schemas/passport";
import {
  evidenceAgentSchema,
  eligibilityAgentSchema,
  readinessAgentSchema,
  stampAgentSchema,
  linkageAgentSchema,
} from "@/lib/schemas/verification";
import { PassportDetail } from "@/components/passport/passport-detail";
import { ViewTracker } from "@/components/passport/view-tracker";
import { formatPassportId } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 60;

interface PublicPassportPageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicPassportPage({ params }: PublicPassportPageProps) {
  const { id } = await params;

  let profileData: unknown;
  let runData: unknown;
  let fetchFailed = false;
  try {
    const db = adminDb();
    const [profileSnap, runSnap] = await Promise.all([
      db.collection("startups").doc(id).get(),
      db.collection("verification_results").doc(id).get(),
    ]);
    profileData = profileSnap.exists ? profileSnap.data() : null;
    runData = runSnap.exists ? runSnap.data() : null;
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
  if (!profileData) return notFound();

  const profileParsed = startupProfileSchema.safeParse(profileData);
  if (!profileParsed.success) return notFound();

  const run = (runData as Record<string, unknown> | null) ?? null;
  const evidence = run?.evidence ? evidenceAgentSchema.safeParse(run.evidence).data : undefined;
  const eligibility = run?.eligibility ? eligibilityAgentSchema.safeParse(run.eligibility).data : undefined;
  const readiness = run?.readiness ? readinessAgentSchema.safeParse(run.readiness).data : undefined;
  const stamps = run?.stamps ? stampAgentSchema.safeParse(run.stamps).data : undefined;
  const linkage = run?.linkage ? linkageAgentSchema.safeParse(run.linkage).data : undefined;

  const passportId = formatPassportId("ST", new Date().getFullYear(), 1);

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
            Public passport · verified credentials
          </p>
          <Link
            href="/start"
            className="inline-flex items-center gap-1 text-sm font-medium text-navy-700 hover:text-navy-900"
          >
            Get your own passport <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </header>
      <PassportDetail
        profile={profileParsed.data}
        passportId={passportId}
        evidence={evidence}
        eligibility={eligibility}
        readiness={readiness}
        stamps={stamps}
        linkage={linkage}
        publicView
      />
      <ViewTracker passportId={id} />
    </div>
  );
}
