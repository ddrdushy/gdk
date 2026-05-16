"use client";

import Link from "next/link";
import { Rocket, FileUp, BadgeCheck, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function FounderDashboard() {
  const { profile } = useAuth();
  return (
    <div className="mx-auto max-w-6xl px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
            Founder dashboard
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-navy-950">
            Welcome{profile?.displayName ? `, ${profile.displayName.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-1 text-sm text-navy-600">
            Build your Startup Passport. Once verified, you can share it across every programme.
          </p>
        </div>
        <Button asChild variant="primary" size="lg" className="mt-4 sm:mt-0">
          <Link href="/founder/passport/new">
            <Rocket className="h-4 w-4" /> Create Startup Passport
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <Badge variant="outline">Passport</Badge>
            <p className="mt-3 text-2xl font-semibold text-navy-950">Not started</p>
            <p className="mt-1 text-sm text-navy-600">Begin with a pitch deck or paste a description.</p>
            <Button asChild variant="link" className="mt-2 px-0">
              <Link href="/founder/passport/new">
                Start now <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Badge variant="outline">Evidence</Badge>
            <p className="mt-3 text-2xl font-semibold text-navy-950">0 documents</p>
            <p className="mt-1 text-sm text-navy-600">Pitch deck, registration docs, traction proof.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <Badge variant="outline">Stamps</Badge>
            <p className="mt-3 text-2xl font-semibold text-navy-950">0 earned</p>
            <p className="mt-1 text-sm text-navy-600">Stamps are issued after verification.</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-navy-200 bg-white p-10 text-center">
        <BadgeCheck className="mx-auto h-10 w-10 text-navy-300" />
        <h2 className="mt-3 text-lg font-semibold text-navy-900">
          Your passport will appear here after verification.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-navy-600">
          Create your profile, upload evidence, and let TrustPass AI prepare a verification report.
          A human admin will issue your final passport.
        </p>
        <Button asChild variant="outline" className="mt-5">
          <Link href="/founder/passport/new">
            <FileUp className="h-4 w-4" /> Start verification
          </Link>
        </Button>
      </div>
    </div>
  );
}
