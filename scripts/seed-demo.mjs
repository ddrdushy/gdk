#!/usr/bin/env node
/**
 * Seed realistic demo data into Firebase.
 *
 *   node scripts/seed-demo.mjs            — create all demo users + data
 *   node scripts/seed-demo.mjs --clean    — delete all demo accounts first
 *
 * Reads FIREBASE_SERVICE_ACCOUNT_JSON from .env.local. Idempotent: re-running
 * upserts on existing UIDs (deterministic per email).
 *
 * After running, judges can log into the app at http://localhost:3000/login
 * with any of the seeded credentials printed at the end.
 */

import admin from "firebase-admin";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── load env ────────────────────────────────────────────────────────────────
const envText = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
const saLine = envText.split("\n").find((l) => l.startsWith("FIREBASE_SERVICE_ACCOUNT_JSON="));
if (!saLine) {
  console.error("FIREBASE_SERVICE_ACCOUNT_JSON missing in .env.local");
  process.exit(1);
}
const sa = JSON.parse(saLine.slice("FIREBASE_SERVICE_ACCOUNT_JSON=".length));
admin.initializeApp({ credential: admin.credential.cert(sa) });

const auth = admin.auth();
const db = admin.firestore();
const { FieldValue } = admin.firestore;

// ── personas ────────────────────────────────────────────────────────────────
const DEMO_PASSWORD = "DemoPass!2026";

