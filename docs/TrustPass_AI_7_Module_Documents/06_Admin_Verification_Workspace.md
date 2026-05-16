# TrustPass AI — Module 6: Admin Verification Workspace

## 1. Module Purpose

The **Admin Verification Workspace** is where programme administrators review AI verification results, make decisions, request evidence, issue passports, and approve ecosystem linkages.

This module is the control center for human-in-the-loop verification.

The system should make admins faster, more consistent, and more confident without removing human decision-making.

---

## 2. Core Objective

The Admin Verification Workspace helps admins answer:

> **Should this startup or mentor receive a passport, what stamps should be issued, and what linkages should be activated?**

It should bring together:

- Application details
- AI summary
- Eligibility score
- Readiness score
- Missing evidence
- Risk flags
- Stamp recommendations
- Passport status recommendation
- Admin decision controls
- Linkage recommendations

---

## 3. Main Users

## 3.1 Programme Administrator

Uses the workspace daily to review applications.

Can:

- View applications
- Run AI verification
- Review AI recommendations
- Request evidence
- Approve or reject verification
- Issue passports
- Approve stamps
- Trigger linkages

## 3.2 Ecosystem Owner

Uses the workspace for oversight.

Can:

- View all programme verification activity
- Review audit trail
- Check decision consistency
- Monitor bottlenecks

## 3.3 Reviewer

A limited admin role.

Can:

- Review assigned applications
- Add notes
- Recommend decisions
- Escalate cases

---

## 4. Admin Dashboard

## 4.1 Purpose

Give admins a summary of verification operations.

## 4.2 Dashboard Metrics

| Metric | Example |
|---|---:|
| New Applications | 48 |
| Awaiting AI Verification | 12 |
| Needs Admin Review | 19 |
| Evidence Requested | 15 |
| Passports Issued | 31 |
| Ready for Linkage | 22 |
| High Risk Reviews | 4 |

## 4.3 Dashboard Sections

- Verification funnel
- Priority review queue
- Recent applications
- Missing evidence queue
- Passport issuance summary
- Risk distribution
- Linkage-ready startups

---

## 5. Application Inbox

## 5.1 Purpose

Show all startup and mentor applications awaiting action.

## 5.2 Table Columns

- Applicant name
- Applicant type
- Sector / expertise
- Country
- Programme applied
- Status
- Eligibility score
- Risk level
- Passport status
- Submitted date
- Assigned reviewer

## 5.3 Filters

- Applicant type
- Programme
- Status
- Sector
- Country
- Risk level
- Score range
- Missing evidence
- Assigned reviewer

## 5.4 Actions

- Open application
- Run AI verification
- Assign reviewer
- Request evidence
- Mark priority
- Issue passport
- Redirect applicant

---

## 6. Application Detail Page

## 6.1 Purpose

Allow admin to inspect raw profile and submitted documents.

## 6.2 Tabs

| Tab | Purpose |
|---|---|
| Overview | Summary of application |
| Profile | Startup or mentor profile details |
| Documents | Uploaded evidence |
| AI Summary | AI-extracted summary |
| Verification | Full AI verification result |
| Notes | Admin notes |
| Activity | Timeline and audit trail |

## 6.3 Right-Side AI Summary Panel

Example:

```text
AI Summary:
MediNova AI is an MVP-stage HealthTech startup seeking hospital pilots, compliance guidance, and funding readiness. It appears aligned with the HealthTech Pilot Readiness programme but lacks pilot evidence and privacy documentation.
```

---

## 7. AI Verification Workspace

## 7.1 Purpose

This is the main review screen.

It should show AI reasoning clearly and allow admin decisions.

## 7.2 Page Layout

Recommended layout:

```text
Header: Applicant + Status
Left Panel: Application Summary
Center Panel: AI Verification Results
Right Panel: Admin Decision Actions
Bottom Section: Passport and Stamp Recommendations
```

---

## 7.3 Verification Stepper

Show how AI processed the application.

```text
Reading profile
Reading documents
Checking eligibility
Scoring readiness
Finding missing evidence
Checking risks
Recommending passport status
Recommending linkages
```

Each step can show:

- Completed
- In progress
- Warning
- Needs review

---

## 7.4 Score Cards

Display key scores.

