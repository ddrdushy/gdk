# TrustPass AI — Module 4: AI Verification Engine

## 1. Module Purpose

The **AI Verification Engine** is the intelligence layer of TrustPass AI.

It analyses startup and mentor profiles, uploaded documents, programme criteria, readiness signals, missing evidence, and risk indicators. It then produces explainable verification outputs for admin review.

This module should not make final decisions alone. It should assist human reviewers by making verification faster, more consistent, and more transparent.

---

## 2. Core Objective

The AI Verification Engine answers:

> **Is this startup or mentor real, relevant, eligible, ready, and suitable for ecosystem linkage?**

It helps admins understand:

- What the applicant claims
- What evidence exists
- What evidence is missing
- Whether the applicant fits a programme
- What risks require review
- What passport stamps can be issued
- What linkages should be recommended

---

## 3. Main Verification Subjects

## 3.1 Startup Verification

For startups, AI checks:

- Startup identity
- Founder information
- Sector
- Startup stage
- Pitch deck content
- Programme eligibility
- Business readiness
- Technical readiness
- Market readiness
- Funding readiness
- Compliance readiness
- Missing evidence
- Risk flags
- Recommended stamps and badges
- Recommended linkages

---

## 3.2 Mentor Verification

For mentors, AI checks:

- Mentor identity
- Expertise areas
- Professional background
- Sector relevance
- Programme fit
- Availability
- Startup stage suitability
- Claimed experience
- Missing credentials
- Recommended mentor stamps
- Recommended startup linkage types

---

## 4. AI Verification Flow

```text
Profile Submitted
      ↓
Documents Uploaded
      ↓
AI Reads Profile and Documents
      ↓
AI Extracts Key Information
      ↓
AI Checks Eligibility
      ↓
AI Scores Readiness
      ↓
AI Detects Missing Evidence
      ↓
AI Flags Risks
      ↓
AI Recommends Passport Status
      ↓
AI Recommends Stamps and Badges
      ↓
Admin Reviews and Decides
```

---

## 5. AI Agents Inside the Engine

## 5.1 Intake Understanding Agent

### Purpose

Converts raw profile information into a clear structured summary.

### What It Reads

- Startup form
- Mentor form
- Application answers
- Uploaded document descriptions
- Support needs
- Programme selection

### Output

A plain-language summary.

Example:

```text
MediNova AI is an MVP-stage HealthTech startup in Malaysia building an AI-powered triage assistant for clinics and hospitals. The startup is seeking pilot customers, healthcare compliance guidance, and funding readiness support.
```

---

## 5.2 Document Reader Agent

### Purpose

Reads uploaded documents and extracts useful verification information.

### Documents It Can Review

- Pitch deck
- Founder profile
- Company registration
- Product demo description
- Customer proof
- Revenue proof
- Compliance document
- Mentor credentials
- Professional profile
- Programme application file

### Output

- Key facts
- Claims found
- Evidence found
- Missing sections
- Contradictions
- Summary

---

## 5.3 Eligibility Agent

### Purpose

Checks if the applicant fits a specific programme or ecosystem requirement.

### Startup Eligibility Checks

- Sector fit
- Geography fit
- Startup stage
- Programme goal alignment
- Required documents
- Technology focus
- Impact alignment
- Support need alignment

### Mentor Eligibility Checks

- Expertise fit
- Sector relevance
- Programme suitability
- Availability
- Startup stage experience
- Required credentials

### Output

```text
Eligibility Score: 86%
Decision Recommendation: Conditionally Eligible
Reason: Startup matches HealthTech programme criteria but lacks pilot evidence.
```

---

## 5.4 Readiness Agent

### Purpose

Scores how ready the applicant is for ecosystem participation.

### Startup Readiness Areas

| Readiness Area | Meaning |
|---|---|
| Business Readiness | Business model and customer clarity |
| Technical Readiness | Product maturity and technology feasibility |
| Market Readiness | Customer validation and go-to-market clarity |
| Funding Readiness | Investor material, traction, and financial clarity |
| Partnership Readiness | Ability to engage with partners or corporates |
| Compliance Readiness | Legal, privacy, regulatory awareness |

### Mentor Readiness Areas

| Readiness Area | Meaning |
|---|---|
| Expertise Readiness | Strength of mentor domain expertise |
| Engagement Readiness | Availability and willingness to support |
| Ecosystem Fit | Fit with current programmes |
| Startup Stage Fit | Suitability for idea, MVP, revenue, or growth startups |
| Reliability Signal | Past engagement and feedback quality |

