"use client";

import Link from "next/link";
import { ShieldCheck, Inbox, BadgeCheck, Network } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const { profile } = useAuth();
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
          Admin workspace
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
          {profile?.organisationName ?? "Programme Admin"}
        </h1>
        <p className="mt-1 text-sm text-navy-600">
          Review applications, run AI verification, issue passports, and activate linkages.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Pending review", value: 0, icon: Inbox, href: "/admin/review-queue" },
          { label: "Verified this month", value: 0, icon: BadgeCheck, href: "/admin/passports" },
          { label: "Active linkages", value: 0, icon: Network, href: "/admin/linkages" },
          { label: "Stamps issued", value: 0, icon: ShieldCheck, href: "/admin/stamps" },
        ].map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <Badge variant="outline">{m.label}</Badge>
                <m.icon className="h-4 w-4 text-navy-400" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-navy-950">{m.value}</p>
              <Button asChild variant="link" className="mt-1 px-0 text-xs">
                <Link href={m.href}>Open →</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-navy-200 bg-white p-10 text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-navy-300" />
        <h2 className="mt-3 text-lg font-semibold text-navy-900">
          Your review queue will appear here.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-navy-600">
          When founders and mentors submit for verification, you&apos;ll see AI recommendations,
          readiness scores, evidence gaps, and risk flags — ready for human review.
        </p>
      </div>
    </div>
  );
}
