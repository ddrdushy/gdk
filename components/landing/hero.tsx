"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PassportBooklet } from "@/components/passport/passport-booklet";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* background layers */}
      <div className="absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-glow/20 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[400px] w-[600px] rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* left column — copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-white/80 px-3 py-1.5 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-deep" />
              <span className="text-xs font-medium text-navy-700">
                Now in private beta · Powered by Gemini
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-tight text-navy-950 sm:text-5xl lg:text-6xl"
            >
              The digital passport for{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 bg-gradient-to-br from-cyan-deep via-cyan-deep to-navy-700 bg-clip-text text-transparent">
                  trusted innovation
                </span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-3 rounded-sm bg-cyan-glow/20" />
              </span>{" "}
              ecosystems.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-navy-600"
            >
              TrustPass AI verifies startups and mentors, issues digital
              passports with stamps and badges, and helps ecosystem owners
              activate trusted linkages across programmes, partners, and regions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild variant="primary" size="lg" className="group">
                <Link href="/start">
                  Start Verification
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Request Demo</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-navy-500"
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                AI-assisted verification
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Human-reviewed decisions
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Audit-ready workflow
              </span>
            </motion.div>
          </div>

          {/* right column — passport */}
          <div className="relative">
            <div className="relative mx-auto max-w-md" style={{ perspective: "1200px" }}>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <PassportBooklet
                  type="startup"
                  holderName="MediNova AI"
                  subtitle="HealthTech · MVP · Malaysia"
                  passportId="TP-ST-2026-001"
                  status="Conditionally Verified"
                  stamps={[
                    { key: "identity-verified", status: "earned" },
                    { key: "pitch-deck-reviewed", status: "earned" },
                    { key: "programme-eligible", status: "earned" },
                    { key: "pilot-ready", status: "pending" },
                    { key: "compliance-reviewed", status: "pending" },
                    { key: "funding-ready", status: "locked" },
                  ]}
                />
              </motion.div>
              {/* mentor passport peek */}
              <motion.div
                initial={{ opacity: 0, x: 30, rotate: 8 }}
                animate={{ opacity: 1, x: 0, rotate: 6 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="absolute -right-12 top-12 hidden w-44 -z-10 md:block"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-navy-700 to-navy-900 shadow-xl ring-1 ring-white/10">
                  <div className="passport-foil absolute inset-0 opacity-30 mix-blend-overlay" />
                  <div className="relative flex h-full flex-col items-center justify-center p-4 text-center text-white">
                    <ShieldCheck className="h-8 w-8 text-cyan-glow" />
                    <p className="mt-2 text-[8px] font-semibold uppercase tracking-[0.22em] text-cyan-glow/90">
                      Mentor Passport
                    </p>
                    <p className="mt-1 text-xs font-semibold">Dr. Sarah Lim</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
