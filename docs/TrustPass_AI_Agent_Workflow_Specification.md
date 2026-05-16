# TrustPass AI — Agent Workflow Specification

## 1. Purpose of This Document

This document defines the AI agent workflow for **TrustPass AI**.

It explains how the system uses AI agents to convert startup and mentor evidence into structured passport profiles, verify eligibility and readiness, recommend passport stamps, and suggest ecosystem linkages.

This document is written for product owners, designers, developers, and hackathon team members. It avoids implementation-level code and focuses on what each agent should do, when it runs, what it receives, what it produces, and how it connects to the user interface.

---

# 2. Product Context

TrustPass AI is a digital passport and AI trust verification layer for innovation ecosystems.

The product flow is:

```text
Upload Evidence
      ↓
AI Builds Passport Profile
      ↓
User Confirms
      ↓
AI Verifies
      ↓
Admin Reviews
      ↓
Passport Issued
      ↓
Stamps / Badges Added
      ↓
Ecosystem Linkages Recommended
```

The agents should reduce:

- manual data entry
- manual verification
- inconsistent review
- missing evidence delays
- poor ecosystem matching
- repeated verification across programmes

---

# 3. Agent Design Principle

The system should use **7 logical AI agents**.

These do not need to be deployed as 7 separate services. For MVP, all agents can run inside one backend service, but they should be clearly separated by responsibility.

## Core Principle

> **Each agent should do one clear job and produce structured, reviewable output.**

## Human-in-the-Loop Rule

> **AI recommends. Humans approve.**

The agents should never make final rejection, approval, passport issuance, or linkage activation decisions without admin review.

---

# 4. Full Agent List

| # | Agent | Main Purpose |
|---:|---|---|
| 1 | Orchestrator Agent | Controls the workflow and decides which agent runs next |
| 2 | AI Passport Builder Agent | Autofills startup or mentor profile from uploaded/pasted evidence |
| 3 | Evidence Extraction Agent | Extracts claims, evidence, sources, missing proof, and inconsistencies |
| 4 | Eligibility Agent | Checks whether startup/mentor fits programme or ecosystem criteria |
| 5 | Readiness & Risk Agent | Scores readiness and identifies risks, gaps, and contradictions |
| 6 | Passport & Stamp Agent | Recommends passport status, stamps, badges, and next actions |
| 7 | Linkage Recommendation Agent | Recommends mentors, partners, programmes, or support sequence |

---

# 5. High-Level Workflow

## 5.1 Startup Workflow

```text
Startup uploads pitch deck / pastes website / enters description
      ↓
Orchestrator Agent starts workflow
      ↓
AI Passport Builder Agent creates startup profile draft
      ↓
Evidence Extraction Agent extracts claims and missing proof
      ↓
Startup reviews and confirms AI-prepared profile
      ↓
Eligibility Agent checks programme fit
      ↓
Readiness & Risk Agent scores startup maturity and risk
      ↓
Passport & Stamp Agent recommends passport status and stamps
      ↓
Admin reviews recommendation
      ↓
Admin issues passport
      ↓
Linkage Recommendation Agent recommends next ecosystem linkages
```

## 5.2 Mentor Workflow

```text
Mentor uploads CV / pastes LinkedIn-style profile / enters bio
      ↓
Orchestrator Agent starts workflow
      ↓
AI Passport Builder Agent creates mentor profile draft
      ↓
Evidence Extraction Agent extracts expertise evidence and missing credentials
      ↓
Mentor reviews and confirms AI-prepared profile
      ↓
Eligibility Agent checks programme or ecosystem fit
      ↓
Readiness & Risk Agent checks mentor readiness and risk
      ↓
Passport & Stamp Agent recommends mentor passport status and stamps
      ↓
Admin reviews recommendation
      ↓
Admin issues mentor passport
      ↓
Linkage Recommendation Agent recommends suitable startup matches
```

---

# 6. Agent 1 — Orchestrator Agent

## 6.1 Purpose

The **Orchestrator Agent** controls the complete AI workflow.

It decides:

- which workflow should run
- which agent should run next
- what information should be passed between agents
- when the user must review and confirm
- when the admin must review
- when a workflow should stop due to missing information

