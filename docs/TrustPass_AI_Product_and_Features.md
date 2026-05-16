# TrustPass AI — Product & Features Document

## 1. Product Overview

**TrustPass AI** is an AI-powered startup verification and ecosystem linkage platform designed for innovation ecosystems, accelerators, government agencies, universities, and corporate innovation programmes.

Instead of manually checking every startup application, programme fit, founder profile, document, and readiness level, TrustPass AI creates a **reusable Startup Trust Passport**.

This passport helps ecosystem owners answer one critical question:

> **Is this startup real, eligible, relevant, and ready for the right support?**

Once a startup is verified, the same Trust Passport can be reused across multiple programmes, mentors, partners, service providers, regions, and future initiatives.

---

## 2. Core Concept

### Verify Once. Connect Everywhere.

Most innovation programmes manually verify startups again and again. Each programme repeats the same work:

- Check the company profile
- Review founder information
- Read the pitch deck
- Validate eligibility
- Understand startup maturity
- Identify missing information
- Decide whether the startup is ready
- Match the startup with mentors or partners

TrustPass AI turns this into a structured, reusable, AI-assisted verification flow.

The startup is not just accepted or rejected. It receives a dynamic **Trust Passport** containing:

- Identity confidence
- Eligibility score
- Startup readiness score
- Risk flags
- Missing evidence
- Programme fit
- Recommended support
- Suggested ecosystem linkages
- Explainable AI reasoning

---

## 3. Problem Statement Alignment

The hackathon problem focuses on **automating ecosystem linkages instead of manual coordination**.

Innovation ecosystem operators currently depend on manual coordination to:

- Verify participants
- Match mentors to companies
- Assign companies to programmes
- Manage partner linkages
- Track engagement outcomes

TrustPass AI focuses on the first and most important bottleneck:

> **Participant verification.**

If verification is weak, every downstream linkage becomes weak.

Bad verification leads to:

- Wrong mentor matching
- Poor programme assignment
- Wasted partner time
- Weak ecosystem outcomes
- Repeated manual checks
- Lost institutional knowledge

TrustPass AI solves this by making startup verification a reusable, programmable entity.

---

## 4. Target Users

### Primary Users

| User | Need |
|---|---|
| Programme Administrators | Quickly verify startup applications |
| Accelerator Managers | Understand startup readiness before onboarding |
| Government Innovation Agencies | Scale participant verification across programmes |
| University Innovation Hubs | Assess student or research-based startups |
| Corporate Innovation Teams | Identify startups suitable for pilots or partnerships |

### Secondary Users

| User | Need |
|---|---|
| Startups | Receive faster verification and better support recommendations |
| Mentors | Work with startups that match their expertise |
| Partners | Connect with startups that are relevant and prepared |
| Service Providers | Offer targeted support based on verified needs |
| Investors | View startup readiness and credibility signals |

---

## 5. Product Goals

TrustPass AI aims to:

1. Reduce manual verification workload.
2. Improve consistency in startup evaluation.
3. Convert startup verification into a reusable trust profile.
4. Identify missing evidence and risk signals early.
5. Recommend the right programme, mentor, partner, or service provider.
6. Help ecosystem owners scale across cohorts, programmes, and countries.
7. Preserve verification intelligence for future ecosystem decisions.

---

## 6. Key Product Modules

## 6.1 Startup Intake Module

The startup submits basic information, documents, and supporting evidence.

### Inputs

- Company name
- Founder details
- Sector or industry
- Country or region
- Startup stage
- Product description
- Pitch deck
- Website link
- LinkedIn/company profile
- Traction details
- Funding status
- Support needed
- Programme application answers

### Output

A structured startup profile ready for AI verification.

---

## 6.2 AI Document Reader

This module reads and understands uploaded documents such as pitch decks, applications, and supporting files.

### Features

- Extract startup summary
- Identify product or service offering
- Detect business model
- Extract target market
- Identify traction claims
- Extract team/founder information
- Identify funding and revenue claims
- Detect missing sections
- Summarise the startup in plain language

### Example Output

```text
Company: MediNova AI
Sector: HealthTech
Stage: MVP
Product: AI-powered hospital triage assistant
Support Needed: Pilot customers, compliance guidance, funding readiness
```

---

## 6.3 Eligibility Verification Agent

This AI agent checks whether the startup fits a specific programme.

### Checks

- Geography eligibility
- Sector eligibility
- Startup stage
- Technology focus
- Founder/team requirements
- Document completeness
- Programme-specific criteria
- Impact alignment
- Readiness level

### Example Output

