# TrustPass AI — Detailed UI / UX Documentation

## 1. Purpose of This Document

This document defines the complete UI structure for **TrustPass AI**, including landing pages, authentication pages, user dashboards, admin workflows, startup onboarding, AI verification screens, Trust Passport pages, linkage recommendation screens, and reporting pages.

The goal is to help the team build a polished hackathon prototype that looks like a real product, not just a basic admin dashboard.

---

# 2. Product UI Philosophy

## 2.1 Design Direction

TrustPass AI should feel like a **trust infrastructure platform for innovation ecosystems**.

It should not look like a normal CRM or form-based management system.

The UI should communicate:

- Trust
- Intelligence
- Speed
- Verification
- Ecosystem connectivity
- Explainable AI
- Professional governance

## 2.2 Visual Style

Recommended style:

- Clean enterprise SaaS interface
- Modern AI product feel
- Minimal but premium
- Strong visual hierarchy
- Clear status indicators
- Card-based layout
- Soft shadows
- Rounded corners
- Subtle gradients
- Trust-focused color system

## 2.3 Suggested Brand Theme

| Element | Recommendation |
|---|---|
| Primary color | Deep navy / midnight blue |
| Accent color | Electric blue or cyan |
| Success color | Green |
| Warning color | Amber |
| Risk color | Red |
| Background | Off-white / light grey |
| Card background | White |
| Border | Light slate |
| Text | Dark slate / navy |
| Font | Inter, Manrope, or similar modern SaaS font |

## 2.4 UI Personality

The product should feel like:

> “AI due diligence meets ecosystem orchestration.”

Not:

> “Spreadsheet replacement.”

---

# 3. Main User Roles

TrustPass AI should support multiple user perspectives.

## 3.1 Public Visitor

A person who visits the marketing website.

Can:

- Read product value proposition
- Understand how TrustPass AI works
- View use cases
- Request demo
- Sign in
- Start application

## 3.2 Startup Founder

A startup applicant.

Can:

- Create account
- Submit startup profile
- Upload documents
- View verification progress
- See missing evidence
- Respond to admin requests
- View approved Trust Passport summary

## 3.3 Programme Administrator

An accelerator, government, university, or corporate innovation admin.

Can:

- Review startup applications
- Run AI verification
- View Trust Passports
- Approve or override decisions
- Request missing evidence
- Assign startups to programmes
- Activate recommended linkages

## 3.4 Mentor / Partner

A mentor, service provider, investor-readiness coach, or ecosystem partner.

Can:

- View assigned startup passport summary
- Accept linkage request
- View recommended engagement agenda
- Submit feedback after engagement

## 3.5 Super Admin / Ecosystem Owner

The organisation-level admin.

Can:

- Manage programmes
- Configure eligibility criteria
- Manage actor registry
- View analytics
- Manage AI scoring rules
- Export reports

---

# 4. Full Application Sitemap

```text
Public Website
├── Landing Page
├── Product Page
├── How It Works Page
├── Use Cases Page
├── Pricing Page
├── About Page
├── Contact / Request Demo Page
├── Startup Application Entry Page
└── Login / Sign Up

Authentication
├── Login
├── Sign Up
├── Forgot Password
├── Reset Password
├── Email Verification
└── Role Selection

Startup Portal
├── Startup Dashboard
├── Create Startup Profile
├── Upload Documents
├── Application Status
├── Trust Passport View
├── Missing Evidence Page
├── Messages / Requests
└── Settings

Admin Portal
├── Admin Dashboard
├── Application Inbox
├── Startup Application Detail
├── AI Verification Workspace
├── Trust Passport Detail
├── Review Queue
├── Linkage Recommendations
├── Programme Assignment
├── Actor Registry
├── Programme Management
├── Reports & Analytics
└── Settings

Mentor / Partner Portal
├── Partner Dashboard
├── Linkage Requests
├── Startup Passport Summary
├── Engagement Plan
├── Feedback Form
└── Profile Settings

Super Admin
├── Organisation Dashboard
├── Programme Configuration
├── Eligibility Rules Builder
├── AI Prompt / Policy Settings
├── User Management
├── Audit Logs
├── Data Export
└── Billing
```

---

# 5. Public Website Pages

## 5.1 Landing Page

### Purpose

The landing page should explain the problem, introduce TrustPass AI, and drive users to request a demo or start startup verification.

### Main Goal

Make visitors immediately understand:

> TrustPass AI verifies startups once and connects them everywhere.

### Page Sections

## Section 1: Hero

### Layout

- Left side: headline, subheadline, CTAs
- Right side: product visual showing a Startup Trust Passport card

### Suggested Hero Copy

**Headline**

```text
Verify startups faster.
Connect them smarter.
```