The Orchestrator Agent does not perform deep verification itself. It coordinates the other agents.

## 6.2 When It Runs

The Orchestrator Agent runs when:

- a startup begins passport creation
- a mentor begins passport creation
- a user uploads evidence
- a user submits confirmed profile
- an admin requests verification
- an admin issues passport
- linkage recommendations are requested

## 6.3 Inputs

The Orchestrator receives:

- user role
- user ID
- organisation/programme context
- uploaded files or pasted content
- selected passport type
- selected programme, if any
- current workflow stage
- previous agent outputs
- user confirmation status
- admin decision status

## 6.4 Outputs

The Orchestrator produces:

- next workflow step
- agent execution order
- status updates for UI
- combined verification package
- error or missing input messages
- workflow completion state

## 6.5 Example Workflow Decision

```text
Current State:
Startup uploaded pitch deck but has not confirmed profile.

Next Step:
Run AI Passport Builder Agent and Evidence Extraction Agent.

Do not run Eligibility Agent yet because user confirmation is pending.
```

## 6.6 UI Screens Connected

- AI Passport Builder
- AI Extraction Progress
- Autofilled Profile Review
- AI Verification Result
- Admin Verification Workspace
- Passport Issued Page
- Linkage Recommendation Page

## 6.7 Failure Handling

If a required input is missing, the Orchestrator should return a clear instruction.

```text
We need at least one evidence source before preparing your passport profile. Please upload a pitch deck, paste a website, or describe your startup.
```

If one agent fails, the Orchestrator should allow partial progress.

```text
The document could not be fully read. We extracted available text, but some fields need manual confirmation.
```

---

# 7. Agent 2 — AI Passport Builder Agent

## 7.1 Purpose

The **AI Passport Builder Agent** removes manual data entry.

It converts unstructured evidence into a structured passport profile draft.

This is the agent behind the zero-form onboarding experience.

## 7.2 Core Question

> **What passport profile can we prepare from the evidence provided?**

This agent does not verify whether the information is true. It extracts and structures what is available. Verification happens later.

## 7.3 When It Runs

It runs after a user provides evidence such as:

- pitch deck
- website text
- startup description
- company profile
- product brochure
- CV
- mentor bio
- LinkedIn-style profile text
- credentials
- voice transcript

## 7.4 Startup Outputs

The agent should produce a startup profile draft containing:

| Field | Description |
|---|---|
| Startup name | Company/startup name |
| Sector | HealthTech, FinTech, AI, SaaS, etc. |
| Country | Startup operating country |
| City | Optional |
| Stage | Idea, prototype, MVP, revenue, growth |
| Founder name | Founder or key contact |
| Product summary | Plain-language product summary |
| Problem solved | Customer problem |
| Target customers | Customer segments |
| Business model | SaaS, marketplace, services, licensing, etc. |
| Technology used | AI, web app, mobile app, hardware, etc. |
| Support needed | Funding, pilots, compliance, mentorship, etc. |
| Traction | Users, pilots, revenue, partnerships, grants |
| Website | If found |
| Missing fields | Fields not found |
| Suggested profile summary | AI-written startup summary |
| Confidence per field | High, medium, low, not found |
| Source per field | Where the data came from |

## 7.5 Mentor Outputs

The agent should produce a mentor profile draft containing:

| Field | Description |
|---|---|
| Mentor name | Person's name |
| Country | Location |
| Organisation | Company/institution |
| Role/title | Professional title |
| Expertise areas | Domains of expertise |
| Sector focus | Industries mentor can support |
| Startup stage fit | Idea, MVP, revenue, growth |
| Mentoring style | Strategic, technical, fundraising, compliance |
| Availability | If provided |
| Credentials | Certifications, achievements, experience |
| Suggested mentor summary | AI-written summary |
| Missing fields | Fields not found |
| Confidence per field | High, medium, low, not found |
| Source per field | Where the data came from |

## 7.6 Confidence Levels

| Confidence | Meaning |
|---|---|
| High | Clearly found in evidence |
| Medium | Reasonable inference from available content |
| Low | Weak inference, user should confirm |
| Not Found | Not available in evidence |

## 7.7 Example Startup Output

