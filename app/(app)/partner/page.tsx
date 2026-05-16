"use client";

import { Building2, Network } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PartnerDashboard() {
  const { profile } = useAuth();
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
          Partner dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
          {profile?.organisationName ?? "Ecosystem Partner"}
        </h1>
        <p className="mt-1 text-sm text-navy-600">
          Connect with pre-verified startups that match your services.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <Badge variant="outline">Linkage requests</Badge>
            <p className="mt-3 text-2xl font-semibold text-navy-950">0 pending</p>
            <p className="mt-1 text-sm text-navy-600">Startups matched to your offering.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Badge variant="outline">Active engagements</Badge>
            <p className="mt-3 text-2xl font-semibold text-navy-950">0</p>
            <p className="mt-1 text-sm text-navy-600">In-progress collaborations.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Badge variant="outline">Feedback submitted</Badge>
            <p className="mt-3 text-2xl font-semibold text-navy-950">0</p>
            <p className="mt-1 text-sm text-navy-600">Closes the loop on every linkage.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-navy-200 bg-white p-10 text-center">
        <Network className="mx-auto h-10 w-10 text-navy-300" />
        <h2 className="mt-3 text-lg font-semibold text-navy-900">
          Your linkage inbox will appear here.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-navy-600">
          We&apos;ll surface only startups that match your sector, services, and stage.
        </p>
      </div>
    </div>
  );
}