### Startup Score Cards

- Identity confidence
- Eligibility score
- Startup readiness
- Evidence completeness
- Risk level

### Mentor Score Cards

- Identity confidence
- Expertise confidence
- Ecosystem fit
- Engagement readiness
- Feedback score, if available

---

## 7.5 AI Recommendation Panel

This panel shows the recommended decision.

### Example

```text
Recommended Decision:
Conditionally Verified

Reason:
The startup fits the programme and has an MVP. However, pilot evidence and data privacy documentation are missing.
```

### Recommendation Confidence

Show:

- High
- Medium
- Low

Example:

```text
Confidence: Medium
```

---

## 7.6 Missing Evidence Panel

Shows what evidence is missing and why.

### Example

```text
Missing Evidence:
1. Pilot customer proof
2. Data privacy explanation
3. Financial projection slide
```

For each missing item, admin should be able to:

- Request evidence
- Mark as not required
- Add comment
- Set deadline

---

## 7.7 Risk Flag Panel

Shows risk indicators for admin review.

### Risk Card Fields

- Severity
- Risk title
- Explanation
- Evidence source
- Recommended action

Example:

```text
Risk Flag:
Pilot claim unsupported

Explanation:
The startup claims hospital pilot discussions, but no proof was uploaded.

Recommended Action:
Request pilot customer evidence before issuing Pilot Ready stamp.
```

---

## 8. Passport Issuance Panel

## 8.1 Purpose

Allow admin to issue or update a passport.

## 8.2 Admin Actions

- Issue Startup Passport
- Issue Mentor Passport
- Mark conditionally verified
- Set review date
- Suspend passport
- Renew passport
- Revoke passport

## 8.3 Passport Issuance Confirmation

Before issuing, show confirmation:

```text
You are about to issue a Startup Passport to MediNova AI.

Status:
Conditionally Verified

Stamps to issue:
- Identity Verified
- Pitch Deck Reviewed
- Programme Eligible
```

Admin clicks:

```text
Issue Passport
```

---

## 9. Stamp Approval Panel

## 9.1 Purpose

Allow admin to approve, reject, or keep stamps pending.

## 9.2 Stamp Recommendation Table

| Stamp | AI Recommendation | Admin Decision |
|---|---|---|
| Identity Verified | Issue | Approve |
| Pitch Deck Reviewed | Issue | Approve |
| Programme Eligible | Issue | Approve |
| Pilot Ready | Pending | Request Evidence |
| Funding Ready | Pending | Keep Pending |
| Compliance Reviewed | Pending | Request Evidence |

## 9.3 Stamp Admin Actions

- Approve stamp
- Keep pending
- Request evidence
- Reject stamp
- Revoke stamp
- Add comment

---

## 10. Evidence Request Workflow

## 10.1 Purpose

Allow admin to ask startup or mentor for more information.

## 10.2 Request Fields

- Evidence title
- Reason
- Accepted evidence types
- Deadline
- Admin note

## 10.3 Example Request

```text
Evidence Required:
Pilot Customer Proof

Reason:
Your application mentions hospital pilot discussions, but no supporting proof was uploaded.

Accepted Evidence:
LOI, email confirmation, meeting notes, pilot proposal, or customer confirmation.
```

---

## 11. Admin Decision Options

For each application, admin can choose:

| Decision | Meaning |
|---|---|
| Verify | Applicant meets requirements |
| Conditionally Verify | Applicant fits but evidence is pending |
| Request Evidence | More proof required |
| Needs Review | Escalate for manual review |
| Redirect | Better suited for another programme |
| Not Eligible | Does not fit current criteria |
| Suspend | Temporarily pause passport |
| Revoke | Remove passport validity |

---

## 12. Linkage Approval Panel

## 12.1 Purpose

After passport issuance, admin reviews recommended linkages.

## 12.2 Linkage Cards

Example:

```text
Recommended Linkage:
Healthcare Compliance Mentor

Reason:
Startup operates in HealthTech and lacks data privacy evidence.

Suggested Outcome:
Prepare startup for hospital pilot readiness.
```

## 12.3 Admin Actions

- Approve linkage
- Replace recommended actor
- Generate intro message
- Create engagement plan
- Save for later
- Reject linkage