```text
Startup Name: MediNova AI
Confidence: High
Source: Pitch deck cover page

Sector: HealthTech
Confidence: High
Source: Pitch deck slide 2

Stage: MVP
Confidence: Medium
Source: Product roadmap slide

Support Needed:
- Hospital pilot customers
- Healthcare compliance guidance
- Funding readiness

Missing Fields:
- Company registration number
- Revenue status
- Data privacy explanation
```

## 7.8 UI Screens Connected

- AI Passport Builder Entry Page
- Evidence Upload/Input Page
- Extraction Progress Page
- Autofilled Profile Review Page
- Missing Fields Completion Page

## 7.9 User Review Requirement

The user must confirm the AI-prepared profile before it is used for verification.

```text
I confirm that the AI-prepared profile is accurate and can be used for TrustPass verification.
```

---

# 8. Agent 3 — Evidence Extraction Agent

## 8.1 Purpose

The **Evidence Extraction Agent** analyses provided evidence and identifies:

- claims
- proof
- missing proof
- source references
- contradictions
- document quality issues
- verification-relevant details

This agent supports both profile autofill and verification.

## 8.2 Core Question

> **What evidence exists, what claims are being made, and what proof is missing?**

## 8.3 When It Runs

It runs after:

- evidence is uploaded
- pasted content is submitted
- AI Passport Builder creates a draft
- admin requests deeper evidence review
- user uploads missing evidence

## 8.4 Inputs

The agent receives:

- uploaded document content
- extracted text
- user profile draft
- file metadata
- selected programme
- required evidence checklist
- previous missing evidence requests

## 8.5 Outputs

The agent should produce:

- key claims
- evidence found
- evidence missing
- document source references
- contradiction warnings
- unclear claims
- suggested evidence requests
- evidence quality status

## 8.6 Startup Evidence Types

| Evidence Type | Purpose |
|---|---|
| Pitch deck | Business/product overview |
| Company registration | Legal identity |
| Founder profile | Founder credibility |
| Product demo | Product existence |
| Customer proof | Traction validation |
| Revenue proof | Business validation |
| Pilot proof | Pilot readiness |
| Compliance document | Regulatory readiness |
| Technical architecture | Technical maturity |
| Financial projection | Funding readiness |

## 8.7 Mentor Evidence Types

| Evidence Type | Purpose |
|---|---|
| CV | Professional background |
| LinkedIn-style profile | Expertise and experience |
| Bio | Mentor positioning |
| Credentials | Validated expertise |
| Mentoring history | Prior support experience |
| References | Trust signal |
| Availability note | Engagement readiness |

## 8.8 Example Output

```text
Claims Found:
1. Startup claims hospital pilot discussions.
2. Startup claims MVP is available.
3. Startup claims AI-powered triage capability.

Evidence Found:
1. Product screenshots found in pitch deck.
2. MVP mentioned in product roadmap.

Missing Evidence:
1. No hospital pilot proof uploaded.
2. No healthcare data privacy explanation found.
3. No customer validation proof found.

Contradiction:
Revenue is mentioned in the application but not supported in the pitch deck.
```

## 8.9 UI Screens Connected

- AI Extraction Progress Page
- Autofilled Profile Review Page
- Admin Verification Workspace
- Missing Evidence Page
- Passport Stamp Recommendation Panel

---

# 9. Agent 4 — Eligibility Agent

## 9.1 Purpose

The **Eligibility Agent** checks whether a startup or mentor fits a selected programme or ecosystem requirement.

It compares the confirmed profile and evidence against programme criteria.

## 9.2 Core Question

> **Does this applicant fit the selected programme or ecosystem criteria?**

## 9.3 When It Runs

It runs after:

- user confirms the AI-prepared profile
- required minimum evidence exists
- programme criteria is available
- admin starts or restarts verification

## 9.4 Inputs

The agent receives:

- confirmed startup or mentor profile
- selected programme criteria
- evidence extraction output
- missing evidence list
- organisation rules
- passport type

## 9.5 Startup Eligibility Checks

| Check | Example |
|---|---|
| Sector fit | HealthTech fits HealthTech programme |
| Geography fit | Malaysia-based startup fits local programme |
| Startup stage | MVP or later required |
| Required documents | Pitch deck required |
| Support need fit | Startup needs pilot support |
| Technology focus | AI solution fits AI programme |
| Impact alignment | Supports innovation or SDG goals |

