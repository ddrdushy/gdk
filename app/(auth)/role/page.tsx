"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Rocket, GraduationCap, Building2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dashboardPathForRole, type UserRole } from "@/lib/schemas/user";
import { cn } from "@/lib/utils";

const ROLE_CARDS: Array<{
  id: UserRole;
  icon: typeof Rocket;
  label: string;
  description: string;
}> = [
  {
    id: "startup",
    icon: Rocket,
    label: "Startup Founder",
    description: "Create a Startup Passport. Upload evidence, earn stamps, get matched with mentors and programmes.",
  },
  {
    id: "mentor",
    icon: GraduationCap,
    label: "Mentor",
    description: "Get a Mentor Passport. Verify expertise, receive curated startup requests.",
  },
  {
    id: "partner",
    icon: Building2,
    label: "Partner / Service Provider",
    description: "Connect with pre-verified startups. Offer programmes, services, or pilots.",
  },
  {
    id: "admin",
    icon: ShieldCheck,
    label: "Programme Administrator",
    description: "Review applications, run AI verification, issue passports, activate linkages.",
  },
];

export default function RolePage() {
  const router = useRouter();
  const { user, profile, loading, setRole } = useAuth();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [organisationName, setOrgName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login?redirect=/role");
  }, [loading, user, router]);

  useEffect(() => {
    if (profile?.role) {
      router.replace(dashboardPathForRole(profile.role));
    }
  }, [profile?.role, router]);

  async function onConfirm() {
    if (!selected) return;
    setSaving(true);
    try {
      await setRole(selected, organisationName ? { organisationName } : undefined);
      toast.success("Welcome to TrustPass AI.");
      router.push(dashboardPathForRole(selected));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not save role";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-navy-400" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-navy-100 bg-white p-8 shadow-xl shadow-navy-900/5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy-950">Choose your role</h1>
        <p className="mt-1 text-sm text-navy-600">
          Tell us how you&apos;ll use TrustPass AI so we can route you to the right experience.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {ROLE_CARDS.map((r) => {
          const active = selected === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelected(r.id)}
              className={cn(
                "group rounded-xl border bg-white p-5 text-left transition-all",
                active
                  ? "border-cyan-deep ring-2 ring-cyan-deep/30 shadow-md"
                  : "border-navy-100 hover:border-navy-200 hover:shadow-sm"
              )}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-950 text-cyan-glow shadow-sm">
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 text-[15px] font-semibold text-navy-950">{r.label}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-navy-600">{r.description}</p>
            </button>
          );
        })}
      </div>

      {(selected === "admin" || selected === "partner") && (
        <div className="mt-5 space-y-1.5">
          <Label htmlFor="org">Organisation name</Label>
          <Input
            id="org"
            value={organisationName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Acme Accelerator"
          />
        </div>
      )}

      <div className="mt-7 flex items-center justify-between gap-3">
        <p className="text-xs text-navy-500">You can change this later in settings.</p>
        <Button onClick={onConfirm} variant="primary" size="lg" disabled={!selected || saving}>
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Continue"}
        </Button>
      </div>
    </div>
  );
}