---

## 13. Review Queue

## 13.1 Purpose

Help admins prioritise work.

## 13.2 Queue Categories

| Queue | Meaning |
|---|---|
| High Confidence Approvals | Easy approvals |
| Needs Evidence | Missing information |
| High Risk Review | Requires careful review |
| Redirect Candidates | Better fit elsewhere |
| Passport Ready | Ready to issue |
| Linkage Ready | Passport issued and ready for connection |

---

## 14. Audit Trail

## 14.1 Purpose

Every important decision must be traceable.

## 14.2 Events to Track

- Application submitted
- AI verification started
- AI verification completed
- Admin reviewed
- Evidence requested
- Evidence uploaded
- Passport issued
- Stamp approved
- Stamp revoked
- Linkage approved
- Admin override
- Status changed

## 14.3 Audit Display

Use a timeline:

```text
10:15 AM — AI verification completed
10:18 AM — Admin marked conditionally verified
10:20 AM — Evidence request sent
11:05 AM — Startup uploaded document
11:30 AM — Passport issued
```

---

## 15. Admin Notes

Admins should be able to add notes.

## 15.1 Note Types

- Internal note
- Evidence note
- Decision note
- Escalation note
- Linkage note

## 15.2 Visibility

Internal notes should not be visible to startups or mentors.

---

## 16. Notifications

Admins should receive notifications for:

- New application
- AI verification completed
- High risk flag
- Evidence uploaded
- Review deadline approaching
- Passport ready to issue
- Linkage pending approval

---

## 17. What Needs to Be Built

## 17.1 Pages

Build these pages:

1. Admin dashboard
2. Application inbox
3. Application detail page
4. AI verification workspace
5. Passport issuance page/panel
6. Stamp approval panel
7. Evidence request page/panel
8. Review queue
9. Linkage approval page
10. Audit trail page

---

## 17.2 UI Components

Build these components:

- AdminDashboardMetrics
- ApplicationInboxTable
- ApplicationSummaryPanel
- VerificationStepper
- ScoreCard
- AIRecommendationPanel
- MissingEvidencePanel
- RiskFlagPanel
- AdminDecisionPanel
- PassportIssuancePanel
- StampApprovalTable
- EvidenceRequestForm
- LinkageApprovalCard
- AuditTimeline

---

## 17.3 Admin Actions

Build actions for:

- Run AI verification
- Review application
- Request evidence
- Approve verification
- Conditionally verify
- Issue passport
- Approve stamp
- Reject stamp
- Keep stamp pending
- Approve linkage
- Add note
- Escalate review

---

## 18. MVP Scope for Hackathon

## Must Build

1. Admin dashboard
2. Application inbox
3. AI verification workspace
4. Missing evidence panel
5. Risk flag panel
6. Passport issuance action
7. Stamp approval view
8. Linkage recommendation approval

## Nice to Have

1. Full audit trail
2. Review queue filters
3. Evidence request workflow
4. Admin notes
5. Notification center

## Can Be Mocked

1. Real multi-admin assignment
2. Full permissions
3. Email notification
4. Complete audit database

---

## 19. UX Principles

## 19.1 Make AI Explainable

Admins should never see just a score.

Every recommendation needs a reason.

## 19.2 Keep Admin in Control

AI should assist, not decide.

Always show admin action buttons.

## 19.3 Make Missing Evidence Actionable

Do not only say “incomplete”.

Say exactly what is missing and why.

## 19.4 Make Passport Issuance Feel Important

Issuing a passport should feel like an official decision.

Use confirmation and clear stamp summary.

---

## 20. Success Criteria

The Admin Verification Workspace is successful if:

- Admins can review applications quickly
- AI output is understandable
- Missing evidence is clear
- Risk flags are useful
- Passport issuance is easy
- Stamp decisions are manageable
- Linkage recommendations are connected to verification
- Every important decision can be audited

---

## 21. Final Positioning

The Admin Verification Workspace should feel like:

> **A command center for AI-assisted trust decisions.**

Strongest admin action:

```text
Issue Passport
```

Strongest governance principle:

```text
AI recommends. Humans approve.
```

Strongest workflow:

```text
Review → Decide → Issue Passport → Approve Stamps → Activate Linkages
```