const PERSONAS = [
  // ── founders ───
  {
    kind: "startup",
    email: "founder.medinova@trustpass.demo",
    displayName: "Dr. Aliya Khan",
    profile: {
      startupName: "MediNova AI",
      sector: "HealthTech",
      country: "Malaysia",
      stage: "MVP",
      founderName: "Dr. Aliya Khan",
      productSummary: "AI triage assistant for hospital emergency rooms — flags acuity in real time and routes patients to the right care path.",
      problemSolved: "Long ER triage queues mean acute patients wait behind low-acuity walk-ins; manual triage is slow and inconsistent.",
      targetCustomers: "Public + private hospital networks across Southeast Asia",
      businessModel: "SaaS subscription per bed, per month",
      supportNeeded: "Clinical advisor with hospital compliance background; pilot partner for second deployment site",
      traction: "Live pilot at Sunway Medical Centre, 38% triage time reduction over 90 days",
      websiteUrl: "https://medinova.ai",
      teamSize: 6,
      fundingStatus: "Bootstrapped, planning USD 500k pre-seed Q1 2026",
    },
    status: "ai-verified",
    verification: medinovaResults(),
  },
  {
    kind: "startup",
    email: "founder.greenlogix@trustpass.demo",
    displayName: "Tan Wei Sheng",
    profile: {
      startupName: "GreenLogix",
      sector: "CleanTech",
      country: "Singapore",
      stage: "Early Revenue",
      founderName: "Tan Wei Sheng",
      productSummary: "Carbon-accounting platform for SEA logistics operators with automatic emissions reporting for ESG audits.",
      problemSolved: "Logistics companies struggle to meet new ESG reporting requirements with manual spreadsheets and patchy data.",
      targetCustomers: "Mid-sized logistics + 3PL operators in Singapore, Malaysia, Indonesia",
      businessModel: "Annual SaaS subscription tiered by fleet size",
      supportNeeded: "Partnerships with regional logistics associations; intro to ESG audit firms",
      traction: "8 paying customers (SGD 240k ARR), partnerships with PSA International and SP Group on data integration",
      websiteUrl: "https://greenlogix.io",
      teamSize: 12,
      fundingStatus: "Seed round closed Q3 2025 (SGD 2.4M led by Wavemaker Partners)",
    },
    status: "verified", // already approved
    decidedBy: "admin",
    decisionDecision: "approve",
    verification: greenlogixResults(),
  },
  {
    kind: "startup",
    email: "founder.eduflow@trustpass.demo",
    displayName: "Priya Nair",
    profile: {
      startupName: "EduFlow",
      sector: "EdTech",
      country: "India",
      stage: "Prototype",
      founderName: "Priya Nair",
      productSummary: "AI tutor for vocational students that adapts lessons based on real workplace tasks.",
      problemSolved: "Vocational students drop out because generic courses don't reflect what they actually do at their training sites.",
      targetCustomers: "Vocational institutes and ITIs across India",
      businessModel: "B2B licensing to institutes",
      supportNeeded: "Pilot partnership with a recognised institute; education-policy advisor",
      traction: "Closed beta with 30 students at IIT-Madras Vocational Centre; awaiting first paid pilot",
      websiteUrl: "",
      teamSize: 4,
      fundingStatus: "Bootstrapped",
    },
    status: "ai-verified",
    verification: eduflowResults(),
  },

  // ── mentors ───
  {
    kind: "mentor",
    email: "mentor.sarah@trustpass.demo",
    displayName: "Dr. Sarah Lim",
    profile: {
      mentorName: "Dr. Sarah Lim",
      expertiseAreas: ["Healthcare data privacy", "Hospital pilot pathways", "Regulatory readiness (MDA, FDA)"],
      sectorFocus: ["HealthTech", "MedTech", "Hospital systems"],
      country: "Malaysia",
      organisation: "Independent advisor (ex-Sunway Medical Centre)",
      startupStageFit: ["MVP", "Early Revenue"],
      availability: "4 hours / week",
      credentials: "PhD Biomedical Engineering, University of Malaya. 15 years in hospital systems. Former Head of Compliance at Sunway Medical Centre. Mentored 12+ healthtech startups across SEA, 3 with successful exits.",
      bio: "HealthTech advisor focused on regulatory readiness, healthcare data privacy (PDPA, HIPAA), and hospital pilot pathways. Based in Kuala Lumpur.",
      linkedinUrl: "https://linkedin.com/in/dr-sarah-lim",
    },
    status: "verified",
    decidedBy: "admin",
    decisionDecision: "approve",
    verification: sarahResults(),
  },
  {
    kind: "mentor",
    email: "mentor.marcus@trustpass.demo",
    displayName: "Marcus Chen",
    profile: {
      mentorName: "Marcus Chen",
      expertiseAreas: ["Pre-seed and seed fundraising", "B2B SaaS GTM", "Investor relations"],
      sectorFocus: ["SaaS / Enterprise", "FinTech", "CleanTech"],
      country: "Singapore",
      organisation: "Operator-investor (ex-Carousell, ex-Stripe APAC)",
      startupStageFit: ["MVP", "Early Revenue", "Growth"],
      availability: "2 hours / week",
      credentials: "Built APAC partnerships at Stripe, scaled B2B GTM at Carousell from seed to Series C. MBA INSEAD. Angel investor in 23 SEA startups, 5 follow-on rounds.",
      bio: "Fundraising and B2B GTM advisor. Helped 23 SEA startups raise USD 130M+ collectively. Strongest with SaaS, FinTech, CleanTech founders ready for institutional capital.",
      linkedinUrl: "https://linkedin.com/in/marcuschen",
    },
    status: "verified",
    decidedBy: "admin",
    decisionDecision: "approve",
    verification: marcusResults(),
  },

  // ── admin ───
  {
    kind: "admin",
    email: "admin@trustpass.demo",
    displayName: "Lina Park",
    organisationName: "Acme Accelerator",
  },

  // ── partner ───
  {
    kind: "partner",
    email: "partner@trustpass.demo",
    displayName: "Hari Velan",
    organisationName: "Sunway Ventures",
  },
];