## 9.6 Mentor Eligibility Checks

| Check | Example |
|---|---|
| Expertise fit | Mentor has compliance expertise |
| Sector fit | Mentor supports HealthTech |
| Programme fit | Mentor fits HealthTech programme |
| Availability | Has capacity for sessions |
| Startup stage fit | Mentor supports MVP-stage startups |
| Credential completeness | Required evidence present |

## 9.7 Outputs

The agent should produce:

- eligibility score
- pass/conditional/fail recommendation
- matched criteria
- failed criteria
- missing criteria
- explanation
- confidence level
- recommended next action

## 9.8 Example Startup Output

```text
Eligibility Score: 86%

Recommendation:
Conditionally Eligible

Matched Criteria:
- HealthTech sector
- Malaysia-based
- MVP mentioned
- Seeking pilot customers

Missing / Weak Criteria:
- Pilot proof not uploaded
- Data privacy explanation missing

Explanation:
MediNova AI is a strong fit for the HealthTech Pilot Readiness Sprint, but it should remain conditional until pilot evidence and compliance documentation are provided.
```

## 9.9 UI Screens Connected

- AI Verification Result Page
- Admin Verification Workspace
- Programme Assignment Page
- Passport Verification Page

---

# 10. Agent 5 — Readiness & Risk Agent

## 10.1 Purpose

The **Readiness & Risk Agent** evaluates how ready the applicant is and what risks need human review.

This agent is important because eligibility alone is not enough. A startup may be eligible but not ready for investors, pilots, partners, or compliance-heavy linkages.

## 10.2 Core Question

> **How ready is this applicant, and what risks or gaps should admins review?**

## 10.3 When It Runs

It runs after:

- user confirms profile
- evidence extraction is complete
- eligibility check has run
- admin requests verification

## 10.4 Startup Readiness Areas

| Readiness Area | Meaning |
|---|---|
| Business Readiness | Business model, value proposition, customer clarity |
| Technical Readiness | Product maturity, MVP, technical feasibility |
| Market Readiness | Target customers, validation, go-to-market clarity |
| Funding Readiness | Investor materials, traction, financial clarity |
| Partnership Readiness | Ability to engage with partners or corporates |
| Compliance Readiness | Legal, privacy, regulatory or sector requirements |

## 10.5 Mentor Readiness Areas

| Readiness Area | Meaning |
|---|---|
| Expertise Readiness | Strength and clarity of expertise |
| Engagement Readiness | Availability and ability to support startups |
| Ecosystem Fit | Fit with current programmes |
| Startup Stage Fit | Suitable startup maturity stage |
| Reliability Signal | Prior engagement or feedback quality |

## 10.6 Risk Types

### Startup Risk Types

- unsupported traction claim
- unsupported pilot claim
- missing compliance evidence
- incomplete founder profile
- unclear product stage
- inconsistent revenue claim
- weak market validation
- sensitive sector without safeguards
- copied or generic application text

### Mentor Risk Types

- unsupported expertise claim
- incomplete profile
- unclear availability
- sector mismatch
- insufficient mentoring evidence
- conflicting organisation details

## 10.7 Outputs

The agent should produce:

- readiness score
- readiness breakdown
- risk level
- risk flags
- missing evidence impact
- recommended precautions
- explanation
- suggested next action

## 10.8 Example Startup Output

```text
Overall Readiness Score: 78%
Risk Level: Medium

Readiness Breakdown:
Business Readiness: 74%
Technical Readiness: 81%
Market Readiness: 62%
Funding Readiness: 58%
Compliance Readiness: 55%
Partnership Readiness: 70%

Risk Flags:
1. Pilot claim unsupported
2. Data privacy explanation missing
3. Funding readiness material incomplete

Recommended Precaution:
Do not introduce to hospital pilot partner until Compliance Reviewed stamp is earned.
```

## 10.9 UI Screens Connected

- AI Verification Result Page
- Admin Verification Workspace
- Digital Passport Verification Page
- Linkage Recommendation Page

---

# 11. Agent 6 — Passport & Stamp Agent

## 11.1 Purpose