```text
Eligibility Score: 86%

Reason:
- Startup operates in the HealthTech sector
- MVP is available
- Based in eligible geography
- Seeking pilot support, which matches programme goals

Status:
Conditionally Verified
```

---

## 6.4 Startup Readiness Scoring

This module scores how ready the startup is for different types of support.

### Readiness Categories

| Category | Description |
|---|---|
| Business Readiness | Business model, customer clarity, value proposition |
| Technical Readiness | Product maturity, MVP status, technology feasibility |
| Market Readiness | Customer validation, market size, GTM maturity |
| Funding Readiness | Financial clarity, traction, investor materials |
| Partnership Readiness | Ability to engage with corporates or ecosystem partners |
| Compliance Readiness | Legal, regulatory, privacy, and sector-specific concerns |

### Example Output

| Readiness Area | Score |
|---|---:|
| Business Readiness | 74% |
| Technical Readiness | 81% |
| Market Readiness | 62% |
| Funding Readiness | 58% |
| Compliance Readiness | 55% |

---

## 6.5 Consistency & Risk Check Agent

This AI agent checks for gaps, contradictions, or unsupported claims.

### Risk Checks

- Pitch deck says revenue exists, but application does not provide evidence
- Founder profile is incomplete
- Website is inactive or missing
- Claims enterprise traction but no customer proof is provided
- Product stage is unclear
- Sector classification does not match description
- Regulatory or compliance claims are not supported
- Duplicated or low-quality application content

### Example Output

```text
Risk Level: Medium

Risk Flags:
1. Pitch deck mentions hospital pilots, but no pilot evidence was attached.
2. Revenue claim appears in the application, but no supporting detail is provided.
3. Compliance readiness is unclear for handling healthcare data.
```

---

## 6.6 Missing Evidence Detector

This module tells the startup and admin what information is missing.

### Example Missing Evidence

- Company registration document
- Founder profile link
- Product demo link
- Customer validation proof
- Pilot confirmation
- Revenue evidence
- Data privacy explanation
- Technical architecture
- Market research
- Financial projection
- Impact metrics

### Example Output

```text
Missing Evidence:
- Pilot customer proof
- Healthcare data privacy explanation
- Investor deck financial slide
- Product demo link
```

---

## 6.7 Startup Trust Passport

This is the main product output.

The Trust Passport is a reusable verification profile that can be used across programmes and ecosystem linkages.

### Passport Sections

1. Startup summary
2. Identity confidence
3. Eligibility score
4. Readiness score
5. Risk level
6. Missing evidence
7. Programme fit
8. Recommended support path
9. Suggested ecosystem linkages
10. AI explanation
11. Human approval status
12. Verification history

### Example Passport

```text
Startup Trust Passport

Company: MediNova AI
Sector: HealthTech
Stage: MVP

Identity Confidence: 82%
Eligibility Score: 86%
Readiness Score: 78%
Risk Level: Medium

Verification Status:
Conditionally Verified

Missing Evidence:
- Pilot customer evidence
- Data privacy documentation
- Funding readiness material

Recommended Support:
- Compliance mentor
- Hospital pilot partner
- Funding readiness advisor

Recommended Programme:
HealthTech Pilot Readiness Sprint

AI Explanation:
MediNova AI is aligned with the HealthTech programme and has a clear MVP. However, pilot validation and compliance evidence are incomplete. The startup should be conditionally verified and routed to a compliance mentor before investor-facing activities.
```

---

## 6.8 Ecosystem Linkage Recommendation Engine

Once the startup is verified, the system recommends the right ecosystem linkages.

### Linkage Types

| Linkage | Example |
|---|---|
| Startup → Mentor | HealthTech mentor |
| Startup → Programme | Pilot readiness sprint |
| Startup → Partner | Hospital innovation partner |
| Startup → Service Provider | Legal/compliance advisor |
| Startup → Investor Readiness Coach | Funding support |
| Startup → Government Support | Grant or sandbox programme |

### Example Output

```text
Recommended Linkages:
1. Compliance Mentor — because the startup handles healthcare data.
2. Hospital Pilot Partner — because the startup needs real-world validation.
3. Funding Readiness Advisor — because the startup has an MVP but weak investor material.
```

---

## 6.9 Human-in-the-Loop Review

TrustPass AI should not make final decisions without human oversight.

Admins can review, approve, override, or request more evidence.

### Admin Actions

- Approve verification
- Reject application
- Mark as conditionally verified
- Request additional documents
- Redirect to another programme
- Approve recommended linkages
- Override AI recommendation
- Add human notes

### Decision Statuses