---

## 5.5 Missing Evidence Agent

### Purpose

Identifies what is missing before a passport can be fully issued or upgraded.

### Startup Missing Evidence Examples

- Company registration document
- Pitch deck
- Product demo link
- Pilot customer proof
- Customer validation
- Revenue evidence
- Data privacy explanation
- Compliance document
- Financial projection
- Founder profile

### Mentor Missing Evidence Examples

- LinkedIn profile
- Professional bio
- Expertise proof
- Previous mentoring record
- Organisation affiliation
- Availability confirmation
- Sector credentials

### Output Example

```text
Missing Evidence:
1. Pilot customer proof
2. Healthcare data privacy explanation
3. Financial projection slide
```

---

## 5.6 Risk & Consistency Agent

### Purpose

Finds inconsistencies, unsupported claims, and review triggers.

### Startup Risk Examples

- Claims revenue but no proof
- Claims pilots but no evidence
- Website unavailable
- Founder profile incomplete
- Pitch deck and application do not match
- Product stage unclear
- Compliance gap in regulated sector
- Weak or copied application text

### Mentor Risk Examples

- Expertise claim not supported
- Profile incomplete
- Availability unclear
- Sector mismatch
- No evidence of mentoring experience
- Conflicting organisation details

### Output Example

```text
Risk Level: Medium

Risk Flags:
- Startup claims hospital pilot engagement but no proof was uploaded.
- Data privacy readiness is unclear for a healthcare solution.
```

---

## 5.7 Passport Stamp Recommendation Agent

### Purpose

Recommends which stamps should be issued, pending, locked, or rejected.

### Startup Stamp Recommendations

Example:

```text
Earned Stamps:
- Identity Verified
- Pitch Deck Reviewed
- Programme Eligible

Pending Stamps:
- Pilot Ready
- Funding Ready
- Compliance Reviewed
```

### Mentor Stamp Recommendations

Example:

```text
Earned Stamps:
- Identity Verified
- Expertise Verified

Pending Stamps:
- Programme Approved
- High Impact Mentor
```

---

## 5.8 Linkage Recommendation Agent

### Purpose

Recommends what type of ecosystem actor the applicant should connect with.

### Startup Linkage Recommendations

- Mentor
- Programme
- Partner
- Service provider
- Investor-readiness coach
- Corporate pilot partner
- Grant support
- Compliance advisor

### Mentor Linkage Recommendations

- Suitable startup sectors
- Suitable startup stage
- Suitable programme type
- Recommended engagement format

---

## 5.9 Explanation Agent

### Purpose

Turns AI analysis into clear human-readable reasoning.

### Output Requirements

The explanation should be:

- Clear
- Short
- Evidence-based
- Actionable
- Non-judgmental
- Suitable for admin review

### Example

```text
The startup is conditionally verified because it fits the HealthTech programme and has an MVP. However, the application lacks pilot customer evidence and data privacy documentation, so the Pilot Ready and Compliance Reviewed stamps should remain pending.
```

---

## 6. Verification Outputs

## 6.1 Startup Verification Output

The AI should produce:

- Startup summary
- Eligibility score
- Readiness score
- Evidence completeness
- Risk level
- Missing evidence
- Recommended status
- Recommended stamps
- Recommended badges
- Recommended linkages
- Explanation

---

## 6.2 Mentor Verification Output

The AI should produce:

- Mentor summary
- Expertise confidence
- Ecosystem fit score
- Engagement readiness
- Missing credentials
- Risk level
- Recommended status
- Recommended stamps
- Recommended startup types
- Explanation

---

## 7. Verification Status Recommendations

The AI can recommend, but admin must decide.

| Status | Meaning |
|---|---|
| Verified | Applicant meets requirements |
| Conditionally Verified | Mostly fits but evidence is missing |
| Needs Review | Inconsistencies or concerns require human check |
| Not Eligible | Does not fit selected programme |
| Redirect | Better suited for another programme |
| Pending Evidence | More documents required before decision |

---

## 8. AI Confidence Levels

Use confidence levels to guide admins.

| Confidence | Meaning |
|---|---|
| High | AI found strong evidence and clear fit |
| Medium | AI found partial evidence or some uncertainty |
| Low | AI needs human review due to incomplete or unclear data |

Example:

```text
Recommendation Confidence: Medium
Reason: Startup appears eligible but supporting evidence is incomplete.
```

---

## 9. Human-in-the-Loop Principle