**Subheadline**

```text
TrustPass AI turns manual startup verification into reusable AI-generated Trust Passports for accelerators, governments, universities, and innovation ecosystems.
```

**Primary CTA**

```text
Request Demo
```

**Secondary CTA**

```text
Start Startup Verification
```

### Hero Visual

A floating Trust Passport card:

```text
Startup Trust Passport

MediNova AI
HealthTech • MVP • Malaysia

Identity Confidence: 82%
Eligibility Score: 86%
Readiness Score: 78%
Status: Conditionally Verified
```

### UI Notes

- Use trust badges like “AI-assisted verification”, “Human-reviewed”, “Reusable passport”.
- Add soft AI glow around the Trust Passport visual.
- Avoid too many dashboard charts in hero.

---

## Section 2: Problem

### Headline

```text
Innovation ecosystems are growing.
Verification is still manual.
```

### Content Cards

| Card | Description |
|---|---|
| Manual Review | Admins read every application, pitch deck, and document manually |
| Repeated Checks | Startups repeat the same verification for every programme |
| Inconsistent Decisions | Different admins evaluate applications differently |
| Weak Matching | Poor verification leads to poor mentor and partner matching |

---

## Section 3: Solution

### Headline

```text
A reusable trust layer for startup ecosystems.
```

### Explanation

```text
TrustPass AI analyses startup applications, documents, eligibility criteria, and readiness signals to generate a reusable Startup Trust Passport.
```

### Visual Flow

```text
Startup Applies → AI Verification → Trust Passport → Ecosystem Linkages
```

---

## Section 4: How It Works

### Four-Step Flow

| Step | Title | Description |
|---|---|---|
| 1 | Intake | Startup submits profile and documents |
| 2 | Verify | AI checks eligibility, readiness, gaps, and risks |
| 3 | Passport | System creates a reusable Trust Passport |
| 4 | Connect | Platform recommends programmes, mentors, and partners |

---

## Section 5: Trust Passport Preview

### Main Visual

A large sample passport with tabs:

- Overview
- Eligibility
- Readiness
- Risk Flags
- Missing Evidence
- Recommended Linkages

### Key UI Components

- Score circles
- Status badge
- AI explanation card
- Missing evidence checklist
- Recommended next action

---

## Section 6: Use Cases

### Cards

| Use Case | Description |
|---|---|
| Accelerators | Verify startup cohorts faster |
| Government Agencies | Scale ecosystem programmes across regions |
| Universities | Assess research and student startups |
| Corporate Innovation Teams | Identify startups ready for pilots |
| Ecosystem Platforms | Reuse verification intelligence across initiatives |

---

## Section 7: Responsible AI

### Headline

```text
AI recommends. Humans decide.
```

### Points

- Human approval before final decisions
- Explainable AI reasoning
- Risk flags are review signals, not automatic rejection
- Missing evidence can be submitted by startups
- Audit trail for every verification

---

## Section 8: Final CTA

### Copy

```text
Build a trusted innovation ecosystem.
Start with better verification.
```

### Buttons

- Request Demo
- Start Verification

---

## 5.2 Product Page

### Purpose

Explain the product features in more detail.

### Recommended Sections

1. Product Overview
2. Startup Trust Passport
3. AI Verification Agents
4. Eligibility & Readiness Scoring
5. Missing Evidence Detection
6. Risk & Consistency Checks
7. Ecosystem Linkage Recommendations
8. Human Review Workflow
9. Learning Memory

### Product Page UI

Use alternating text + product screenshot sections.

### Feature Card Example

```text
AI Eligibility Agent

Automatically compares startup applications against programme criteria and generates an eligibility score with clear reasoning.
```

---

## 5.3 How It Works Page

### Purpose

Show the complete workflow visually.

### Page Flow

```text
1. Startup submits application
2. AI reads documents
3. AI checks eligibility
4. AI scores readiness
5. AI flags missing evidence
6. Admin reviews decision
7. Trust Passport is approved
8. Linkages are recommended
```

### Suggested UI Element

Use a vertical timeline with icons.

---

## 5.4 Use Cases Page

### Purpose

Show different buyers how the platform applies to them.

### Use Case Blocks

## Accelerator

```text
Challenge:
Too many applications, limited admin time.

TrustPass AI helps:
Automatically verify startup readiness and route each startup to the right support path.
```

## Government Agency

```text
Challenge:
Need to scale programmes across regions and maintain consistent verification.

TrustPass AI helps:
Create reusable startup trust records that can support multiple programmes.
```

## Corporate Innovation Team

```text
Challenge:
Difficult to identify which startups are ready for pilots.

TrustPass AI helps:
Score partnership readiness and flag missing proof before corporate engagement.
```

