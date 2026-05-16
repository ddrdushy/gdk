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

---

# 26. Real Passport Concept — Startup & Mentor Verification Passport

## 26.1 Concept Overview

TrustPass AI should not only generate a digital verification record. It should issue a **real passport-style digital credential** to verified startups, mentors, and ecosystem actors.

This makes the product more memorable, visual, and different from a normal management application.

The idea:

> **When a startup or mentor is verified, TrustPass AI issues them an official ecosystem passport with verification stamps, badges, and programme travel history.**

This passport becomes a visual proof of trust inside the ecosystem.

---

## 26.2 Why This Makes the Product Stronger

The passport concept creates a clear emotional and visual identity.

Instead of saying:

```text
Startup status: Verified
```

The product says:

```text
Startup Passport Issued
Verification Stamp: Approved
Programme Entry: HealthTech Pilot Readiness Sprint
```

This gives the system a more unique experience.

It also supports the hackathon theme because ecosystem relationships become visible, reusable, and portable.

---

## 26.3 Passport Types

TrustPass AI can issue different passports based on user role.

| Passport Type | Issued To | Purpose |
|---|---|---|
| Startup Passport | Startups / companies | Proves startup verification, readiness, and programme eligibility |
| Mentor Passport | Mentors | Proves mentor credibility, expertise, and approved ecosystem participation |
| Partner Passport | Partners / service providers | Proves partner verification and support capability |
| Programme Passport | Programmes / initiatives | Shows programme criteria, cohort history, and verified participants |

For the MVP, focus on:

1. **Startup Passport**
2. **Mentor Passport**

---

# 27. Startup Passport UI

## 27.1 Startup Passport Purpose

The Startup Passport is issued after AI verification and admin approval.

It shows:

- Who the startup is
- Verification status
- Programme eligibility
- Readiness level
- Stamps earned
- Missing or pending stamps
- Ecosystem journeys completed
- Recommended next destinations

## 27.2 Startup Passport Visual Design

The UI should look like a modern digital passport.

### Layout Direction

- Passport booklet style
- Two-page open passport layout
- Left page: identity profile
- Right page: verification stamps and badges
- Dark navy cover version for landing page and dashboard
- Cream/off-white inner pages for passport detail view
- Subtle security pattern background
- Watermark-style TrustPass emblem
- QR code or verification ID
- Digital stamp marks

### Visual Elements

| Element | Description |
|---|---|
| Passport Cover | Premium navy booklet with TrustPass AI logo/title |
| Identity Page | Startup profile, sector, country, stage, passport ID |
| Verification Page | AI scores, status, issued date, expiry/review date |
| Stamp Pages | Programme stamps, mentor session stamps, partner linkage stamps |
| Badge Strip | Verified, AI Ready, Pilot Ready, Funding Ready, Compliance Review |
| QR Code | Used to verify authenticity |
| Seal | “Issued by TrustPass AI” digital seal |

---

## 27.3 Startup Passport Cover

### UI Copy

```text
TRUSTPASS AI
STARTUP PASSPORT

Verify once. Connect everywhere.
```

### Cover Elements

- Startup name
- Passport ID
- Issued by TrustPass AI
- Verification status badge
- QR verification icon

### Example

```text
TRUSTPASS AI
STARTUP PASSPORT

MediNova AI
Passport ID: TP-ST-2026-001
Status: Conditionally Verified
Issued: 16 May 2026
```

---

## 27.4 Startup Passport Identity Page

### Fields

| Field | Example |
|---|---|
| Startup Name | MediNova AI |
| Passport ID | TP-ST-2026-001 |
| Sector | HealthTech |
| Country | Malaysia |
| Stage | MVP |
| Founder | Aisha Rahman |
| Programme Applied | HealthTech Pilot Readiness Sprint |
| Issue Date | 16 May 2026 |
| Review Date | 16 Aug 2026 |
| Issued By | TrustPass AI |

### UI Card Example

```text
Startup Identity

Name: MediNova AI
Sector: HealthTech
Stage: MVP
Country: Malaysia
Passport ID: TP-ST-2026-001

Status:
Conditionally Verified
```

