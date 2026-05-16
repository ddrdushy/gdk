import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-navy-50 via-white to-cyan-50" />
      <div className="absolute -top-40 -left-40 -z-10 h-[480px] w-[480px] rounded-full bg-cyan-glow/10 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 -z-10 h-[480px] w-[480px] rounded-full bg-indigo-400/10 blur-3xl" />

      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 text-navy-900">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-navy-800 to-navy-950 text-white shadow-md">
            <ShieldCheck className="h-5 w-5" strokeWidth={2.25} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-cyan-glow ring-2 ring-white" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">
            TrustPass<span className="text-cyan-deep"> AI</span>
          </span>
        </Link>
        <Link href="/" className="text-sm text-navy-600 hover:text-navy-900">
          ← Back to site
        </Link>
      </header>

      <main className="mx-auto flex max-w-md flex-col items-stretch justify-center px-6 pb-16 pt-8">
        {children}
      </main>
    </div>
  );
}