## University Innovation Hub

```text
Challenge:
Student and research startups need structured readiness assessment.

TrustPass AI helps:
Evaluate business, market, technical, and commercialisation readiness.
```

---

## 5.5 Pricing Page

### Purpose

Optional for hackathon, but useful for showing business model.

### Pricing Tiers

| Plan | Target | Features |
|---|---|---|
| Starter | Small accelerator | 1 programme, limited startup verifications |
| Growth | Multi-cohort programme | Multiple programmes, AI verification, reporting |
| Enterprise | Government / regional ecosystem | Custom rules, API, SSO, audit logs, advanced analytics |

### Pricing UI Notes

- Use “Contact Sales” for enterprise.
- Avoid putting exact prices for hackathon demo unless required.
- Highlight scalable SaaS model.

---

## 5.6 Contact / Request Demo Page

### Fields

- Name
- Organisation
- Email
- Role
- Organisation type
- Number of startups reviewed per year
- Message

### CTA

```text
Request Product Demo
```

---

# 6. Authentication Pages

## 6.1 Login Page

### Purpose

Allow users to sign in based on role.

### Layout

- Left panel: product branding and short trust statement
- Right panel: login form

### Login Form Fields

- Email
- Password
- Remember me
- Forgot password

### Buttons

- Sign In
- Continue with Google
- Create Account

### Suggested Copy

```text
Welcome back to TrustPass AI.
Continue verifying and connecting your ecosystem.
```

---

## 6.2 Sign Up Page

### Purpose

Create a new user account.

### Fields

- Full name
- Email
- Password
- Confirm password
- Organisation name
- Role selection

### Role Options

- Startup Founder
- Programme Administrator
- Mentor / Partner
- Ecosystem Owner

### CTA

```text
Create Account
```

---

## 6.3 Role Selection Page

### Purpose

Route users into the correct onboarding flow.

### UI

Cards for each role:

| Role | Description |
|---|---|
| Startup Founder | Submit your startup for verification |
| Programme Admin | Review and verify startup applications |
| Mentor / Partner | View startup linkages and engagements |
| Ecosystem Owner | Manage programmes, rules, and analytics |

---

## 6.4 Forgot Password Page

### Fields

- Email

### CTA

```text
Send Reset Link
```

---

## 6.5 Email Verification Page

### UI Message

```text
Check your inbox.
We sent a verification link to your email.
```

### Actions

- Resend email
- Change email
- Back to login

---

# 7. Startup Portal Pages

## 7.1 Startup Dashboard

### Purpose

Show the startup their application and verification status.

### Main Components

| Component | Description |
|---|---|
| Application Status Card | Current status of verification |
| Trust Passport Summary | Scores and current status |
| Missing Evidence Card | Documents or information needed |
| Recommended Next Step | What startup should do next |
| Messages | Requests from admin |
| Timeline | Application progress |

### Example Dashboard State

```text
Status: Conditionally Verified

Your startup is eligible for the HealthTech programme, but we need additional evidence before final approval.

Missing:
- Pilot customer evidence
- Data privacy explanation
```

---

## 7.2 Startup Profile Creation Page

### Purpose

Collect startup information.

### Form Sections

## Company Details

- Company name
- Website
- Country
- City
- Sector
- Startup stage
- Company registration number
- Year founded

## Founder Details

- Founder name
- Email
- LinkedIn
- Role
- Team size

## Product Details

- Product description
- Problem solved
- Target customers
- Current product stage
- Demo link
- Technology used

## Business Details

- Business model
- Revenue status
- Funding raised
- Customer traction
- Key metrics

## Support Needed

Checklist:

- Mentorship
- Funding
- Market access
- Pilot customers
- Legal/compliance
- Technical support
- Cloud credits
- Government grants
- Investor readiness

### CTA

```text
Save and Continue
```

---

## 7.3 Document Upload Page

### Purpose

Upload verification evidence.

### Supported Documents

- Pitch deck
- Company registration
- Founder profile
- Demo video
- Product screenshots
- Customer proof
- Revenue proof
- Compliance document
- Technical architecture
- Financial projection

### UI Components

- Drag-and-drop upload area
- Document type dropdown
- Upload status
- AI reading status
- Missing document hints

### AI Status Labels

```text
Uploaded
Reading document
Extracting key information
Verification-ready
Needs clearer file
```

---

## 7.4 Application Status Page

### Purpose

Show where the startup is in the verification process.

### Timeline

```text
Application Submitted
      ↓
Documents Uploaded
      ↓
AI Verification Started
      ↓
Admin Review
      ↓
Conditionally Verified
      ↓
Final Decision
```

### Status Examples