---

## 27.5 Startup Passport Verification Page

This page shows the AI verification result in a passport-like layout.

### Verification Scores

| Score | Example |
|---|---:|
| Identity Confidence | 82% |
| Eligibility Score | 86% |
| Startup Readiness | 78% |
| Evidence Completeness | 64% |
| Risk Level | Medium |

### Suggested UI

Use stamp-style score blocks:

```text
IDENTITY CHECK
82%
STAMPED: PASSED

ELIGIBILITY
86%
STAMPED: PROGRAMME FIT

READINESS
78%
STAMPED: CONDITIONALLY READY
```

---

## 27.6 Startup Passport Stamps

Stamps are the most important visual idea.

Each stamp represents a verified milestone, linkage, or achievement.

### Startup Stamp Categories

| Stamp | Meaning |
|---|---|
| Identity Verified | Company and founder details verified |
| Programme Eligible | Startup fits a programme |
| MVP Confirmed | Product has MVP evidence |
| Pitch Deck Reviewed | AI reviewed pitch deck |
| Evidence Complete | Required documents submitted |
| Compliance Review Required | Compliance check needed |
| Pilot Ready | Startup ready for pilot introductions |
| Funding Ready | Startup ready for investor-readiness support |
| Mentor Matched | Mentor linkage approved |
| Partner Matched | Partner linkage approved |
| Programme Admitted | Startup accepted into programme |
| Engagement Completed | Mentor/partner engagement completed |

### Stamp States

| State | UI Style |
|---|---|
| Earned | Solid stamp |
| Pending | Outline stamp |
| Missing Evidence | Amber stamp |
| Expired | Grey stamp |
| Rejected / Not Approved | Red crossed stamp |
| Renew Required | Dotted stamp |

---

## 27.7 Example Startup Passport Stamp Page

```text
PASSPORT STAMPS

[STAMP] Identity Verified
Issued: 16 May 2026

[STAMP] Programme Eligible
Programme: HealthTech Pilot Readiness Sprint
Issued: 16 May 2026

[STAMP] Pitch Deck Reviewed
Document: pitch_deck.pdf
Issued: 16 May 2026

[PENDING STAMP] Pilot Ready
Required: Pilot customer proof

[PENDING STAMP] Funding Ready
Required: Financial projection slide
```

---

## 27.8 Startup Passport Badge System

Badges are cleaner and more product-like than stamps, so use both:

- **Stamps** for passport visual experience
- **Badges** for dashboard summary and shareable proof

### Startup Badges

| Badge | Meaning |
|---|---|
| Verified Startup | Core identity verification completed |
| AI-Ready Startup | Startup has AI/technology readiness |
| Pilot-Ready Startup | Ready for corporate or partner pilot |
| Funding-Ready Startup | Ready for investor support |
| Compliance-Aware Startup | Compliance review completed or acknowledged |
| Market-Ready Startup | Market and customer validation present |
| Ecosystem Active | At least one approved mentor/partner linkage |

---

# 28. Mentor Passport UI

## 28.1 Mentor Passport Purpose

The Mentor Passport is issued to verified mentors.

It confirms that a mentor is approved to support startups in the ecosystem.

It shows:

- Mentor identity
- Area of expertise
- Approved sectors
- Programme participation
- Engagement history
- Feedback score
- Stamps earned
- Active linkage requests

---

## 28.2 Mentor Passport Cover

### UI Copy

```text
TRUSTPASS AI
MENTOR PASSPORT

Verified ecosystem mentor
```

### Example

```text
TRUSTPASS AI
MENTOR PASSPORT

Dr. Sarah Lim
Passport ID: TP-MN-2026-014
Status: Verified Mentor
Issued: 16 May 2026
```

---

## 28.3 Mentor Passport Identity Page

### Fields

| Field | Example |
|---|---|
| Mentor Name | Dr. Sarah Lim |
| Passport ID | TP-MN-2026-014 |
| Expertise | HealthTech, Compliance, Clinical Pilots |
| Country | Malaysia |
| Organisation | Independent Advisor |
| Preferred Startup Stage | MVP to Growth |
| Availability | 4 sessions / month |
| Verification Status | Verified |
| Issue Date | 16 May 2026 |
| Review Date | 16 Aug 2026 |