The **Passport & Stamp Agent** recommends the passport status, stamps, badges, review date, and next action.

This is the agent that turns verification results into the passport experience.

## 11.2 Core Question

> **What passport should be issued, and what trust stamps has this applicant earned?**

## 11.3 When It Runs

It runs after:

- eligibility result is available
- readiness and risk result is available
- evidence extraction result is available
- user profile is confirmed
- admin requests passport recommendation

## 11.4 Outputs

The agent should produce:

- recommended passport status
- earned stamps
- pending stamps
- locked stamps
- rejected or blocked stamps
- recommended badges
- review date suggestion
- next action
- explanation

## 11.5 Startup Passport Status Logic

| Condition | Recommended Status |
|---|---|
| Strong profile, strong evidence, low risk | Verified |
| Good fit but evidence missing | Conditionally Verified |
| Many missing fields or unclear evidence | Pending Evidence |
| Contradictions or serious concerns | Needs Review |
| Does not fit programme | Redirect or Not Eligible |
| Previously issued but outdated | Renewal Required |

## 11.6 Mentor Passport Status Logic

| Condition | Recommended Status |
|---|---|
| Strong credentials and clear expertise | Verified Mentor |
| Good profile but missing credentials | Conditionally Verified |
| Expertise unclear | Needs Review |
| Not suitable for selected programme | Redirect |
| Profile outdated | Renewal Required |

## 11.7 Startup Stamps

Recommended startup stamps include:

- Profile Auto-Built
- User Confirmed
- Identity Verified
- Founder Profile Verified
- Pitch Deck Reviewed
- Programme Eligible
- MVP Confirmed
- Evidence Complete
- Compliance Review Required
- Compliance Reviewed
- Pilot Ready
- Funding Ready
- Mentor Matched
- Partner Matched
- Programme Admitted
- Engagement Completed

## 11.8 Mentor Stamps

Recommended mentor stamps include:

- Profile Auto-Built
- User Confirmed
- Identity Verified
- Expertise Verified
- Programme Approved
- Sector Specialist
- Startup Stage Specialist
- First Engagement Completed
- High Impact Mentor
- Repeat Mentor
- Funding Mentor
- Compliance Mentor
- Market Access Mentor

## 11.9 Example Output

```text
Recommended Passport Status:
Conditionally Verified

Earned Stamps:
- Profile Auto-Built
- User Confirmed
- Pitch Deck Reviewed
- Programme Eligible

Pending Stamps:
- Pilot Ready
- Compliance Reviewed
- Funding Ready

Recommended Badges:
- Verified Startup Pending
- HealthTech Programme Fit

Next Action:
Request pilot customer proof and data privacy explanation.

Explanation:
The startup is eligible and has sufficient evidence for programme fit, but readiness for pilot and funding support requires additional proof.
```

## 11.10 Admin Review Requirement

This agent only recommends.

Admin must approve:

- passport issuance
- passport status
- earned stamps
- rejected stamps
- passport suspension or revocation

## 11.11 UI Screens Connected

- Admin Verification Workspace
- Passport Issuance Panel
- Stamp Approval Panel
- Digital Passport Page
- Passport Issued Success Page
- Startup Dashboard
- Mentor Dashboard

---

# 12. Agent 7 — Linkage Recommendation Agent

## 12.1 Purpose

The **Linkage Recommendation Agent** recommends what ecosystem relationships should happen next.

It uses passport data, stamps, readiness, missing evidence, and support needs to suggest meaningful linkages.

This is the agent most directly connected to the hackathon problem statement.

## 12.2 Core Question

> **Who should this verified startup or mentor be connected with next, and in what sequence?**

## 12.3 When It Runs

It runs after:

- passport is issued
- stamps are approved
- startup is verified or conditionally verified
- mentor is verified
- admin requests linkage recommendation
- evidence or passport status changes
- engagement feedback is submitted

## 12.4 Inputs

The agent receives:

- passport profile
- passport status
- earned stamps
- pending stamps
- missing evidence
- readiness scores
- risk flags
- startup support needs
- mentor expertise
- programme criteria
- actor registry
- previous linkage outcomes, if available

## 12.5 Linkage Types