| Status | Meaning |
|---|---|
| Draft | Startup has not submitted yet |
| Submitted | Application received |
| AI Review | AI verification running |
| Admin Review | Waiting for human review |
| Needs Evidence | More information required |
| Verified | Approved for linkage |
| Redirected | Better suited for another programme |
| Not Eligible | Does not match criteria |

---

## 7.5 Startup Trust Passport View

### Purpose

Let the startup view a controlled version of their passport.

### Startup Should See

- Startup summary
- Verification status
- Overall score
- Readiness breakdown
- Missing evidence
- Recommended next action
- Approved programme fit
- Linkage status

### Startup Should Not See

- Internal admin notes
- Sensitive risk scoring details
- Other startups' benchmarks
- Internal AI prompts
- Private mentor rankings

---

## 7.6 Missing Evidence Page

### Purpose

Allow startup to respond to requests.

### UI Components

- Evidence request cards
- Reason for request
- Upload button
- Comment field
- Deadline
- Status

### Example Card

```text
Missing Evidence: Pilot Customer Proof

Why we need this:
Your pitch deck mentions hospital pilot discussions, but no supporting document was uploaded.

Action:
Upload LOI, email confirmation, pilot proposal, or meeting proof.
```

---

## 7.7 Startup Messages Page

### Purpose

Communication between startup and programme admin.

### Features

- Admin requests
- Startup replies
- Evidence clarification
- Notification history
- System messages

---

## 7.8 Startup Settings Page

### Sections

- Profile
- Organisation details
- Notification preferences
- Password
- Connected accounts
- Data consent

---

# 8. Admin Portal Pages

## 8.1 Admin Dashboard

### Purpose

Give admins a command center for verification operations.

### Key Metrics

| Metric | Example |
|---|---:|
| New Applications | 48 |
| Awaiting AI Verification | 12 |
| Needs Admin Review | 19 |
| Conditionally Verified | 22 |
| Missing Evidence Requests | 15 |
| Ready for Linkage | 31 |

### Main Widgets

- Verification funnel
- Risk distribution
- Programme fit summary
- Recent applications
- Priority review queue
- AI recommendations needing approval

### Dashboard Layout

```text
Top Metrics
Verification Funnel
Priority Queue
Programme Fit Breakdown
Recent AI Flags
```

---

## 8.2 Application Inbox

### Purpose

List all incoming startup applications.

### Table Columns

- Startup name
- Sector
- Stage
- Country
- Programme applied
- Eligibility score
- Risk level
- Status
- Submitted date
- Assigned reviewer

### Filters

- Programme
- Status
- Sector
- Country
- Risk level
- Score range
- Missing evidence
- Assigned reviewer

### Actions

- Open application
- Run AI verification
- Assign reviewer
- Request evidence
- Mark priority

---

## 8.3 Startup Application Detail Page

### Purpose

Review raw startup application details.

### Tabs

- Overview
- Founder
- Product
- Business
- Documents
- AI Summary
- Activity

### Main UI Areas

## Left Panel

Startup information.

## Right Panel

AI quick summary:

```text
AI Summary:
MediNova AI is an MVP-stage HealthTech startup seeking hospital pilots and compliance guidance. The startup appears aligned with the HealthTech Pilot Readiness programme but lacks evidence for pilot traction.
```

### Admin Actions

- Run verification
- Request evidence
- Add note
- Reject
- Move to review
- Generate Trust Passport

---

## 8.4 AI Verification Workspace

### Purpose

This is the most important admin screen.

It should show how AI verifies the startup step by step.

### Layout

```text
Startup Summary Panel
AI Verification Steps
Score Cards
Risk Flags
Missing Evidence
Decision Recommendation
Admin Decision Panel
```

### Verification Stepper

```text
1. Reading application
2. Analysing pitch deck
3. Checking eligibility
4. Scoring readiness
5. Detecting missing evidence
6. Checking consistency
7. Recommending decision
```

### Score Cards

| Score | Meaning |
|---|---|
| Identity Confidence | How reliable the startup profile appears |
| Eligibility Score | Fit with programme criteria |
| Readiness Score | Readiness for support or linkage |
| Evidence Completeness | How complete the supporting proof is |
| Risk Level | Overall risk signal |

### Decision Recommendation

```text
Recommended Decision:
Conditionally Verified

Reason:
The startup fits the programme scope and has an MVP. However, pilot evidence and compliance documentation are missing.
```

### Admin Decision Buttons

- Approve as Verified
- Mark Conditionally Verified
- Request Evidence
- Redirect to Another Programme
- Not Eligible
- Escalate for Manual Review

---

## 8.5 Trust Passport Detail Page

### Purpose

Show the full verified profile.

### Page Structure

## Header