---

## 28.4 Mentor Verification Page

### Verification Areas

| Area | Example |
|---|---:|
| Identity Confidence | 94% |
| Expertise Match Confidence | 91% |
| Ecosystem Fit | 88% |
| Engagement Reliability | 85% |
| Feedback Score | 4.7 / 5 |

---

## 28.5 Mentor Passport Stamps

### Mentor Stamp Categories

| Stamp | Meaning |
|---|---|
| Identity Verified | Mentor profile verified |
| Expertise Verified | Expertise validated |
| Programme Approved | Mentor approved for programme |
| Sector Specialist | Mentor approved for specific sector |
| First Engagement Completed | First startup support session completed |
| High Impact Mentor | Strong feedback from startups |
| Repeat Mentor | Multiple completed engagements |
| Partner Referral Ready | Mentor can refer startups to partners |
| Compliance Mentor | Approved for compliance guidance |
| Funding Mentor | Approved for fundraising support |

### Example Mentor Stamp Page

```text
MENTOR STAMPS

[STAMP] Identity Verified
Issued: 16 May 2026

[STAMP] Expertise Verified
Expertise: HealthTech Compliance
Issued: 16 May 2026

[STAMP] Programme Approved
Programme: HealthTech Pilot Readiness Sprint

[STAMP] High Impact Mentor
Feedback Score: 4.7 / 5
```

---

# 29. Passport Issuance Workflow

## 29.1 Startup Passport Issuance Flow

```text
Startup Creates Profile
      ↓
Startup Uploads Evidence
      ↓
AI Verification Runs
      ↓
Admin Reviews Result
      ↓
Startup Is Verified / Conditionally Verified
      ↓
Startup Passport Is Issued
      ↓
Badges and Stamps Are Added
      ↓
Passport Can Be Shared or Used for Linkages
```

## 29.2 Mentor Passport Issuance Flow

```text
Mentor Creates Profile
      ↓
Mentor Submits Expertise and Credentials
      ↓
AI Reviews Mentor Fit
      ↓
Admin Approves Mentor
      ↓
Mentor Passport Is Issued
      ↓
Sector / Programme Stamps Are Added
      ↓
Mentor Can Receive Linkage Requests
```

---

# 30. New UI Pages to Add

## 30.1 Passport Issued Success Page

### Purpose

Celebrate the moment a startup or mentor is verified.

### Layout

- Large passport visual
- Confetti or subtle animation
- Issued stamp animation
- Passport ID
- Share / download / continue buttons

### Startup Copy

```text
Your Startup Passport has been issued.

MediNova AI is now conditionally verified and ready for ecosystem linkage recommendations.
```

### Mentor Copy

```text
Your Mentor Passport has been issued.

You are now verified to support startups across eligible programmes.
```

### Buttons

- View Passport
- Download Certificate
- Share Verification Link
- Continue to Dashboard

---

## 30.2 Digital Passport Detail Page

### Purpose

A rich passport-style interface.

### Tabs

| Tab | Purpose |
|---|---|
| Identity Page | Profile and passport ID |
| Verification Page | Scores and status |
| Stamps | Earned and pending stamps |
| Badges | Shareable badges |
| Linkages | Approved relationships |
| History | Passport events |
| Share | Public verification settings |

---

## 30.3 Passport Stamp Wall

### Purpose

Show all earned, pending, and locked stamps.

### Sections

- Earned Stamps
- Pending Stamps
- Locked Stamps
- Expired Stamps
- Recommended Next Stamps

### Example UI

```text
Earned
[Identity Verified] [Pitch Deck Reviewed] [Programme Eligible]

Pending
[Pilot Ready] [Funding Ready]

Locked
[Partner Matched] [Programme Admitted]
```

---

## 30.4 Public Verification Page

### Purpose

Allow others to verify a startup or mentor using a public link or QR code.

### URL Example

```text
trustpass.ai/verify/TP-ST-2026-001
```

### Public Page Shows

