# TrustPass AI

> **The digital passport for trusted innovation ecosystems.**
> Verify startups and mentors once. Connect them everywhere.

TrustPass AI is a digital trust infrastructure layer for innovation ecosystems
(accelerators, government agencies, universities, corporate innovation teams).
Instead of repeatedly verifying startups and mentors manually across every
programme, TrustPass AI issues reusable **Digital Passports** — credentials
with verifiable stamps and badges — so the ecosystem can verify once and
connect everywhere.

```text
Apply → AI Verify → Human Review → Passport Issued → Stamps Earned → Linkages Activated
```

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [The 7 Modules](#2-the-7-modules)
3. [The 7 AI Agents](#3-the-7-ai-agents)
4. [Architecture](#4-architecture)
5. [Tech Stack](#5-tech-stack)
6. [Project Structure](#6-project-structure)
7. [Quick Start (Local)](#7-quick-start-local)
8. [Quick Start (Docker)](#8-quick-start-docker)
9. [Google Cloud Setup](#9-google-cloud-setup)
10. [Environment Variables](#10-environment-variables)
11. [Firestore Data Model](#11-firestore-data-model)
12. [Available Scripts](#12-available-scripts)
13. [Deployment](#13-deployment)
14. [Roadmap / Build Order](#14-roadmap--build-order)
15. [Design System](#15-design-system)

---

## 1. Product Overview

### The problem
Innovation ecosystems still verify people manually. Admins spend hours checking
applications, founders re-do verification across every programme, different
admins evaluate the same profile differently, and past verification history is
lost. Result: weak linkages, slow programmes, inconsistent decisions.

### The solution
TrustPass AI converts manual verification into reusable **Digital Passports**.
After a startup or mentor is verified once, they receive a portable digital
credential with stamps, badges, scores, and a public verification link. That
passport can be reused across programmes, mentors, partners, and regions.

### Who it's for

| Persona | Value |
| ------- | ----- |
| Startup founder | Get verified once, reuse across 10+ programmes |
| Mentor | Verified expertise + matched startups |
| Programme admin | Faster cohort verification, consistent AI-assisted review |
| Government agency | Reusable trust credentials across regional programmes |
| University innovation hub | Consistent readiness scoring for student/research startups |
| Corporate innovation team | Pre-verified pilot-ready startups |

### The signature artifact: the Digital Passport
Every verified participant receives a passport containing:

- Identity, sector, stage, country
- Verification scores (identity, eligibility, readiness, evidence completeness, risk)
- **Earned stamps** (e.g. Identity Verified, Pitch Deck Reviewed, Programme Eligible)
- **Pending stamps** (e.g. Pilot Ready, Compliance Reviewed)
- **Locked stamps** (e.g. Programme Admitted)
- Status badge (Verified, Conditionally Verified, Pending Evidence)
- Shareable proof (QR + public link + downloadable PDF)
- Review/expiry date

> **Core promise: AI recommends. Humans decide.**

---

## 2. The 7 Modules

| # | Module | Purpose |
|---|--------|---------|
| 1 | **Landing** | Public-facing site explaining product + passport concept. Routes startups/mentors/admins to the right journey. |
| 2 | **Auth & Roles** | Login, signup, role selection (founder / mentor / programme admin / partner / ecosystem owner) + permission-aware dashboards. |
| 3 | **Startup Passport** | Founder creates profile via AI-assisted extraction from pitch deck / website / description. Upload docs, track status. |
| 4 | **AI Verification Engine** | 7 logical agents run extraction, eligibility, readiness scoring, risk flagging, stamp/linkage recommendations. |
| 5 | **Digital Passport & Stamps** | Issues a premium digital passport booklet with earned / pending / locked stamps + QR + shareable link. |
| 6 | **Admin Verification Workspace** | Admin reviews AI recommendations, requests missing evidence, approves or overrides. "AI recommends, humans decide." |
| 7 | **Ecosystem Linkage** | Post-issuance matchmaking to mentors, partners, programmes, service providers based on verified passport state. |

Each module is documented in detail under [`docs/TrustPass_AI_7_Module_Documents/`](docs/TrustPass_AI_7_Module_Documents/).

---

## 3. The 7 AI Agents

All seven are **logical agents** running inside a single backend (Next.js API
routes for local; Cloud Run for production). They share a Gemini client and
chain through an orchestrator.

| # | Agent | Purpose | Output |
|---|-------|---------|--------|
| 1 | **Orchestrator** | Controls the full workflow; calls each agent in sequence and persists intermediate results. | A complete verification run record. |
| 2 | **Passport Builder** | Auto-fills startup/mentor profile fields from pitch deck, website text, CV, or description. | Structured profile fields + per-field confidence + missing fields. |
| 3 | **Evidence Extraction** | Reads uploaded documents; identifies claims, proof, missing documents, inconsistencies. | Claim/evidence pairs + suggested admin actions. |
| 4 | **Eligibility** | Checks profile vs. programme rules (sector, stage, geography, criteria). | Eligibility score + status recommendation + reason. |
| 5 | **Readiness & Risk** | Scores six readiness dimensions (business, technical, market, funding, partnership, compliance) + flags risks. | Readiness score + risk level + risk flag list. |
| 6 | **Passport & Stamp** | Recommends passport status, earned/pending/locked stamps, badges, next actions, review date. | Stamp recommendation record (recommendation only — admin must approve). |
| 7 | **Linkage Recommendation** | Recommends a *sequenced* set of mentors / partners / programmes / service providers. | Ordered linkage list with reasoning. |

### Prompt strategy
Each agent has its own prompt that returns **strict JSON** (validated with Zod
before persistence). The orchestrator passes outputs forward so each later
agent can reason about earlier results.

---

## 4. Architecture

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                          Next.js Frontend (App Router)                   │
│  ─ Landing pages   ─ Founder portal   ─ Admin workspace   ─ Mentor view  │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │   (Firebase Auth ID token)
┌────────────────────────────────▼─────────────────────────────────────────┐
│                    Next.js API Routes  (= Cloud Run service)             │
│                                                                          │
│   /api/agents/orchestrate   ──► runs all 7 agents end-to-end             │
│   /api/agents/passport-builder                                           │
│   /api/agents/evidence                                                   │
│   /api/agents/eligibility                                                │
│   /api/agents/readiness                                                  │
│   /api/agents/stamps                                                     │
│   /api/agents/linkage                                                    │
│                                                                          │
│   /api/passports/...    /api/admin/...    /api/uploads/...               │
└────┬───────────────────────────┬─────────────────────────────┬──────────┘
     │                           │                             │
     ▼                           ▼                             ▼
  Gemini API                  Firestore                  Cloud Storage
  (Vertex AI)              (passports, stamps,         (pitch decks,
                            users, verification         CVs, evidence,
                            results, linkages,          generated PDFs)
                            admin reviews)
```

Optional but recommended later:

- **Document AI** — for messy PDF / scanned-document extraction
- **Secret Manager** — for storing keys outside env vars
- **Cloud Logging** — for audit trail of all verification decisions

---

## 5. Tech Stack

**Frontend**
- Next.js 16 (App Router, React Server Components)
- TypeScript 5
- Tailwind CSS v4 (inline `@theme`) + custom navy / cyan trust palette
- shadcn/ui primitives (Radix) + lucide-react icons
- Framer Motion for passport animations
- Recharts for admin analytics
- React Hook Form + Zod for forms

**Backend / Agents**
- Next.js API routes (deployable to Cloud Run as a single service)
- `@google/generative-ai` SDK (Gemini)
- Zod for runtime JSON validation of agent outputs

**Data / Auth / Storage**
- Firebase Authentication (Email/Password + Google sign-in)
- Cloud Firestore (NoSQL document store)
- Cloud Storage (file uploads)
- Firebase Admin SDK on the server for token verification + Firestore writes

**Dev**
- pnpm 9
- Docker + docker-compose (hot-reload dev container)
- ESLint 9

---

## 6. Project Structure

```text
gdk/
├── app/                              # Next.js App Router
│   ├── (marketing)/                  # Landing module pages
│   │   ├── page.tsx                  # Home
│   │   ├── product/page.tsx
│   │   ├── how-it-works/page.tsx
│   │   ├── use-cases/page.tsx
│   │   ├── passports/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── start/page.tsx            # Start verification (role picker)
│   │   └── contact/page.tsx
│   ├── (auth)/                       # Auth module
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── role/page.tsx
│   ├── (app)/                        # Authenticated portals
│   │   ├── founder/                  # Module 3
│   │   ├── mentor/
│   │   ├── admin/                    # Module 6
│   │   └── passport/[id]/page.tsx    # Module 5
│   ├── api/                          # Module 4 agents + data routes
│   │   ├── agents/
│   │   ├── passports/
│   │   ├── admin/
│   │   └── uploads/
│   ├── layout.tsx
│   ├── globals.css                   # Tailwind + theme tokens
│   └── page.tsx                      # Landing root
├── components/
│   ├── ui/                           # shadcn primitives
│   ├── landing/                      # Hero, passport preview, etc.
│   ├── passport/                     # Passport booklet, stamps
│   └── admin/                        # Review queue, AI explainer cards
├── lib/
│   ├── utils.ts
│   ├── firebase/                     # Client + admin SDK init
│   ├── gemini/                       # Gemini client + agent prompts
│   └── schemas/                      # Zod schemas for passport, agents, etc.
├── docs/                             # Product + module + GCP specs
├── public/
├── Dockerfile                        # Multi-stage: dev + production
├── docker-compose.yml                # Local dev with hot reload
├── .env.example                      # Template for .env.local
└── README.md
```

---

## 7. Quick Start (Local)

### Prerequisites
- Node.js 22+
- pnpm 9+ (`corepack enable && corepack prepare pnpm@9 --activate`)
- A Firebase project + Gemini API key (see [Google Cloud Setup](#9-google-cloud-setup))

### Steps

```bash
# 1. Install dependencies
pnpm install

# 2. Create your env file
cp .env.example .env.local
# then open .env.local and fill in the Firebase + Gemini values

# 3. Run the dev server
pnpm dev

# 4. Open http://localhost:3000
```

The dev server uses Turbopack and hot-reloads on save.

---

## 8. Quick Start (Docker)

A multi-stage `Dockerfile` and `docker-compose.yml` are included.

### Run with docker-compose (recommended — hot reload, source mounted)

```bash
cp .env.example .env.local         # fill it in first
docker compose up --build
# open http://localhost:3000
```

The compose file mounts the source directory into the container, so file
changes hot-reload exactly like local `pnpm dev`.

### Build a production image

```bash
docker build --target runner -t trustpass-ai:latest .
docker run --rm -p 3000:3000 --env-file .env.local trustpass-ai:latest
```

### Useful commands

```bash
docker compose up                  # start (uses cached build)
docker compose up --build          # rebuild image then start
docker compose down                # stop
docker compose logs -f web         # tail logs
docker compose exec web sh         # shell into container
```

---

## 9. Google Cloud Setup

You need **one** Google Cloud project that hosts Firebase, Firestore, Cloud
Storage, Gemini, and (optionally) Cloud Run. Recommended project name:
`trustpass-ai-hackathon`.

### Step 1 — Create the project
1. Open https://console.cloud.google.com/projectcreate
2. Project name: `trustpass-ai-hackathon` (or similar)
3. Note the **Project ID** (it appears once and cannot be changed)

### Step 2 — Enable APIs
Open https://console.cloud.google.com/apis/library and enable:

- **Vertex AI API** (or use the simpler Gemini API on AI Studio)
- **Cloud Firestore API**
- **Cloud Storage API**
- **Firebase Authentication API**
- **Cloud Run API** *(when you're ready to deploy)*
- **Artifact Registry API** *(when deploying)*
- **Document AI API** *(optional — only if you want OCR on scanned PDFs)*
- **Secret Manager API** *(recommended)*

### Step 3 — Link Firebase
1. Open https://console.firebase.google.com → **Add project**
2. Choose **Use an existing Google Cloud project** → pick `trustpass-ai-hackathon`
3. After creation, click the **Web** (`</>`) icon to register a web app
4. Copy the `firebaseConfig` object — those values go into `.env.local`

### Step 4 — Enable Authentication
In the Firebase console → **Authentication** → **Get started** → **Sign-in method**:
- Enable **Email/Password**
- Enable **Google**

### Step 5 — Create Firestore
- Firebase console → **Firestore Database** → **Create database**
- Start in **Production mode** (we'll add rules)
- Pick a region close to your users (e.g. `asia-southeast1` for SEA)

### Step 6 — Create Cloud Storage
- Firebase console → **Storage** → **Get started**
- Use the default bucket name (it's the same as the storage bucket value
  in your Firebase config)
- Pick the same region as Firestore

### Step 7 — Get a Gemini API key
1. Open https://aistudio.google.com/apikey
2. Click **Create API key** → choose the same Google Cloud project
3. Copy the key → it goes in `GEMINI_API_KEY` in `.env.local`

### Step 8 — Service account (for server-side admin SDK)
For local dev / Cloud Run:
1. https://console.cloud.google.com/iam-admin/serviceaccounts
2. **Create service account** → name `trustpass-server`
3. Grant role: **Firebase Admin SDK Administrator Service Agent** + **Cloud
   Datastore User** + **Storage Object Admin**
4. After creation: open the account → **Keys** → **Add key** → **JSON**
5. Either:
   - Save the JSON locally as `service-account.json` and set
     `FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json`, **or**
   - Open the JSON, copy the entire content (single line), and paste into
     `FIREBASE_SERVICE_ACCOUNT_JSON` in `.env.local`

**Never commit the service-account JSON** — `.gitignore` already excludes it.

---

## 10. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Source | Required? |
|----------|--------|-----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web app config | yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase web app config | yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase web app config | yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase web app config | yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase web app config | yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web app config | yes |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | GCP IAM → Service Accounts → Keys | server-side |
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey | yes (for AI flows) |
| `GEMINI_MODEL` | e.g. `gemini-2.0-flash-exp` | optional |
| `NEXT_PUBLIC_APP_URL` | e.g. `http://localhost:3000` | yes |

---

## 11. Firestore Data Model

For the MVP, keep collections flat and simple:

```text
users                  ─ profile + role
organisations          ─ accelerator / agency / university / corporate
startups               ─ confirmed startup profile
mentors                ─ confirmed mentor profile
documents              ─ uploaded file metadata (pitch deck, CV, etc.)
autofill_profiles      ─ raw AI-extracted profile (pre-confirm)
verification_results   ─ per-run output of the 7 agents
passports              ─ issued passports (status, stamps, badges)
stamps                 ─ stamp catalogue (definitions + criteria)
badges                 ─ badge catalogue
linkages               ─ recommended + activated linkages
admin_reviews          ─ approve / request-evidence / reject events
audit_logs             ─ append-only trail of every decision
```

---

## 12. Available Scripts

```bash
pnpm dev          # Run dev server (Turbopack) on http://localhost:3000
pnpm build        # Production build
pnpm start        # Run the production build locally
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
```

---

## 13. Deployment

### Cloud Run (recommended)

1. Build the production image and push to Artifact Registry:
   ```bash
   gcloud auth configure-docker REGION-docker.pkg.dev
   docker build --target runner -t REGION-docker.pkg.dev/PROJECT/trustpass/web:latest .
   docker push REGION-docker.pkg.dev/PROJECT/trustpass/web:latest
   ```
2. Deploy:
   ```bash
   gcloud run deploy trustpass-web \
     --image REGION-docker.pkg.dev/PROJECT/trustpass/web:latest \
     --platform managed \
     --region REGION \
     --allow-unauthenticated \
     --set-env-vars "NEXT_PUBLIC_FIREBASE_API_KEY=...,..." \
     --set-secrets "GEMINI_API_KEY=gemini-api-key:latest,FIREBASE_SERVICE_ACCOUNT_JSON=firebase-admin:latest"
   ```
3. Map your domain in the Cloud Run console (optional).

### Vercel (alternative)
Push the repo to GitHub, import in Vercel, paste env vars, deploy.
Cloud Run is preferred because the Google Cloud guidance assumes it.

---

## 14. Roadmap / Build Order

Following the order in `docs/gcd steps`:

- [x] Scaffold (Next.js, Tailwind, shadcn primitives, design tokens, Docker, README)
- [x] Module 1 — Landing pages (8 pages: home, product, how-it-works, use-cases, passports, pricing, start, contact)
- [x] Module 2 — Auth & role selection (Firebase Auth, login / signup / role picker / forgot password / 4 dashboards / Firestore rules)
- [x] Module 3 — Startup + Mentor Passport (AI-assisted profile builder; pitch deck / website / description sources; per-field confidence + source citation)
- [x] Module 4 — AI Verification Engine (7 agents + orchestrator + SSE streaming): Passport Builder, Evidence Extraction, Eligibility, Readiness & Risk, Passport & Stamp, Linkage Recommendation, plus the Intro Message agent used when admins activate a linkage
- [x] Module 5 — Digital Passport view + public verification page (server-rendered via Firebase Admin)
- [x] Module 6 — Admin Verification Workspace (review queue, AI explainer, approve / conditionally approve / request evidence / reject with auditable transactions)
- [x] Module 7 — Ecosystem Linkage workspace (sequenced recommendations + AI intro-message generator + editable send-intro dialog)
- [ ] Production: Cloud Run deploy, Document AI for messy PDFs, file upload to Cloud Storage, real intro email delivery (currently mocked)

### Server-side API routes (Admin SDK)

These bypass Firestore Security Rules by using the Admin SDK with a service account, which is the right pattern for admin reads / writes:

```text
POST /api/agents/passport-builder    AI extracts startup / mentor profile
POST /api/agents/orchestrate         SSE stream of 5 verification agents
POST /api/agents/intro-message       generates personalised intro
GET  /api/admin/queue                list pending reviews
GET  /api/admin/review/:id           profile + verification run for one startup
GET  /api/admin/linkages             cross-startup linkage recommendations
POST /api/admin/decisions            approve / conditionally / request evidence / reject
                                     (transactional + audit log)
```

All admin endpoints verify a Firebase Auth ID token in the `Authorization: Bearer <token>` header and confirm the caller's `role` in Firestore is `admin` or `ecosystem-owner` before proceeding.

### End-to-end Playwright tests

Both critical journeys are verified headless:

- **Founder**: signup → role → "Create Startup Passport" → paste pitch deck → AI extracts 14 fields → confirm → SSE-streamed 5-agent verification → passport renders with scores / risk flags / linkages.
- **Admin**: signup as Programme Administrator → role + org → review queue (live data) → open review → Approve → decision recorded → linkages page → Activate → AI generates a personalised intro subject + body in an editable dialog.

### Required Google Cloud manual steps (before login works)

1. Firebase Console → Authentication → enable **Email/Password** + **Google**
2. Firebase Console → Firestore Database → Rules → paste `firestore.rules` and publish, OR run `node scripts/deploy-firestore-rules.mjs` (uses your service-account credential, no `firebase login` needed)
3. GCP IAM → Service Accounts → Firebase Console → Project Settings → **Service accounts** tab → **Generate new private key** → paste JSON contents (single line) into `FIREBASE_SERVICE_ACCOUNT_JSON` in `.env.local`

The public passport page (`/passport/[uid]`), every `/api/admin/*` route, and `/api/agents/intro-message` all require the service account.

---

## 15. Design System

### Palette
- **Primary** — Navy (`#0e1b34` → `#182947` → `#243a5c`). Used for headings, primary buttons, passport covers.
- **Accent** — Electric cyan (`#0ea5e9` / `#38bdf8`). Used for verification glow, foil shimmer, focus rings.
- **Success** — Emerald (`#10b981`). Verified stamps.
- **Warning** — Amber (`#f59e0b`). Pending stamps / evidence requests.
- **Risk** — Rose (`#ef4444`). Risk flags / rejected.
- **Background** — Slate-tinted off-white (`#f8fafc`).
- **Surfaces** — White cards, light slate borders.

### Typography
- **Sans** — Inter (display + body)
- Headings use tight tracking and semibold weight to feel premium

### Motion
- Passport stamps: scale + slight rotation + fade ("stamp" keyframe)
- Foil shimmer on passport covers (`passport-foil` utility)
- Subtle float on hero passport (`float` keyframe)

### Visual signature
The product should feel like *AI due diligence meets ecosystem orchestration* —
never like a spreadsheet replacement.

---

## License

Proprietary — TrustPass AI. All rights reserved.