```text
MediNova AI
HealthTech • MVP • Malaysia
Status: Conditionally Verified
```

## Score Overview

- Identity Confidence
- Eligibility Score
- Readiness Score
- Risk Level
- Evidence Completeness

## Tabs

1. Overview
2. Eligibility
3. Readiness
4. Risk Flags
5. Missing Evidence
6. Linkage Recommendations
7. Decision History
8. Notes

### Overview Tab

Includes:

- Startup summary
- Key claims
- AI explanation
- Recommended next step
- Verification status

### Eligibility Tab

Shows criteria checklist:

| Criteria | Status | Reason |
|---|---|---|
| Sector fit | Pass | HealthTech matches programme |
| Geography | Pass | Malaysia-based |
| Stage | Pass | MVP available |
| Evidence | Partial | Pilot proof missing |

### Readiness Tab

Radar chart or bar chart:

- Business readiness
- Technical readiness
- Market readiness
- Funding readiness
- Partnership readiness
- Compliance readiness

### Risk Flags Tab

Shows:

- Risk severity
- Description
- Evidence source
- Recommended admin action

### Missing Evidence Tab

Shows:

- Required item
- Why needed
- Request status
- Startup response
- Uploaded file

### Linkage Recommendations Tab

Shows:

- Recommended mentors
- Recommended partners
- Recommended programmes
- Recommended service providers
- Explanation for each recommendation

### Decision History Tab

Audit trail:

```text
10:15 AM — AI verification completed
10:18 AM — Admin marked conditionally verified
10:20 AM — Evidence request sent
11:05 AM — Startup uploaded document
```

---

## 8.6 Review Queue Page

### Purpose

Help admins prioritize applications.

### Queue Categories

| Queue | Meaning |
|---|---|
| High Confidence Approvals | Easy approvals |
| Needs Evidence | Missing proof |
| High Risk | Requires careful review |
| Redirect Candidates | Better fit elsewhere |
| Ready for Linkage | Verified and ready to connect |

### Priority Logic

Sort by:

- Submission time
- Programme deadline
- Risk level
- Missing evidence count
- Eligibility score
- Admin assignment

---

## 8.7 Linkage Recommendations Page

### Purpose

Connect verified startups to ecosystem actors.

### Layout

```text
Startup Trust Passport Summary
Recommended Linkages
AI Explanation
Admin Approval
Activation Pack
```

### Recommended Linkage Card

```text
Recommended Linkage:
Compliance Mentor

Why:
The startup handles healthcare data and has incomplete compliance documentation.

Suggested Outcome:
Review privacy and regulatory readiness before pilot engagement.

Confidence:
88%
```

### Linkage Types

- Mentor
- Programme
- Partner
- Service provider
- Grant
- Investor-readiness coach
- Corporate pilot partner
- Technical advisor

### Actions

- Approve linkage
- Replace actor
- Generate intro message
- Create engagement plan
- Send invite
- Save for later

---

## 8.8 Programme Assignment Page

### Purpose

Assign verified startups to suitable programmes.

### UI Components

- Startup readiness summary
- Programme cards
- Fit score
- Reasoning
- Capacity indicator
- Admin approval button

### Example Programme Card

```text
HealthTech Pilot Readiness Sprint
Fit Score: 91%
Capacity: 8 / 15

Reason:
Startup is HealthTech, MVP-stage, and seeking pilot customers.
```

---

## 8.9 Actor Registry Page

### Purpose

Manage mentors, partners, service providers, and ecosystem actors.

### Actor Types

- Mentor
- Partner
- Service Provider
- Investor
- Programme Admin
- Corporate Pilot Partner
- University Lab
- Government Agency

### Actor Profile Fields

- Name
- Organisation
- Type
- Sector expertise
- Geography
- Availability
- Past engagements
- Rating
- Preferred startup stage
- Support areas

### Actor Match Tags

- HealthTech
- FinTech
- AI
- SaaS
- Fundraising
- Compliance
- Market Access
- Product Strategy
- Enterprise Sales

---

## 8.10 Programme Management Page

### Purpose

Create and manage programmes.

### Programme Fields

- Programme name
- Description
- Target sector
- Target geography
- Startup stage
- Duration
- Capacity
- Eligibility criteria
- Required documents
- Scoring weights
- Available mentors/partners
- Application deadline

### Programme Criteria Builder

Admins can define rules:

```text
Sector must be: HealthTech, AI, MedTech
Stage must be: MVP or later
Country must be: Malaysia
Required documents: Pitch deck, founder profile, product demo
```

---

## 8.11 Reports & Analytics Page

### Purpose

Show ecosystem insights.

### Metrics