- Passport holder name
- Passport type
- Verification status
- Issue date
- Review/expiry date
- Key approved badges
- QR verification
- Issued by TrustPass AI

### Public Page Does Not Show

- Internal notes
- Detailed risk flags
- Private documents
- Sensitive scores
- Admin comments

### Public Page Copy

```text
This TrustPass AI Passport is valid and was issued to MediNova AI on 16 May 2026.
```

---

## 30.5 Passport Download / Export Page

### Purpose

Allow passport holders to export their passport.

### Export Options

- PDF passport
- PNG badge
- Verification certificate
- Shareable link
- QR code
- LinkedIn badge copy

### LinkedIn Share Copy

```text
We are proud to share that MediNova AI has received a TrustPass AI Startup Passport, recognising our verified ecosystem profile and readiness for innovation programme linkages.
```

---

# 31. Passport UI Components

## 31.1 PassportBook Component

### Purpose

Displays the open passport design.

### Variants

- Startup Passport
- Mentor Passport
- Partner Passport

### Props

```json
{
  "passportType": "Startup",
  "holderName": "MediNova AI",
  "passportId": "TP-ST-2026-001",
  "status": "Conditionally Verified",
  "issueDate": "16 May 2026",
  "reviewDate": "16 Aug 2026"
}
```

---

## 31.2 PassportCover Component

### Purpose

Displays a closed passport booklet.

### Use Cases

- Landing page hero
- Dashboard summary
- Passport issued success page

### Visual Style

- Navy cover
- Embossed TrustPass AI seal
- Gold or cyan edge accents
- Passport type label
- Subtle security pattern

---

## 31.3 PassportStamp Component

### Purpose

Displays a stamp inside the passport.

### Stamp Props

```json
{
  "title": "Identity Verified",
  "status": "earned",
  "issuedDate": "16 May 2026",
  "issuer": "TrustPass AI",
  "description": "Startup identity and basic profile verified"
}
```

### Stamp Variants

- Earned
- Pending
- Missing Evidence
- Expired
- Rejected
- Renew Required

---

## 31.4 VerificationBadge Component

### Purpose

Displays a clean digital badge.

### Badge Props

```json
{
  "title": "Verified Startup",
  "level": "Core",
  "status": "active",
  "issuedDate": "16 May 2026"
}
```

---

## 31.5 PassportQRCode Component

### Purpose

Shows QR code for verification.

### Used In

- Passport detail page
- Public verification page
- Downloadable passport
- Badge export

---

# 32. Passport Data Model

## 32.1 Passport Entity

```json
{
  "passport_id": "TP-ST-2026-001",
  "passport_type": "startup",
  "holder_id": "startup_001",
  "holder_name": "MediNova AI",
  "status": "conditionally_verified",
  "issued_by": "TrustPass AI",
  "issued_at": "2026-05-16",
  "review_at": "2026-08-16",
  "public_verification_url": "https://trustpass.ai/verify/TP-ST-2026-001",
  "qr_code_url": "https://trustpass.ai/qr/TP-ST-2026-001"
}
```

## 32.2 Stamp Entity

```json
{
  "stamp_id": "STMP-001",
  "passport_id": "TP-ST-2026-001",
  "stamp_type": "identity_verified",
  "title": "Identity Verified",
  "status": "earned",
  "issued_at": "2026-05-16",
  "issued_by": "TrustPass AI",
  "evidence_source": "startup_profile",
  "description": "Startup identity and basic profile verified"
}
```

## 32.3 Badge Entity

```json
{
  "badge_id": "BDG-001",
  "passport_id": "TP-ST-2026-001",
  "badge_name": "Verified Startup",
  "badge_level": "Core",
  "status": "active",
  "issued_at": "2026-05-16",
  "shareable": true
}
```

---

# 33. Updated MVP Pages With Passport Concept

## 33.1 Landing Page Update

Add passport as the main visual.

### Hero Visual

Instead of a normal dashboard, show:

```text
A premium digital passport booklet opening into a Trust Passport profile.
```

### Updated Hero Copy

```text
The digital passport for trusted innovation ecosystems.

Verify startups and mentors once, issue TrustPass passports, and connect them across programmes, partners, and regions.
```