| Status | Meaning |
|---|---|
| Verified | Ready to proceed |
| Conditionally Verified | Eligible but missing some evidence |
| Needs Review | AI found inconsistencies |
| Not Eligible | Does not meet programme criteria |
| Redirect | Better suited for another programme or support path |

---

## 6.10 Learning Memory

Every verification and linkage decision becomes reusable intelligence.

### What the System Learns

- Which startup profiles succeed in which programmes
- Which missing evidence usually causes delays
- Which mentor types work best for each startup stage
- Which sectors require special verification checks
- Which programme criteria create bottlenecks
- Which support path improves outcomes

### Example Learning

```text
Pattern Detected:
Early-stage HealthTech startups with MVP but no pilot evidence perform better when routed to a compliance mentor before investor-readiness sessions.
```

---

## 7. End-to-End User Flow

```text
Startup Applies
      ↓
AI Reads Application and Documents
      ↓
Eligibility Agent Checks Programme Fit
      ↓
Readiness Agent Scores Startup Maturity
      ↓
Risk Agent Finds Gaps and Contradictions
      ↓
Trust Passport Is Generated
      ↓
Admin Reviews AI Recommendation
      ↓
Startup Is Verified / Conditionally Verified / Redirected
      ↓
AI Recommends Ecosystem Linkages
      ↓
Mentor, Partner, Programme, or Service Provider Is Activated
      ↓
Outcome Data Improves Future Verification and Matching
```

---

## 8. Suggested Demo Scenario

### Startup Profile

```text
Company: MediNova AI
Sector: HealthTech
Country: Malaysia
Stage: MVP
Need: Hospital pilot customers, healthcare compliance guidance, and funding readiness
```

### Demo Steps

1. Startup submits application.
2. Startup uploads pitch deck.
3. AI reads and extracts startup information.
4. AI checks eligibility for a HealthTech programme.
5. AI generates readiness scores.
6. AI identifies missing evidence.
7. AI flags risks.
8. Trust Passport is generated.
9. Admin approves conditional verification.
10. AI recommends a compliance mentor, hospital partner, and funding advisor.

---

## 9. Recommended MVP Features for Hackathon

For the hackathon, keep the build focused and demo-ready.

### Must-Have Features

| Feature | Priority |
|---|---|
| Startup application input form | High |
| Pitch deck/document upload | High |
| AI startup summary generation | High |
| Eligibility scoring | High |
| Readiness scoring | High |
| Missing evidence detection | High |
| Risk flags | High |
| Trust Passport generation | High |
| Recommended ecosystem linkages | High |
| Admin approve/request-info action | Medium |

### Nice-to-Have Features

| Feature | Priority |
|---|---|
| Relationship graph visualisation | Medium |
| Email generation for intro messages | Medium |
| Mentor/partner database | Medium |
| Outcome tracking | Medium |
| Multi-programme matching | Medium |
| Analytics dashboard | Low |
| Startup self-service portal | Low |

---

## 10. Google Technology Usage

### Gemini

Used for:

- Reading application text
- Summarising startup profiles
- Extracting key startup facts
- Analysing pitch deck content
- Identifying missing evidence
- Explaining eligibility decisions
- Recommending next actions
- Generating Trust Passport narrative

### Google AI Studio

Used for:

- Prompt development
- Gemini testing
- Prototype validation
- Rapid AI workflow design

### Firebase / Firestore

Used for:

- Startup profiles
- Verification results
- Trust Passport records
- Admin decisions
- Programme criteria
- Linkage recommendations

### Google Cloud Run

Used for:

- Hosting the backend API
- Running AI verification workflows
- Deploying the prototype quickly

### Google Cloud Storage

Used for:

- Pitch deck uploads
- Supporting documents
- Verification evidence files

---

## 11. AI Agent Design

### Agent 1: Intake Agent

Converts raw startup input into structured profile data.

### Agent 2: Document Understanding Agent

Reads pitch decks and supporting documents.

### Agent 3: Eligibility Agent

Compares the startup against programme rules.

### Agent 4: Readiness Agent

Scores business, technical, market, funding, and compliance readiness.

### Agent 5: Risk Agent

Finds inconsistencies, missing proof, and weak claims.

### Agent 6: Linkage Agent

Recommends mentors, partners, programmes, and service providers.

### Agent 7: Explanation Agent

Creates human-readable reasoning for admins and startups.

---

## 12. Data Model

### Startup

```json
{
  "startup_id": "ST-001",
  "name": "MediNova AI",
  "sector": "HealthTech",
  "country": "Malaysia",
  "stage": "MVP",
  "support_needed": ["Pilot Customers", "Compliance", "Funding"],
  "documents": ["pitch_deck.pdf"],
  "created_at": "2026-05-16"
}
```