- Total applications
- Verified startups
- Conditional verifications
- Rejection/redirect rate
- Average verification time
- Missing evidence trends
- Most common sectors
- Programme fit distribution
- Mentor linkage success rate
- Partner engagement outcomes

### Charts

- Verification funnel
- Applications by sector
- Risk level distribution
- Readiness score distribution
- Programme assignment chart
- Missing evidence heatmap

---

## 8.12 Admin Settings Page

### Sections

- Organisation profile
- User management
- Notification settings
- Review workflow
- AI verification preferences
- Data retention
- Integrations
- Security

---

# 9. Mentor / Partner Portal Pages

## 9.1 Partner Dashboard

### Purpose

Show assigned startup engagements.

### Widgets

- New linkage requests
- Upcoming meetings
- Startups assigned
- Feedback pending
- Impact summary

---

## 9.2 Linkage Request Page

### Purpose

Allow mentor/partner to accept or decline a recommended linkage.

### Page Content

- Startup summary
- Why this linkage was recommended
- Expected outcome
- Proposed engagement type
- Suggested agenda
- Time commitment

### Actions

- Accept
- Decline
- Request more information
- Suggest another mentor/partner

---

## 9.3 Startup Passport Summary Page

### Purpose

Show mentor/partner a limited passport view.

### Visible Information

- Startup summary
- Sector
- Stage
- Support needed
- Readiness summary
- Recommended engagement focus
- Missing evidence relevant to mentor role

### Hidden Information

- Internal admin notes
- Private risk scoring
- Sensitive founder data
- Full document repository

---

## 9.4 Engagement Plan Page

### Purpose

Give mentor/partner a clear plan.

### Example Plan

```text
Engagement Goal:
Help MediNova AI prepare for hospital pilot readiness.

Suggested Agenda:
1. Review current pilot target list
2. Discuss healthcare data handling
3. Identify compliance gaps
4. Define pilot preparation checklist

Expected Outcome:
Startup leaves with a clear compliance and pilot-readiness action plan.
```

---

## 9.5 Feedback Form Page

### Purpose

Capture post-engagement outcome data.

### Fields

- Did the engagement happen?
- Was the startup prepared?
- Was the match relevant?
- Outcome achieved
- Recommended next step
- Rating
- Notes

---

# 10. Super Admin Pages

## 10.1 Organisation Dashboard

### Purpose

High-level ecosystem overview.

### Metrics

- Total programmes
- Total startups verified
- Total ecosystem actors
- Active linkages
- Average verification time
- Programme success indicators

---

## 10.2 Eligibility Rules Builder

### Purpose

Allow ecosystem owners to configure verification criteria.

### Rule Types

- Required field
- Required document
- Sector condition
- Country condition
- Startup stage condition
- Minimum readiness score
- Manual review trigger
- Risk threshold

### Example Rule

```text
If sector = HealthTech
Then require:
- Data privacy explanation
- Compliance readiness check
- Pilot evidence if claiming clinical traction
```

---

## 10.3 AI Policy Settings

### Purpose

Configure AI behaviour.

### Settings

- AI decision confidence threshold
- Auto-flag high-risk applications
- Require human approval for all decisions
- Enable/disable public data checks
- Enable/disable sensitive risk categories
- Custom prompt templates
- Explanation depth

---

## 10.4 User Management Page

### Features

- Invite user
- Assign role
- Disable user
- Change permissions
- View user activity

### Roles

- Startup Founder
- Reviewer
- Programme Admin
- Mentor
- Partner
- Super Admin

---

## 10.5 Audit Logs Page

### Purpose

Track all important actions.

### Logged Actions

- Application submitted
- AI verification run
- Score generated
- Decision changed
- Evidence requested
- Evidence uploaded
- Linkage approved
- Admin override
- User login
- Report export

---

# 11. Core UI Components

## 11.1 Trust Passport Card

### Used In

- Landing page
- Startup dashboard
- Admin dashboard
- Passport detail page

### Fields

- Startup name
- Sector
- Stage
- Country
- Verification status
- Identity confidence
- Eligibility score
- Readiness score
- Risk level

---

## 11.2 Status Badge

### Badge Types

| Badge | Color |
|---|---|
| Verified | Green |
| Conditionally Verified | Amber |
| Needs Review | Orange |
| Not Eligible | Red |
| Redirect | Blue |
| Draft | Grey |
| AI Review | Purple / Blue |

---

## 11.3 Score Circle

### Used For

- Identity confidence
- Eligibility score
- Readiness score
- Evidence completeness

### Score Ranges

| Score | Meaning |
|---|---|
| 80–100 | Strong |
| 60–79 | Moderate |
| 40–59 | Needs review |
| 0–39 | Weak |

---

## 11.4 Missing Evidence Card

### Fields