---

## 33.2 Startup Dashboard Update

Add a passport card at the top.

### Example

```text
Your Startup Passport

Status: Conditionally Verified
Passport ID: TP-ST-2026-001
Stamps Earned: 3 / 8
Next Stamp: Pilot Ready
```

### Buttons

- View Passport
- Upload Evidence
- Share Passport

---

## 33.3 Mentor Dashboard Update

Add Mentor Passport summary.

### Example

```text
Your Mentor Passport

Status: Verified Mentor
Passport ID: TP-MN-2026-014
Stamps Earned: 4 / 10
Active Linkage Requests: 2
```

---

## 33.4 Admin Verification Workspace Update

After approving a startup or mentor, show:

```text
Issue Passport
```

### Admin Actions

- Issue Startup Passport
- Issue Mentor Passport
- Add stamp
- Revoke stamp
- Request renewal
- Set review date

---

## 33.5 Trust Passport Page Update

Rename this page to:

```text
Digital Passport
```

Inside it, keep all previous verification information but display it as passport pages.

---

# 34. Passport Statuses

| Status | Meaning |
|---|---|
| Draft | Passport not issued yet |
| Issued | Passport created |
| Verified | Passport holder verified |
| Conditionally Verified | Verified with pending requirements |
| Under Review | Evidence or status being reviewed |
| Suspended | Passport temporarily invalid |
| Expired | Review date has passed |
| Revoked | Passport no longer valid |

---

# 35. Passport Gamification Without Making It Childish

The passport should feel professional, not like a game.

Use:

- Stamps
- Seals
- Badges
- Review dates
- Digital verification
- Shareable credentials

Avoid:

- Cartoon rewards
- Coins
- Leaderboards
- Overly playful animations
- Random points

The tone should be:

> Official, trusted, premium, ecosystem-grade.

---

# 36. Demo Flow With Passport Concept

## Demo Title

```text
From Application to Issued Trust Passport
```

## Demo Steps

1. Startup applies.
2. AI verifies profile and documents.
3. Admin reviews AI recommendation.
4. Admin clicks **Issue Startup Passport**.
5. Passport animation appears.
6. Startup receives digital passport.
7. Passport has earned stamps:
   - Identity Verified
   - Pitch Deck Reviewed
   - Programme Eligible
8. Pending stamps show:
   - Pilot Ready
   - Funding Ready
9. System recommends mentor and partner linkages.
10. Mentor receives linkage request through their own Mentor Passport.

---

# 37. Pitch Explanation

Use this explanation during pitch:

> “We wanted to avoid building just another admin dashboard. So we turned verification into something portable and reusable — a digital passport. Startups and mentors receive TrustPass passports with verified stamps and badges. Every stamp represents trust earned inside the ecosystem: identity verified, programme eligible, pitch deck reviewed, mentor approved, pilot ready, funding ready, and more. This makes ecosystem relationships easier to trust, reuse, and scale.”

---

# 38. Updated One-Line Product Pitch

> **TrustPass AI issues digital passports for startups and mentors, using AI verification, human approval, badges, and stamps to make ecosystem trust portable across programmes, partners, and regions.**

---

# 39. Updated Tagline Options

| Tagline | Style |
|---|---|
| Verify once. Connect everywhere. | Original and strong |
| Your passport to trusted innovation ecosystems. | More brand-like |
| Trust credentials for startup ecosystems. | Enterprise tone |
| Stamp trust. Activate linkages. | More creative |
| Verified people. Trusted programmes. Smarter ecosystems. | Broader |

Recommended tagline:

```text
Verify once. Connect everywhere.
```

Secondary tagline:

```text
The digital passport for trusted innovation ecosystems.
```

---

# 40. Updated Final Positioning

TrustPass AI should now be positioned as:

> **A digital passport and AI trust verification layer for innovation ecosystems.**

The strongest UI moment should be:

```text
Passport Issued
```

The strongest visual should be:

```text
A digital passport booklet with official stamps and badges.
```

The strongest workflow should be:

```text
Apply → Verify → Issue Passport → Earn Stamps → Activate Linkages
```