// ── seed runner ─────────────────────────────────────────────────────────────
async function main() {
  const clean = process.argv.includes("--clean");

  if (clean) {
    console.log("→ cleaning previous demo accounts…");
    for (const p of PERSONAS) {
      try {
        const u = await auth.getUserByEmail(p.email);
        await auth.deleteUser(u.uid);
        for (const col of ["users", "startups", "mentors", "verification_results", "passports", "passport_stats"]) {
          await db.collection(col).doc(u.uid).delete().catch(() => {});
        }
        console.log(`  ✓ deleted ${p.email}`);
      } catch (e) {
        if (e?.code !== "auth/user-not-found") console.log(`  ! ${p.email}:`, e.message);
      }
    }
    const oldLinkages = await db.collection("linkages").where("source", "==", "demo-seed").get();
    for (const d of oldLinkages.docs) await d.ref.delete();
    console.log(`  ✓ deleted ${oldLinkages.size} demo linkages`);
  }

  const uids = {};
  for (const p of PERSONAS) {
    console.log(`\n→ ${p.email}`);
    let user;
    try {
      user = await auth.getUserByEmail(p.email);
    } catch (e) {
      if (e?.code === "auth/user-not-found") {
        user = await auth.createUser({
          email: p.email,
          password: DEMO_PASSWORD,
          displayName: p.displayName,
          emailVerified: true,
        });
      } else throw e;
    }
    await auth.updateUser(user.uid, { password: DEMO_PASSWORD, displayName: p.displayName });
    uids[p.email] = user.uid;

    // users/{uid}
    await db.collection("users").doc(user.uid).set(
      {
        uid: user.uid,
        email: p.email,
        displayName: p.displayName,
        role: p.kind === "admin" ? "admin" : p.kind === "partner" ? "partner" : p.kind === "mentor" ? "mentor" : "startup",
        organisationName: p.organisationName ?? null,
        onboardedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    if (p.kind === "startup" || p.kind === "mentor") {
      const col = p.kind === "startup" ? "startups" : "mentors";
      await db.collection(col).doc(user.uid).set(
        {
          ...p.profile,
          ownerUid: user.uid,
          status: p.status,
          evidence: profileToEvidenceText(p.profile, p.kind),
          adminDecision: p.decisionDecision ?? null,
          adminNote: p.adminNote ?? null,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      if (p.verification) {
        await db.collection("verification_results").doc(user.uid).set(
          {
            ownerUid: user.uid,
            type: p.kind,
            status: "complete",
            ...p.verification,
            startedAt: FieldValue.serverTimestamp(),
            completedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }

      if (p.status === "verified" || p.status === "conditionally-verified") {
        await db.collection("passports").doc(user.uid).set(
          {
            ownerUid: user.uid,
            type: p.kind,
            status: p.status,
            holderName: p.kind === "startup" ? p.profile.startupName : p.profile.mentorName,
            sector: p.profile.sector ?? (p.profile.sectorFocus?.[0] ?? null),
            stage: p.profile.stage ?? null,
            country: p.profile.country ?? null,
            issuedBy: "demo-seed",
            issuedAt: FieldValue.serverTimestamp(),
            reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            stamps: p.verification?.stamps ?? null,
            eligibility: p.verification?.eligibility ?? null,
            readiness: p.verification?.readiness ?? null,
            evidence: p.verification?.evidence ?? null,
            linkage: p.verification?.linkage ?? null,
            matches: p.verification?.matches ?? null,
          },
          { merge: true }
        );
      }
    }
    console.log(`  ✓ ${user.uid}  role=${p.kind}  status=${p.status ?? "-"}`);
  }

  // ── linkages — admin has activated a couple for GreenLogix ──
  console.log("\n→ seeding activated linkages");
  const greenLogixUid = uids["founder.greenlogix@trustpass.demo"];
  const adminUid = uids["admin@trustpass.demo"];
  const linkages = [
    {
      ownerUid: greenLogixUid,
      sequence: 1,
      type: "mentor",
      title: "Pre-seed and seed fundraising mentor with B2B SaaS GTM expertise",
      whyNow: "GreenLogix has SGD 240k ARR and just closed seed — needs a Series A advisor to sharpen the institutional pitch.",
      introSubject: "Introduction: GreenLogix & SaaS fundraising mentorship",
      introBody:
        "Hi Marcus,\n\nI'm Lina from Acme Accelerator. I'd like to connect you with Tan Wei Sheng, the founder of GreenLogix — a verified CleanTech startup in our cohort.\n\nThey've built a carbon-accounting platform for SEA logistics operators (SGD 240k ARR, 8 paying customers, seed closed Q3 2025 from Wavemaker). They're preparing for a Series A in Q3 2026 and would benefit hugely from your B2B SaaS GTM experience and your APAC investor network.\n\nWould you have 30 minutes in the next two weeks to chat with Wei Sheng about their fundraising strategy?\n\nThanks,\nLina",
      activatedBy: adminUid,
      activatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "sent",
      source: "demo-seed",
    },
    {
      ownerUid: greenLogixUid,
      sequence: 2,
      type: "partner",
      title: "Singapore ESG audit firm for ISO 14064 certification pathway",
      whyNow: "GreenLogix's emissions data needs third-party audit credibility before enterprise customers will sign procurement contracts.",
      introSubject: "Partnership: GreenLogix carbon accounting platform",
      introBody:
        "Hi Hari,\n\nI'd like to introduce GreenLogix — a Singapore-based CleanTech startup we recently verified at Acme Accelerator. They've built a carbon-accounting platform for SEA logistics operators and now need an ESG audit partner to credential their emissions data for ISO 14064 reporting.\n\nThey have 8 paying customers (SGD 240k ARR) including PSA International and SP Group. Sunway Ventures' portfolio touches both logistics and ESG advisory — there may be a strong fit.\n\nWould you be open to a 30-minute intro call?\n\nThanks,\nLina",
      activatedBy: adminUid,
      activatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: "sent",
      source: "demo-seed",
    },
    {
      ownerUid: uids["founder.medinova@trustpass.demo"],
      sequence: 1,
      type: "mentor",
      title: "HealthTech compliance specialist (PDPA, HIPAA, MDA)",
      whyNow: "MediNova's pilot at Sunway lacks a documented data-privacy posture — blocking the Pilot Ready stamp.",
      introSubject: "Introduction: MediNova AI compliance support",
      introBody: "Hi Sarah,\n\nWanted to introduce you to Dr. Aliya Khan, founder of MediNova AI…",
      activatedBy: adminUid,
      activatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: "draft",
      source: "demo-seed",
    },
  ];
  for (const l of linkages) {
    await db.collection("linkages").add(l);
    console.log(`  ✓ ${l.title}`);
  }

  // ── view counts on a couple passports ──
  console.log("\n→ seeding view counts");
  await db.collection("passport_stats").doc(greenLogixUid).set({
    ownerUid: greenLogixUid,
    viewCount: 47,
    lastViewedAt: FieldValue.serverTimestamp(),
  });
  await db.collection("passport_stats").doc(uids["founder.medinova@trustpass.demo"]).set({
    ownerUid: uids["founder.medinova@trustpass.demo"],
    viewCount: 12,
    lastViewedAt: FieldValue.serverTimestamp(),
  });

  console.log("\n──────────────────────────────────────────────");
  console.log("DEMO CREDENTIALS  ·  password for all:  " + DEMO_PASSWORD);
  console.log("──────────────────────────────────────────────");
  for (const p of PERSONAS) {
    const tag = p.kind === "startup" ? "FOUNDER" : p.kind.toUpperCase();
    console.log(`  [${tag.padEnd(7)}]  ${p.email.padEnd(42)}  ${p.displayName}`);
  }
  console.log("──────────────────────────────────────────────\n");
  console.log("→ open http://localhost:3000/login and try any of the above.\n");
  process.exit(0);
}

// ── helpers ─────────────────────────────────────────────────────────────────
function profileToEvidenceText(profile, kind) {
  if (kind === "startup") {
    return [
      `${profile.startupName} is ${profile.productSummary}`,
      `Founded by ${profile.founderName} in ${profile.country}. Sector: ${profile.sector}. Stage: ${profile.stage}.`,
      `Problem solved: ${profile.problemSolved}`,
      `Target customers: ${profile.targetCustomers}.`,
      `Business model: ${profile.businessModel}.`,
      `Traction: ${profile.traction}.`,
      `Team size: ${profile.teamSize}.`,
      `Funding: ${profile.fundingStatus}.`,
      profile.websiteUrl ? `Website: ${profile.websiteUrl}.` : "",
      `Support needed: ${profile.supportNeeded}.`,
    ].filter(Boolean).join("\n\n");
  }
  return [
    `${profile.mentorName} is ${profile.bio}`,
    `Expertise: ${profile.expertiseAreas?.join(", ")}.`,
    `Sector focus: ${profile.sectorFocus?.join(", ")}.`,
    `Country: ${profile.country}. Organisation: ${profile.organisation}.`,
    `Availability: ${profile.availability}.`,
    `Credentials: ${profile.credentials}.`,
    profile.linkedinUrl ? `LinkedIn: ${profile.linkedinUrl}.` : "",
  ].filter(Boolean).join("\n\n");
}

// ── baked verification results ──────────────────────────────────────────────
function medinovaResults() {
  return {
    evidence: {
      evidenceCompleteness: 78,
      claims: [
        { claim: "MVP stage with live pilot at Sunway Medical Centre", supportingEvidence: "live pilot at Sunway Medical Centre", isSupported: true },
        { claim: "38% triage time reduction", supportingEvidence: "38% triage time reduction over 90 days", isSupported: true },
        { claim: "Team of 6 ex-Cerner engineers", supportingEvidence: "team of 6", isSupported: true },
        { claim: "USD 500k pre-seed planned Q1 2026", supportingEvidence: "planning USD 500k pre-seed Q1 2026", isSupported: true },
      ],
      missingDocuments: [
        "Pilot report from Sunway Medical Centre with methodology and full outcomes",
        "Healthcare data privacy and PDPA compliance documentation",
        "Detailed team CVs",
        "Letters of intent from prospective hospital customers",
      ],
      inconsistencies: [],
      notes: "Strong product traction with a live pilot. Compliance posture is the most material gap before a second deployment.",
    },
    eligibility: {
      eligibilityScore: 92,
      decision: "eligible",
      reason: "Clear product, MVP stage with traction, identifiable founder team, articulated business model, and concrete support need.",
      matchedCriteria: ["Has a clear product/solution", "Operates in a recognised innovation sector", "At least MVP stage", "Identifiable founder team", "Articulated business model", "Has traction signal", "Knows what kind of support it needs"],
      unmatchedCriteria: [],
    },
    readiness: {
      readinessScore: 64,
      dimensions: { business: 75, technical: 70, market: 72, funding: 45, partnership: 55, compliance: 40 },
      riskLevel: "medium",
      riskFlags: [
        { severity: "high", flag: "Healthcare data privacy strategy missing", reason: "Sensitive PHI workflows but no documented PDPA / HIPAA compliance posture." },
        { severity: "medium", flag: "Pilot report not provided", reason: "Strong 38% claim but no supporting methodology document." },
        { severity: "medium", flag: "Funding plan distant", reason: "Pre-seed planned Q1 2026; runway unclear in the interim." },
      ],
      summary: "MediNova has clear product traction with a real hospital pilot. The biggest risks are healthcare data privacy posture and a missing pilot report. Compliance specialist and detailed documentation are the unlocks.",
    },
    stamps: {
      recommendedStatus: "conditionally-verified",
      reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      stamps: [
        { key: "identity-verified", status: "earned", reason: "Founder name and company provided and consistent." },
        { key: "profile-confirmed", status: "earned", reason: "Founder confirmed AI-extracted profile." },
        { key: "programme-eligible", status: "earned", reason: "100% match against generic programme criteria." },
        { key: "pilot-ready", status: "earned", reason: "Live pilot at Sunway Medical Centre with quantifiable results." },
        { key: "pitch-deck-reviewed", status: "pending", reason: "Pitch deck details on team, IP, and GTM not fully evidenced." },
        { key: "compliance-reviewed", status: "pending", reason: "Healthcare data privacy posture and PDPA strategy not documented." },
        { key: "funding-ready", status: "pending", reason: "Pre-seed plan is a year out; runway and cap table not detailed." },
      ],
      nextAction: "Request pilot report from Sunway Medical Centre, detailed healthcare-data-privacy posture, and team CVs.",
    },
    linkage: {
      reasoning: "Compliance is the immediate unlock — block to Pilot Ready. Once that's addressed, layer on partnership and funding support.",
      recommendations: [
        { sequence: 1, type: "mentor", title: "HealthTech compliance specialist (PDPA, HIPAA, MDA)", whyNow: "Highest-severity risk and blocks the Compliance Reviewed stamp.", expertiseOrSector: "HealthTech compliance" },
        { sequence: 2, type: "partner", title: "Hospital pilot partner (second deployment site)", whyNow: "Build a portfolio of pilot evidence beyond Sunway.", expertiseOrSector: "Hospital networks SEA" },
        { sequence: 3, type: "mentor", title: "Pre-seed fundraising advisor", whyNow: "Q1 2026 round needs cap table and pitch sharpening.", expertiseOrSector: "Early-stage healthtech investment" },
        { sequence: 4, type: "service-provider", title: "AI / HealthTech IP lawyer", whyNow: "Protect model and data assets before fundraising.", expertiseOrSector: "Intellectual property law" },
      ],
    },
  };
}

function greenlogixResults() {
  return {
    evidence: {
      evidenceCompleteness: 92,
      claims: [
        { claim: "8 paying customers, SGD 240k ARR", supportingEvidence: "8 paying customers (SGD 240k ARR)", isSupported: true },
        { claim: "Partnerships with PSA International and SP Group", supportingEvidence: "partnerships with PSA International and SP Group", isSupported: true },
        { claim: "Seed round closed Q3 2025", supportingEvidence: "Seed round closed Q3 2025 (SGD 2.4M led by Wavemaker Partners)", isSupported: true },
      ],
      missingDocuments: ["ISO 14064 audit pathway documentation"],
      inconsistencies: [],
      notes: "Strong commercial traction with named anchor customers and a closed institutional round.",
    },
    eligibility: {
      eligibilityScore: 100,
      decision: "eligible",
      reason: "Meets every criterion with material traction. Ready for ecosystem activation.",
      matchedCriteria: ["Clear product", "Recognised sector", "Early Revenue stage", "Identifiable team", "Articulated GTM", "Traction signal", "Concrete support need"],
      unmatchedCriteria: [],
    },
    readiness: {
      readinessScore: 86,
      dimensions: { business: 90, technical: 85, market: 88, funding: 85, partnership: 90, compliance: 78 },
      riskLevel: "low",
      riskFlags: [{ severity: "low", flag: "Third-party audit credential pending", reason: "ISO 14064 audit pathway not yet documented; enterprise customers may want this." }],
      summary: "GreenLogix is in excellent shape — commercial traction, institutional funding, and strong partnerships. The only meaningful gap is third-party audit credibility, which is a single workstream.",
    },
    stamps: {
      recommendedStatus: "verified",
      reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      stamps: [
        { key: "identity-verified", status: "earned", reason: "Founder + company identity confirmed; entity registered in Singapore." },
        { key: "profile-confirmed", status: "earned", reason: "Founder confirmed AI-extracted profile." },
        { key: "pitch-deck-reviewed", status: "earned", reason: "Comprehensive pitch deck and seed-round materials available." },
        { key: "programme-eligible", status: "earned", reason: "Top-decile match against programme criteria." },
        { key: "pilot-ready", status: "earned", reason: "8 paying customers with named anchor accounts." },
        { key: "funding-ready", status: "earned", reason: "SGD 2.4M seed closed Q3 2025 with named lead investor." },
        { key: "compliance-reviewed", status: "pending", reason: "ISO 14064 third-party audit pathway not yet documented." },
      ],
      nextAction: "Introduce to an ESG audit partner for ISO 14064 certification pathway.",
    },
    linkage: {
      reasoning: "GreenLogix is verified and well-funded — the highest-value linkages are commercial expansion and audit credibility.",
      recommendations: [
        { sequence: 1, type: "mentor", title: "Pre-seed and seed fundraising mentor with B2B SaaS GTM expertise", whyNow: "Preparing Series A in Q3 2026; sharpen the institutional pitch.", expertiseOrSector: "B2B SaaS, fundraising" },
        { sequence: 2, type: "partner", title: "Singapore ESG audit firm for ISO 14064 certification pathway", whyNow: "Third-party audit credential unlocks enterprise procurement.", expertiseOrSector: "ESG advisory" },
        { sequence: 3, type: "programme", title: "Wavemaker Impact follow-on programme", whyNow: "Existing investor relationship; structured Series A prep.", expertiseOrSector: "ClimateTech" },
      ],
    },
  };
}

function eduflowResults() {
  return {
    evidence: {
      evidenceCompleteness: 48,
      claims: [
        { claim: "Closed beta with 30 students at IIT-Madras Vocational Centre", supportingEvidence: "Closed beta with 30 students at IIT-Madras Vocational Centre", isSupported: true },
        { claim: "Prototype stage", supportingEvidence: "Prototype", isSupported: true },
      ],
      missingDocuments: [
        "Beta cohort outcomes (completion rate, skill assessments)",
        "Letter of support from IIT-Madras Vocational Centre",
        "Curriculum review by an education-policy advisor",
        "Pricing model validation",
      ],
      inconsistencies: [],
      notes: "Early-stage with a recognised initial partner. Evidence is thin — needs cohort outcomes and curriculum review.",
    },
    eligibility: {
      eligibilityScore: 72,
      decision: "conditionally-eligible",
      reason: "Clear product and identifiable founder but limited traction and missing curriculum validation.",
      matchedCriteria: ["Has a clear product", "Recognised sector", "Identifiable founder", "Articulated business model"],
      unmatchedCriteria: ["No paying customers yet", "No published cohort outcomes"],
    },
    readiness: {
      readinessScore: 48,
      dimensions: { business: 55, technical: 60, market: 52, funding: 30, partnership: 50, compliance: 45 },
      riskLevel: "medium",
      riskFlags: [
        { severity: "high", flag: "Beta outcomes not documented", reason: "30 students in closed beta but no shared outcome data." },
        { severity: "medium", flag: "Curriculum not externally reviewed", reason: "Education-policy advisor not engaged; institutes will ask for this." },
      ],
      summary: "EduFlow has a credible early partner (IIT-Madras) but needs documented beta outcomes and curriculum validation before scaling.",
    },
    stamps: {
      recommendedStatus: "pending-evidence",
      reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      stamps: [
        { key: "identity-verified", status: "earned", reason: "Founder name + company confirmed." },
        { key: "profile-confirmed", status: "earned", reason: "Founder confirmed AI-extracted profile." },
        { key: "programme-eligible", status: "pending", reason: "Conditionally eligible — needs traction or external validation." },
        { key: "pilot-ready", status: "pending", reason: "Beta is closed but outcomes not documented." },
        { key: "pitch-deck-reviewed", status: "pending", reason: "Need a structured deck with curriculum overview and beta results." },
      ],
      nextAction: "Request beta cohort outcomes, IIT-Madras letter of support, and a curriculum review document.",
    },
    linkage: {
      reasoning: "Validation first, then commercial. EduFlow needs proof points before linkage to institute customers will land.",
      recommendations: [
        { sequence: 1, type: "mentor", title: "Education-policy advisor for vocational training", whyNow: "Curriculum review unblocks Programme Eligible.", expertiseOrSector: "Vocational education policy" },
        { sequence: 2, type: "partner", title: "Industrial Training Institute (ITI) pilot site", whyNow: "Second institute pilot diversifies beyond IIT-Madras and produces comparable cohort data.", expertiseOrSector: "Vocational institutes" },
        { sequence: 3, type: "service-provider", title: "Cohort outcomes / education analytics consultancy", whyNow: "Documents the beta in a format institutes accept.", expertiseOrSector: "EdTech analytics" },
      ],
    },
  };
}

function sarahResults() {
  return {
    evidence: {
      evidenceCompleteness: 90,
      claims: [
        { claim: "15 years in hospital systems", supportingEvidence: "15 years in hospital systems", isSupported: true },
        { claim: "Former Head of Compliance at Sunway Medical Centre", supportingEvidence: "Former Head of Compliance at Sunway Medical Centre", isSupported: true },
        { claim: "PhD Biomedical Engineering, University of Malaya", supportingEvidence: "PhD Biomedical Engineering, University of Malaya", isSupported: true },
        { claim: "Mentored 12+ healthtech startups, 3 exits", supportingEvidence: "Mentored 12+ healthtech startups across SEA, 3 with successful exits", isSupported: true },
      ],
      missingDocuments: [],
      inconsistencies: [],
      notes: "Strong, well-evidenced mentor profile with both depth and breadth.",
    },
    eligibility: {
      eligibilityScore: 96,
      decision: "eligible",
      reason: "Clear expertise areas, named sector focus, strong credentials, stated availability, and a documented track record.",
      matchedCriteria: ["Clear expertise areas", "Sector focus", "Credentials", "Availability", "Track record", "No red flags"],
      unmatchedCriteria: [],
    },
    readiness: {
      readinessScore: 92,
      dimensions: { expertise: 95, sectorAlignment: 92, credentials: 95, availability: 85, trackRecord: 92 },
      confidence: "high",
      riskFlags: [],
      summary: "Dr. Sarah Lim is a deeply credentialed HealthTech mentor with a real track record of mentoring exits. Strongest match for early-revenue healthtech startups with hospital pilots.",
    },
    stamps: {
      recommendedStatus: "verified",
      reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      stamps: [
        { key: "identity-verified", status: "earned", reason: "Mentor identity and institutional affiliation confirmed." },
        { key: "profile-confirmed", status: "earned", reason: "Mentor confirmed AI-extracted profile." },
        { key: "expertise-verified", status: "earned", reason: "Expertise areas substantiated by 15 years in hospital systems and PhD." },
        { key: "mentor-approved", status: "earned", reason: "Cleared for ecosystem linkage requests." },
        { key: "high-impact-mentor", status: "earned", reason: "12+ mentored startups, 3 successful exits." },
      ],
      nextAction: "Begin matching with HealthTech / MedTech startups at MVP or Early Revenue stage.",
    },
    matches: {
      reasoning: "Best fit: healthtech startups with live pilots that need compliance and pilot-pathway guidance.",
      startupArchetypes: [
        { sequence: 1, title: "HealthTech compliance-stage startup preparing for hospital pilot", sector: "HealthTech", stage: "MVP", whyMatch: "Direct match — Sarah's primary practice area." },
        { sequence: 2, title: "MedTech device startup approaching MDA / FDA submission", sector: "MedTech", stage: "Early Revenue", whyMatch: "Regulatory readiness is core to Sarah's expertise." },
        { sequence: 3, title: "Hospital pilot expansion across SEA", sector: "HealthTech", stage: "Early Revenue", whyMatch: "Sarah's institutional network in Malaysian healthcare unlocks pilots." },
      ],
    },
  };
}

function marcusResults() {
  return {
    evidence: {
      evidenceCompleteness: 88,
      claims: [
        { claim: "Built APAC partnerships at Stripe", supportingEvidence: "Built APAC partnerships at Stripe", isSupported: true },
        { claim: "Scaled B2B GTM at Carousell from seed to Series C", supportingEvidence: "scaled B2B GTM at Carousell from seed to Series C", isSupported: true },
        { claim: "23 SEA angel investments, 5 follow-on rounds", supportingEvidence: "Angel investor in 23 SEA startups, 5 follow-on rounds", isSupported: true },
      ],
      missingDocuments: [],
      inconsistencies: [],
      notes: "Strong operator-investor with proven scaling track record.",
    },
    eligibility: {
      eligibilityScore: 95,
      decision: "eligible",
      reason: "Verified fundraising and GTM expertise, sector focus aligned with programme cohort, strong credentials.",
      matchedCriteria: ["Clear expertise areas", "Sector focus", "Credentials", "Availability", "Track record"],
      unmatchedCriteria: [],
    },
    readiness: {
      readinessScore: 90,
      dimensions: { expertise: 92, sectorAlignment: 88, credentials: 95, availability: 80, trackRecord: 95 },
      confidence: "high",
      riskFlags: [],
      summary: "Marcus is a high-impact operator-investor for SaaS / FinTech / CleanTech founders raising institutional capital.",
    },
    stamps: {
      recommendedStatus: "verified",
      reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      stamps: [
        { key: "identity-verified", status: "earned", reason: "Operator-investor identity confirmed with named prior employers." },
        { key: "profile-confirmed", status: "earned", reason: "Mentor confirmed AI-extracted profile." },
        { key: "expertise-verified", status: "earned", reason: "Stripe + Carousell tenures substantiate B2B SaaS GTM and fundraising expertise." },
        { key: "mentor-approved", status: "earned", reason: "Cleared for ecosystem linkage requests." },
        { key: "high-impact-mentor", status: "earned", reason: "23 angel investments, 5 follow-on rounds — material capital deployment with demonstrated thesis." },
      ],
      nextAction: "Match with SaaS / FinTech / CleanTech founders at Early Revenue or Growth preparing institutional rounds.",
    },
    matches: {
      reasoning: "Best fit: founders raising pre-seed to Series A in B2B SaaS adjacencies.",
      startupArchetypes: [
        { sequence: 1, title: "B2B SaaS startup at SGD 200k+ ARR preparing Series A", sector: "SaaS / Enterprise", stage: "Early Revenue", whyMatch: "Direct match to Marcus's GTM playbook." },
        { sequence: 2, title: "FinTech startup with merchant or payments distribution", sector: "FinTech", stage: "Early Revenue", whyMatch: "Stripe APAC tenure unlocks merchant and bank relationships." },
        { sequence: 3, title: "CleanTech startup with B2B traction approaching pre-seed", sector: "CleanTech", stage: "MVP", whyMatch: "Active angel thesis in CleanTech with prior cheques in the space." },
      ],
    },
  };
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