- Evidence title
- Reason
- Required / optional
- Status
- Upload button
- Deadline

---

## 11.5 AI Explanation Card

### Purpose

Make AI reasoning transparent.

### Format

```text
AI Explanation

The startup is conditionally verified because it matches the HealthTech programme and has an MVP. However, pilot evidence and data privacy documentation are missing, so it should be reviewed before partner introduction.
```

---

## 11.6 Risk Flag Card

### Fields

- Severity
- Risk title
- Description
- Source
- Recommended action

---

## 11.7 Linkage Recommendation Card

### Fields

- Actor type
- Recommended actor or actor category
- Confidence score
- Reason
- Expected outcome
- Action button

---

## 11.8 Verification Timeline

### Steps

- Submitted
- AI Review
- Admin Review
- Evidence Requested
- Verified
- Linkage Recommended
- Linkage Activated

---

# 12. Main User Journey — Startup Founder

```text
Visit Landing Page
      ↓
Click Start Verification
      ↓
Create Account
      ↓
Select Role: Startup Founder
      ↓
Create Startup Profile
      ↓
Upload Documents
      ↓
Submit Application
      ↓
View AI Verification Status
      ↓
Respond to Missing Evidence Request
      ↓
View Trust Passport
      ↓
Receive Programme / Mentor / Partner Linkage
```

---

# 13. Main User Journey — Programme Admin

```text
Login
      ↓
Open Admin Dashboard
      ↓
View Application Inbox
      ↓
Open Startup Application
      ↓
Run AI Verification
      ↓
Review Trust Passport
      ↓
Approve / Request Evidence / Redirect
      ↓
View Recommended Linkages
      ↓
Approve Mentor or Partner Connection
      ↓
Track Engagement Outcome
```

---

# 14. Main User Journey — Mentor / Partner

```text
Login
      ↓
View Linkage Request
      ↓
Read Startup Passport Summary
      ↓
Accept Engagement
      ↓
View Suggested Agenda
      ↓
Complete Engagement
      ↓
Submit Feedback
```

---

# 15. Page-by-Page MVP Build Priority

For hackathon, build only what is needed to tell a strong story.

## Must Build

| Page | Reason |
|---|---|
| Landing Page | Shows product concept |
| Login Page | Makes prototype feel complete |
| Startup Intake Page | Needed for demo |
| Document Upload Page | Shows verification input |
| AI Verification Workspace | Main innovation screen |
| Trust Passport Page | Main product output |
| Linkage Recommendation Page | Connects to problem statement |
| Admin Dashboard | Shows business workflow |

## Should Build

| Page | Reason |
|---|---|
| Startup Dashboard | Helps founder journey |
| Application Inbox | Helps admin journey |
| Missing Evidence Page | Shows verification loop |
| Programme Management Page | Shows configurability |

## Optional

| Page | Reason |
|---|---|
| Pricing Page | Business model |
| Reports Page | Impact story |
| Mentor Portal | Extended ecosystem demo |
| Audit Logs | Governance story |

---

# 16. Suggested Hackathon Demo Flow

## Demo Title

```text
From Startup Application to Trusted Ecosystem Linkage in 3 Minutes
```

## Demo Steps

### Step 1: Landing Page

Show the concept:

```text
Verify once. Connect everywhere.
```

### Step 2: Startup Intake

Enter sample startup:

```text
MediNova AI
HealthTech startup seeking hospital pilots, compliance guidance, and funding readiness.
```

### Step 3: Upload Document

Upload or simulate pitch deck analysis.

### Step 4: AI Verification Workspace

Show AI processing:

- Reading application
- Checking eligibility
- Scoring readiness
- Finding missing evidence
- Detecting risk flags

### Step 5: Trust Passport Generated

Show:

```text
Identity Confidence: 82%
Eligibility Score: 86%
Readiness Score: 78%
Status: Conditionally Verified
```

### Step 6: Linkage Recommendation

Show:

```text
Recommended Linkages:
- Compliance Mentor
- Hospital Pilot Partner
- Funding Readiness Advisor
```

### Step 7: Admin Approves

Show admin approving the conditional verification and sending evidence request.

---

# 17. Sample Screen Copy

## Landing Hero

```text
Verify startups faster.
Connect them smarter.

TrustPass AI creates reusable startup Trust Passports so ecosystem owners can verify once and connect startups across programmes, mentors, partners, and regions.
```

## AI Verification Workspace

```text
AI Verification in Progress

TrustPass AI is analysing startup profile, pitch deck, programme criteria, readiness signals, and missing evidence.
```

## Trust Passport

```text
Conditionally Verified

This startup is eligible for the selected programme but requires additional evidence before partner activation.
```

## Missing Evidence

