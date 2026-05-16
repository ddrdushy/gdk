"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { dashboardPathForRole } from "@/lib/schemas/user";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname ?? "/")}`);
    }
  }, [loading, user, router, pathname]);

  useEffect(() => {
    if (!loading && user && profile && !profile.role) {
      router.replace("/role");
    }
  }, [loading, user, profile, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-50/30">
        <Loader2 className="h-6 w-6 animate-spin text-navy-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50/30">
      <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            href={profile?.role ? dashboardPathForRole(profile.role) : "/role"}
            className="flex items-center gap-2 text-navy-900"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-950 text-white shadow-md">
              <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-glow ring-2 ring-white" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">
              TrustPass<span className="text-cyan-deep"> AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {profile?.displayName && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-navy-900">{profile.displayName}</p>
                <p className="text-[11px] uppercase tracking-wider text-navy-500">{profile.role ?? "no role"}</p>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={async () => { await signOut(); router.push("/"); }}>
              <LogOut className="h-4 w-4" /> Log out
            </Button>
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