The AI Verification Engine should follow this rule:

> **AI recommends. Humans approve.**

Admins should be able to:

- Accept AI recommendation
- Override AI recommendation
- Request more evidence
- Add manual notes
- Change stamp status
- Change passport status
- Send application for deeper review

---

## 10. Ethical Considerations

Because verification affects access to opportunities, the AI must be careful.

### Required Principles

- Do not automatically reject applicants
- Explain all recommendations
- Allow users to submit missing evidence
- Treat risk flags as review signals
- Avoid unfair scoring based on incomplete public information
- Allow admin override
- Maintain audit trail
- Avoid exposing sensitive risk details publicly

---

## 11. Admin Experience

The AI Verification Engine should appear inside the **Admin Verification Workspace**.

Admins should see:

- AI verification stepper
- Extracted summary
- Scores
- Missing evidence
- Risk flags
- Stamp recommendations
- Passport status recommendation
- Linkage recommendations
- Explanation
- Admin decision buttons

---

## 12. Startup Experience

Startups should not see every internal AI detail.

They should see:

- Verification status
- Missing evidence
- Passport status
- Earned stamps
- Pending stamps
- Clear next steps

They should not see:

- Internal risk notes
- Private admin comments
- Sensitive scoring logic
- Full AI reasoning if it could be misinterpreted

---

## 13. Mentor Experience

Mentors should see:

- Mentor verification status
- Mentor Passport status
- Earned stamps
- Pending stamps
- Missing credentials
- Approved expertise areas
- Linkage readiness

They should not see internal admin notes.

---

## 14. What Needs to Be Built

## 14.1 AI Verification Workflows

Build workflows for:

1. Startup profile analysis
2. Startup document analysis
3. Startup eligibility check
4. Startup readiness scoring
5. Startup missing evidence detection
6. Startup risk flagging
7. Startup stamp recommendation
8. Startup linkage recommendation
9. Mentor profile analysis
10. Mentor expertise verification
11. Mentor stamp recommendation

---

## 14.2 AI Output Screens

Build UI sections for:

- AI summary
- Score cards
- Missing evidence list
- Risk flag list
- Recommended passport status
- Recommended stamps
- Recommended linkages
- AI explanation
- Admin decision panel

---

## 14.3 Admin Controls

Build admin actions:

- Accept recommendation
- Override recommendation
- Request evidence
- Approve stamp
- Reject stamp
- Issue passport
- Mark as needs review
- Redirect applicant
- Add note

---

## 15. MVP Scope for Hackathon

## Must Build

1. Startup AI verification result
2. Eligibility score
3. Readiness score
4. Missing evidence detection
5. Risk flags
6. Recommended passport status
7. Stamp recommendation
8. AI explanation

## Should Build

1. Mentor verification result
2. Linkage recommendation
3. Admin override decision

## Can Be Mocked

1. Full document parsing
2. Real external verification
3. Advanced bias monitoring
4. Complex scoring formulas

---

## 16. Example AI Verification Output

```text
Startup: MediNova AI
Sector: HealthTech
Stage: MVP
Country: Malaysia

Eligibility Score: 86%
Readiness Score: 78%
Evidence Completeness: 64%
Risk Level: Medium

Recommended Status:
Conditionally Verified

Earned Stamps:
- Identity Verified
- Pitch Deck Reviewed
- Programme Eligible

Pending Stamps:
- Pilot Ready
- Funding Ready
- Compliance Reviewed

Missing Evidence:
- Pilot customer proof
- Data privacy explanation
- Financial projection slide

Recommended Linkages:
- Healthcare Compliance Mentor
- Hospital Pilot Partner
- Funding Readiness Advisor

AI Explanation:
MediNova AI fits the HealthTech programme and has an MVP. However, pilot evidence and compliance documentation are incomplete, so the startup should receive a conditional passport and be routed to a compliance mentor before pilot partner introduction.
```

---

## 17. Success Criteria

The AI Verification Engine is successful if:

- It reduces manual review effort
- It produces useful explanations
- It identifies missing evidence clearly
- It recommends meaningful passport stamps
- It supports human decision-making
- It improves consistency across applications
- It connects verification to ecosystem linkages

---

## 18. Final Positioning

The AI Verification Engine should be presented as:

> **The intelligence layer that converts raw applications into trusted, reviewable passport decisions.**

Strongest message:

```text
AI does the heavy review. Humans make the final decision.
```

Strongest output:

```text
Verified passport status, earned stamps, missing evidence, and recommended linkages.
```