```text
Pilot customer proof is required because the startup claims hospital pilot traction but no supporting document was uploaded.
```

## Linkage Recommendation

```text
Recommended: Healthcare Compliance Mentor

Reason:
The startup operates in HealthTech and handles sensitive healthcare workflows. Compliance readiness should be reviewed before hospital pilot introduction.
```

---

# 18. UI Data States

## Empty State

Used when no applications exist.

```text
No startup applications yet.
Invite startups or open your programme application link.
```

## Loading State

```text
Analysing documents...
Generating Trust Passport...
Checking eligibility...
```

## Success State

```text
Trust Passport generated successfully.
```

## Warning State

```text
Additional evidence required before final verification.
```

## Error State

```text
We could not read this document. Please upload a clearer file.
```

---

# 19. Accessibility Considerations

- Use clear text labels, not color alone.
- All score badges should include text.
- Ensure contrast between text and background.
- Forms should have clear validation messages.
- Buttons should be keyboard accessible.
- Loading states should include text.
- Avoid overly small fonts in dashboard tables.

---

# 20. Mobile UI Considerations

The hackathon prototype may be desktop-first, but basic mobile responsiveness is useful.

## Mobile Priority Pages

- Landing page
- Login
- Startup intake
- Document upload
- Startup dashboard
- Trust Passport summary

## Mobile Layout

- Cards stack vertically
- Tables become list cards
- Score circles become compact score rows
- Sidebar becomes bottom nav or hamburger menu

---

# 21. Recommended Navigation Structure

## Public Website Nav

```text
Product | How It Works | Use Cases | Pricing | Request Demo | Login
```

## Startup Portal Nav

```text
Dashboard | Profile | Documents | Trust Passport | Messages | Settings
```

## Admin Portal Nav

```text
Dashboard | Applications | Verification | Trust Passports | Linkages | Programmes | Actors | Reports | Settings
```

## Mentor / Partner Nav

```text
Dashboard | Requests | Startups | Engagements | Feedback | Settings
```

---

# 22. Suggested UI Tech Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide icons
- Recharts for analytics

## Backend

- FastAPI or Node.js API
- Firebase / Firestore
- Google Cloud Storage
- Gemini API
- Cloud Run

## Optional

- Supabase for fast auth/database
- Vercel for frontend deployment
- Firebase Auth for Google login

---

# 23. Suggested Component List for Development

## Layout Components

- PublicNavbar
- AppSidebar
- AppTopbar
- PageHeader
- SectionContainer
- AuthLayout
- DashboardLayout

## Product Components

- TrustPassportCard
- VerificationScoreCard
- StatusBadge
- ReadinessBreakdown
- RiskFlagCard
- MissingEvidenceCard
- AIExplanationCard
- LinkageRecommendationCard
- VerificationTimeline
- ProgrammeFitCard

## Form Components

- StartupProfileForm
- FounderDetailsForm
- ProductDetailsForm
- BusinessDetailsForm
- SupportNeedsChecklist
- DocumentUploader
- EvidenceRequestForm

## Admin Components

- ApplicationTable
- ReviewQueue
- VerificationStepper
- AdminDecisionPanel
- ProgrammeCriteriaChecklist
- ActorRegistryTable
- AuditLogTimeline

---

# 24. Prototype Data

Use this sample startup for the demo.

## Startup

```json
{
  "name": "MediNova AI",
  "sector": "HealthTech",
  "country": "Malaysia",
  "stage": "MVP",
  "description": "AI-powered triage assistant for clinics and hospitals.",
  "support_needed": [
    "Hospital pilots",
    "Compliance guidance",
    "Funding readiness"
  ]
}
```

## Trust Passport

```json
{
  "identity_confidence": 82,
  "eligibility_score": 86,
  "readiness_score": 78,
  "evidence_completeness": 64,
  "risk_level": "Medium",
  "status": "Conditionally Verified",
  "missing_evidence": [
    "Pilot customer proof",
    "Data privacy explanation",
    "Investor readiness financial slide"
  ],
  "recommended_linkages": [
    "Healthcare Compliance Mentor",
    "Hospital Pilot Partner",
    "Funding Readiness Advisor"
  ]
}
```

---

# 25. Final UI Positioning

TrustPass AI should be visually positioned as:

> **A startup verification and trust intelligence layer for innovation ecosystems.**

The UI should make the judge understand within seconds:

```text
Startup applies
AI verifies
Trust Passport is generated
Admin reviews
Startup gets connected to the right ecosystem actors
```

The strongest screen is the **Trust Passport**.

The strongest workflow is:

```text
Manual verification → AI Trust Passport → Smart ecosystem linkage
```

The strongest message is:

```text
Verify once. Connect everywhere.
```