### Trust Passport

```json
{
  "passport_id": "TP-001",
  "startup_id": "ST-001",
  "identity_confidence": 82,
  "eligibility_score": 86,
  "readiness_score": 78,
  "risk_level": "Medium",
  "verification_status": "Conditionally Verified",
  "missing_evidence": [
    "Pilot customer proof",
    "Data privacy documentation"
  ],
  "recommended_support": [
    "Compliance mentor",
    "Hospital pilot partner",
    "Funding readiness advisor"
  ]
}
```

### Ecosystem Linkage

```json
{
  "linkage_id": "LK-001",
  "startup_id": "ST-001",
  "actor_type": "Mentor",
  "recommended_actor": "Healthcare Compliance Mentor",
  "reason": "Startup handles healthcare data and lacks compliance documentation",
  "status": "Recommended"
}
```

---

## 13. Ethical Considerations

TrustPass AI should be designed with responsible AI principles.

### Key Controls

- AI does not make final rejection decisions alone.
- Human admin approval is required.
- AI recommendations must include explanation.
- Startups can provide missing evidence.
- Bias should be monitored across geography, gender, sector, and language.
- Sensitive data should be handled securely.
- The system should avoid over-reliance on incomplete public information.
- Risk flags should be treated as review signals, not automatic disqualification.

---

## 14. Business Value

### For Ecosystem Owners

- Faster verification
- Reduced admin workload
- More consistent decisions
- Better startup-programme fit
- Reusable verification intelligence
- Easier scaling across regions and programmes

### For Startups

- Faster application processing
- Clearer feedback
- Better support recommendations
- Less repeated documentation
- Better chance of being matched with the right help

### For Mentors and Partners

- Better-prepared startups
- More relevant introductions
- Less wasted time
- Higher-quality engagements

---

## 15. Measurable Impact

Potential metrics:

| Metric | Expected Improvement |
|---|---|
| Verification time per startup | Reduced by 50–70% |
| Missing document follow-ups | Reduced by 30–50% |
| Admin review effort | Reduced significantly |
| Startup-programme fit quality | Improved through scoring |
| Mentor matching quality | Improved through verified needs |
| Repeated verification work | Reduced through reusable passport |
| Programme onboarding speed | Faster cohort formation |

---

## 16. Business Model

### SaaS Subscription

For accelerators, government agencies, universities, and ecosystem operators.

### Pricing Options

| Plan | Target Customer |
|---|---|
| Starter | Small accelerator or university programme |
| Growth | Multi-cohort innovation programme |
| Enterprise | Government agency or regional ecosystem operator |

### Possible Revenue Add-ons

- Per-startup verification
- Multi-programme passport reuse
- Advanced analytics
- Custom programme criteria
- API access
- White-label ecosystem portal
- Enterprise security and compliance package

---

## 17. Competitive Differentiation

TrustPass AI is not just:

- a CRM
- a mentor matching tool
- a form submission system
- an accelerator dashboard

It is a **startup trust infrastructure layer**.

### Differentiator

```text
Traditional platform:
Stores applications and manually assigns support.

TrustPass AI:
Verifies startup readiness, creates reusable trust passports, and activates ecosystem linkages automatically.
```

---

## 18. Elevator Pitch

> **TrustPass AI helps innovation ecosystems verify startups faster and more consistently by creating a reusable AI-generated Startup Trust Passport. Instead of manually reviewing every application and repeating the same checks across programmes, ecosystem owners can verify once, understand startup readiness, detect missing evidence, and connect each startup to the right mentors, partners, programmes, and service providers.**

---

## 19. Pitch Tagline

> **Verify once. Connect everywhere.**

---

## 20. Suggested Slide Structure

1. Title — TrustPass AI
2. Problem — Startup verification is manual, repeated, and inconsistent
3. Insight — Bad verification creates bad ecosystem linkages
4. Solution — AI-generated Startup Trust Passport
5. Product Flow — Apply → Verify → Passport → Linkage
6. Demo — MediNova AI verification
7. AI Architecture — Gemini-powered agents
8. Google Tech Stack — Gemini, AI Studio, Firebase, Cloud Run
9. Impact — Faster verification, better matching, reusable intelligence
10. Business Model — SaaS for ecosystem owners

---

## 21. Final Positioning

TrustPass AI should be presented as:

> **An AI verification and trust layer for innovation ecosystems.**

Not as:

> A startup management dashboard.

The winning argument is:

> **Before an ecosystem can automate linkages, it must first trust the participants. TrustPass AI makes startup verification intelligent, reusable, and scalable.**