| Linkage | Example |
|---|---|
| Startup to Mentor | HealthTech compliance mentor |
| Startup to Programme | HealthTech Pilot Readiness Sprint |
| Startup to Partner | Hospital innovation partner |
| Startup to Service Provider | Legal/compliance advisor |
| Startup to Funding Support | Funding readiness coach |
| Mentor to Programme | Mentor approved for HealthTech programme |
| Partner to Initiative | Cloud partner supports AI accelerator |

## 12.6 Outputs

The agent should produce:

- recommended linkages
- recommended sequence
- confidence level
- explanation
- expected outcome
- required preconditions
- blocked linkages
- activation pack draft
- suggested engagement agenda
- stamp impact

## 12.7 Example Output

```text
Recommended Sequence:
1. Healthcare Compliance Mentor
2. Hospital Pilot Partner
3. Funding Readiness Advisor

Blocked Linkage:
Hospital Pilot Partner is blocked until Compliance Reviewed stamp is earned.

Reason:
The startup handles healthcare workflows and needs privacy review before pilot introduction.

Expected Outcome:
Startup receives compliance readiness guidance and can work toward Pilot Ready stamp.
```

## 12.8 Linkage Governance Rules

The agent should not recommend high-risk linkages without preconditions.

| Condition | Linkage Rule |
|---|---|
| Compliance stamp missing | Block hospital pilot partner |
| Funding readiness low | Delay investor introduction |
| Mentor not verified | Do not assign mentor |
| Passport expired | Require renewal before new linkage |
| Evidence incomplete | Recommend evidence request first |

## 12.9 Activation Pack Output

The agent should generate:

- intro message
- suggested agenda
- expected outcome
- participant summaries
- meeting focus
- feedback questions

Example:

```text
Suggested Agenda:
1. Review product and healthcare data flow
2. Identify compliance gaps
3. Define evidence needed for Compliance Reviewed stamp
4. Prepare next steps for pilot partner introduction
```

## 12.10 UI Screens Connected

- Linkage Recommendation Page
- Linkage Detail Page
- Admin Linkage Approval Panel
- Mentor/Partner Request Page
- Engagement Plan Page
- Feedback Form Page
- Startup Dashboard

---

# 13. Agent Interaction Matrix

| Step | Agent | Output Used By |
|---:|---|---|
| 1 | Orchestrator Agent | All agents and UI workflow |
| 2 | AI Passport Builder Agent | User review, Evidence Extraction Agent |
| 3 | Evidence Extraction Agent | Eligibility Agent, Readiness & Risk Agent |
| 4 | User Confirmation | Eligibility Agent |
| 5 | Eligibility Agent | Passport & Stamp Agent |
| 6 | Readiness & Risk Agent | Passport & Stamp Agent, Linkage Agent |
| 7 | Passport & Stamp Agent | Admin Workspace, Digital Passport UI |
| 8 | Admin Approval | Passport Issued Page |
| 9 | Linkage Recommendation Agent | Linkage UI, Activation Pack |

---

# 14. Screen-to-Agent Mapping

| Screen | Agents Used |
|---|---|
| AI Passport Builder | Orchestrator, AI Passport Builder |
| AI Extraction Progress | Orchestrator, AI Passport Builder, Evidence Extraction |
| Autofilled Profile Review | AI Passport Builder |
| Missing Fields Completion | AI Passport Builder, Evidence Extraction |
| AI Verification Result | Eligibility, Readiness & Risk, Passport & Stamp |
| Admin Verification Workspace | Evidence Extraction, Eligibility, Readiness & Risk, Passport & Stamp |
| Passport Issued Page | Passport & Stamp |
| Digital Passport Page | Passport & Stamp |
| Linkage Recommendation Page | Linkage Recommendation |
| Mentor/Partner Request Page | Linkage Recommendation |

---

# 15. Failure and Fallback Strategy

## 15.1 AI Extraction Fails

Show:

```text
We could not extract enough information from the uploaded evidence. Please paste a short description or upload a clearer file.
```

Fallback:

- allow manual paste
- allow partial profile
- mark fields as low confidence

## 15.2 Missing Evidence

Show:

```text
TrustPass AI prepared most of your profile, but some evidence is missing.
```

Fallback:

- request only missing fields
- keep relevant stamps pending
- allow conditional verification

## 15.3 Low Confidence

Show:

```text
Some fields need confirmation because AI confidence is low.
```

Fallback:

- highlight low-confidence fields
- require user confirmation
- admin review before issuing stamps

## 15.4 Risk Detected

Show to admin:

```text
Risk flags detected. Human review is required before passport issuance.
```

Fallback:

- mark passport as Needs Review
- do not issue sensitive stamps
- request evidence

## 15.5 Linkage Not Possible

Show:

```text
No suitable linkage is available yet. Complete the pending passport requirements first.
```

Fallback:

- recommend next evidence
- recommend mentor before partner
- block risky linkages

---

# 16. Human Review Requirements

Human review is required for:

- final passport issuance
- rejection or not eligible decision
- high-risk cases
- stamp approval
- public badge approval
- linkage activation
- passport suspension
- passport revocation
- disputed evidence
- sensitive sector recommendations

---

# 17. Agent Output Quality Rules

All agent outputs should be:

- structured
- explainable
- evidence-aware
- confidence-scored
- suitable for admin review
- non-judgmental
- actionable

Avoid outputs that are:

- vague
- overly confident without evidence
- final rejection decisions
- unsupported assumptions
- sensitive information exposed publicly
- long paragraphs without action

---

# 18. Recommended MVP Agent Scope

For hackathon MVP, keep the agents practical.

## Must Build

| Agent | MVP Requirement |
|---|---|
| Orchestrator Agent | Basic workflow control |
| AI Passport Builder Agent | Autofill startup profile from text/deck |
| Evidence Extraction Agent | Claims, missing evidence, source tags |
| Eligibility Agent | Programme fit score |
| Readiness & Risk Agent | Readiness scores and risk flags |
| Passport & Stamp Agent | Passport status and stamp recommendation |
| Linkage Recommendation Agent | 3 recommended linkages with explanation |

## Can Be Simplified

| Capability | MVP Simplification |
|---|---|
| File parsing | Use pasted text or simple extracted PDF text |
| Website import | Let user paste website text |
| LinkedIn import | Let mentor paste profile text |
| Voice input | Skip or mock |
| External verification | Skip or mock |
| Real scoring model | Use prompt-based scoring |
| Actor registry | Use predefined sample mentors/partners |
| Public passport verification | Mock page |

---

# 19. Recommended Demo Agent Flow

Use one sample startup.

## Startup

```text
MediNova AI
HealthTech startup in Malaysia
MVP-stage AI triage assistant
Needs hospital pilots, compliance guidance, and funding readiness
```

## Demo Steps

```text
1. Upload / paste startup evidence
2. AI Passport Builder autofills profile
3. User confirms profile
4. Evidence Extraction finds missing pilot proof
5. Eligibility Agent scores 86%
6. Readiness & Risk Agent scores 78% and flags medium risk
7. Passport & Stamp Agent recommends conditional passport
8. Admin issues passport
9. Startup receives stamps
10. Linkage Recommendation Agent recommends compliance mentor first
```

## Best Demo Moment

Show the linkage sequence:

```text
Compliance Mentor → Hospital Pilot Partner → Funding Readiness Advisor
```

Explain:

> TrustPass AI does not randomly match people. It recommends the right relationship sequence based on verified passport intelligence.

---

# 20. Agent Workflow Success Criteria

The agent workflow is successful if:

- users avoid long manual data entry
- AI prepares structured passport profiles
- low-confidence fields are clearly shown
- users confirm extracted data
- admins receive explainable verification results
- passport stamps are based on evidence
- risky linkages are blocked or sequenced
- recommended linkages are relevant and explainable
- the workflow supports human decision-making

---

# 21. Final Agent Workflow Positioning

TrustPass AI should be described as:

> **A Gemini-powered multi-agent workflow that turns existing startup and mentor evidence into verified digital passports and trusted ecosystem linkages.**

Strongest workflow message:

```text
Upload → Autofill → Confirm → Verify → Issue Passport → Recommend Linkages
```

Strongest governance message:

```text
AI prepares and recommends. Humans approve.
```

Strongest product differentiator:

```text
From pitch deck to trusted ecosystem passport in minutes.
```
