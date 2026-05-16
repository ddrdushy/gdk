# TrustPass AI — Module 5: Digital Passport & Stamp System

## 1. Module Purpose

The **Digital Passport & Stamp System** is the signature experience of TrustPass AI.

It turns verification into something visible, portable, and reusable.

Instead of only showing a status such as “Verified”, TrustPass AI issues a digital passport to startups and mentors. Each passport contains official-looking stamps and badges that represent verified trust milestones.

This module makes the product feel unique and different from normal management software.

---

## 2. Core Concept

The Digital Passport is a trusted credential issued by TrustPass AI.

It shows:

- Who the passport holder is
- What has been verified
- What stamps they have earned
- What badges they hold
- What is still pending
- Whether the passport is valid
- How others can verify it

The core message:

> **Trust should be visible, portable, and reusable across the ecosystem.**

---

## 3. Passport Types

## 3.1 Startup Passport

Issued to verified or conditionally verified startups.

It represents:

- Startup identity
- Programme eligibility
- Readiness
- Evidence status
- Linkage readiness
- Earned startup stamps

## 3.2 Mentor Passport

Issued to verified mentors.

It represents:

- Mentor identity
- Expertise
- Programme approval
- Engagement readiness
- Feedback history
- Earned mentor stamps

## 3.3 Partner Passport

Optional future version for service providers, investors, corporate partners, government agencies, or university labs.

## 3.4 Programme Passport

Optional future version for programmes or initiatives to show their criteria, participants, and outcomes.

---

## 4. Passport Lifecycle

```text
Draft
      ↓
Verification Started
      ↓
Admin Review
      ↓
Passport Issued
      ↓
Stamps Added
      ↓
Passport Shared
      ↓
Passport Renewed / Updated
      ↓
Expired / Suspended / Revoked if needed
```

---

## 5. Passport Statuses

| Status | Meaning |
|---|---|
| Draft | Passport not issued yet |
| Under Review | AI and admin review in progress |
| Issued | Passport created |
| Verified | Passport holder is fully verified |
| Conditionally Verified | Verified with pending requirements |
| Pending Evidence | More evidence required |
| Suspended | Temporarily invalid |
| Expired | Review date passed |
| Revoked | Passport no longer valid |

---

## 6. Passport Visual Experience

## 6.1 Passport Cover

The cover should look like a premium digital passport.

### Visual Style

- Deep navy cover
- Subtle security pattern
- TrustPass AI seal
- Passport type label
- Holder name
- Passport ID
- Status badge
- Premium but modern look

### Startup Passport Cover Example

```text
TRUSTPASS AI
STARTUP PASSPORT

MediNova AI
Passport ID: TP-ST-2026-001
Status: Conditionally Verified
```

### Mentor Passport Cover Example

```text
TRUSTPASS AI
MENTOR PASSPORT

Dr. Sarah Lim
Passport ID: TP-MN-2026-014
Status: Verified Mentor
```

---

## 6.2 Open Passport Layout

The passport detail page should look like an open booklet.

### Left Page

Identity information:

- Name
- Passport type
- Passport ID
- Country
- Sector or expertise
- Issue date
- Review date
- Issued by TrustPass AI

### Right Page

Verification information:

- Status
- Scores
- Earned stamps
- Key badges
- QR verification
- Public verification link

---

## 6.3 Stamp Pages

Stamps should appear as official marks inside the passport.

Each stamp should have:

- Stamp title
- Stamp status
- Issue date
- Issuer
- Short explanation
- Related evidence or event
- Expiry or review date if applicable

---

## 7. Startup Stamps

## 7.1 Core Startup Stamps

| Stamp | Meaning |
|---|---|
| Identity Verified | Startup identity and basic profile verified |
| Founder Profile Verified | Founder details reviewed |
| Pitch Deck Reviewed | Pitch deck processed by AI and admin |
| Programme Eligible | Startup fits selected programme |
| MVP Confirmed | Startup has product or prototype evidence |
| Evidence Complete | Required documents submitted |
| Compliance Review Required | Startup operates in sensitive area requiring compliance review |
| Compliance Reviewed | Compliance evidence reviewed |
| Pilot Ready | Startup ready for pilot introductions |
| Funding Ready | Startup ready for investor-readiness support |
| Mentor Matched | Mentor linkage approved |
| Partner Matched | Partner linkage approved |
| Programme Admitted | Startup accepted into programme |
| Engagement Completed | Mentor or partner engagement completed |

---

## 7.2 Startup Stamp States

| State | Meaning |
|---|---|
| Earned | Stamp has been awarded |
| Pending | Requirements not yet completed |
| Locked | Not available until previous steps are complete |
| Missing Evidence | Evidence required |
| Under Review | Admin is reviewing |
| Expired | Stamp needs renewal |
| Revoked | Stamp removed due to issue |

---

## 7.3 Startup Stamp Example

```text
Stamp: Programme Eligible
Status: Earned
Issued: 16 May 2026
Issuer: TrustPass AI
Reason: Startup matches HealthTech programme criteria.
```

---

## 8. Mentor Stamps

## 8.1 Core Mentor Stamps

| Stamp | Meaning |
|---|---|
| Identity Verified | Mentor identity verified |
| Expertise Verified | Mentor expertise validated |
| Programme Approved | Mentor approved for a programme |
| Sector Specialist | Mentor approved for a specific sector |
| Startup Stage Specialist | Mentor suited for specific startup stage |
| First Engagement Completed | First startup session completed |
| High Impact Mentor | Strong feedback from startups |
| Repeat Mentor | Multiple engagements completed |
| Funding Mentor | Approved for fundraising guidance |
| Compliance Mentor | Approved for compliance support |
| Market Access Mentor | Approved for GTM or market entry support |
| Partner Referral Ready | Mentor can refer startups to partners |

---

## 8.2 Mentor Stamp Example

```text
Stamp: Expertise Verified
Status: Earned
Issued: 16 May 2026
Expertise: HealthTech Compliance
Reason: Mentor profile and credentials support claimed expertise.
```

---

## 9. Badge System

Badges are cleaner, shareable versions of passport achievements.

Stamps live inside the passport. Badges can be shown on dashboards, public profiles, and share cards.

## 9.1 Startup Badges

| Badge | Meaning |
|---|---|
| Verified Startup | Core verification complete |
| Pilot Ready | Ready for pilot engagement |
| Funding Ready | Ready for investor-readiness support |
| AI Ready | Technology or AI readiness confirmed |
| Compliance Aware | Compliance requirements acknowledged or reviewed |
| Market Ready | Customer or market proof available |
| Ecosystem Active | Active linkage exists |

## 9.2 Mentor Badges

| Badge | Meaning |
|---|---|
| Verified Mentor | Core mentor verification complete |
| Sector Expert | Expertise verified in a sector |
| High Impact Mentor | Strong startup feedback |
| Programme Mentor | Approved for programme participation |
| Funding Advisor | Approved for fundraising guidance |
| Compliance Advisor | Approved for compliance guidance |

---

## 10. Passport Issuance Moment

This should be a strong UI moment.

When admin approves, the system should show:

```text
Passport Issued
```

## 10.1 Passport Issued Success Page

### For Startup

```text
Your Startup Passport has been issued.

MediNova AI is now conditionally verified and ready for ecosystem linkage recommendations.
```

### For Mentor

```text
Your Mentor Passport has been issued.

You are now verified to support startups across eligible programmes.
```

### Page Elements

- Passport cover animation
- Issued stamp animation
- Passport ID
- Issue date
- Earned stamps
- Next recommended stamp
- View passport button
- Share passport button

---

## 11. Public Verification

## 11.1 Purpose

Allow others to confirm whether a passport is valid.

A passport should have:

- Public verification link
- QR code
- Passport ID
- Validity status

## 11.2 Public Verification Page Shows

- Passport holder name
- Passport type
- Status
- Issue date
- Review date
- Key badges
- Issued by TrustPass AI
- Valid / expired / revoked indicator

## 11.3 Public Page Should Not Show

- Internal risk notes
- Full scores
- Private documents
- Admin comments
- Sensitive review details

---

## 12. Passport Sharing

Passport holders should be able to share their credential.

## 12.1 Share Options

- Copy verification link
- Download PDF passport
- Download badge image
- Download QR code
- Share to LinkedIn
- Send to programme admin
- Send to mentor or partner

## 12.2 Suggested LinkedIn Copy

For startups:

```text
We are proud to share that our startup has received a TrustPass AI Startup Passport, recognising our verified ecosystem profile and readiness for innovation programme linkages.
```

For mentors:

```text
I am proud to share that I have received a TrustPass AI Mentor Passport, recognising my verified expertise and readiness to support startups across innovation programmes.
```

---

## 13. Passport Renewal

Passports and stamps should not be permanent forever.

## 13.1 Renewal Triggers

- Review date reached
- New programme application
- New evidence submitted
- Startup stage changed
- Mentor expertise updated
- Admin requests renewal
- Passport expired

## 13.2 Renewal UI

Show:

```text
Your passport review date is approaching.
Update your profile and evidence to keep your passport active.
```

---

## 14. Passport Revocation / Suspension

Admins need control if information becomes invalid.

## 14.1 Suspension Reasons

- Evidence no longer valid
- Misrepresentation
- Expired documents
- Admin investigation
- Programme policy change

## 14.2 User Messaging

Avoid harsh language unless necessary.

Example:

```text
Your passport is temporarily under review.
Some verification details need to be updated before it can be used for new linkages.
```

---

## 15. Passport UI Components

## 15.1 PassportCover

Shows the closed passport.

Used in:

- Landing page
- Dashboard
- Success page
- Passport detail page

## 15.2 PassportBook

Shows open passport layout.

Used in:

- Passport detail page
- Demo flow

## 15.3 PassportStamp

Shows individual stamp.

States:

- Earned
- Pending
- Locked
- Missing evidence
- Expired
- Revoked

## 15.4 VerificationBadge

Shows shareable badge.

Used in:

- Dashboard
- Public verification page
- Passport detail page

## 15.5 PassportQRCode

Shows QR code for public verification.

## 15.6 StampWall

Shows all earned, pending, and locked stamps.

## 15.7 PassportIssuedModal

Shows after admin issues a passport.

---

## 16. What Needs to Be Built

## 16.1 Pages

Build these pages:

1. Digital Passport detail page
2. Passport issued success page
3. Passport stamp wall page
4. Badge gallery page
5. Public verification page
6. Passport sharing page
7. Passport renewal page
8. Passport status history page

---

## 16.2 UI Components

Build these components:

- Passport cover
- Open passport book
- Stamp component
- Badge component
- QR verification component
- Passport status badge
- Passport timeline
- Passport share panel
- Passport issued animation
- Stamp progress tracker

---

## 16.3 User Actions

Build actions for:

- View passport
- Share passport
- Download passport
- Copy verification link
- View stamps
- View badges
- Submit evidence for pending stamp
- Request passport renewal

---

## 16.4 Admin Actions

Build actions for:

- Issue passport
- Add stamp
- Approve stamp
- Mark stamp pending
- Revoke stamp
- Suspend passport
- Renew passport
- Set review date
- Add admin note

---

## 17. MVP Scope for Hackathon

## Must Build

1. Passport cover
2. Open passport page
3. Stamp wall
4. Earned and pending stamps
5. Passport issued success page
6. Public verification mock page
7. Share passport button

## Nice to Have

1. Download PDF passport
2. QR code
3. Passport renewal
4. Badge image export
5. Stamp animation

## Can Be Mocked

1. Real QR verification
2. Real PDF generation
3. Real public URL
4. Full passport history

---

## 18. UX Guidelines

## 18.1 Keep It Professional

The passport should feel official, not childish.

Use:

- Stamps
- Seals
- Badges
- Review dates
- QR verification
- Issued by text

Avoid:

- Coins
- Leaderboards
- Cartoon rewards
- Excessive animation
- Game-like levels

---

## 18.2 Make Stamps Meaningful

Every stamp must represent a real verification achievement.

Do not issue random badges just for engagement.

---

## 18.3 Show What Is Pending

Pending stamps should encourage action.

Example:

```text
Pilot Ready stamp is pending.
Upload pilot customer proof to continue.
```

---

## 18.4 Make Trust Portable

The passport must feel useful outside the platform through share links, QR codes, and downloadable proof.

---

## 19. Success Criteria

The Digital Passport & Stamp System is successful if:

- It makes verification feel tangible
- It differentiates TrustPass AI from normal dashboards
- Startups and mentors understand their trust status
- Admins can issue and manage credentials easily
- Stamps clearly show progress and trust milestones
- Public verification creates confidence
- Passports support ecosystem linkages

---

## 20. Final Positioning

This module is the product’s strongest differentiator.

Position it as:

> **The credential layer that makes startup and mentor trust visible, portable, and reusable.**

Strongest product moment:

```text
Passport Issued
```

Strongest visual:

```text
A digital passport booklet with official stamps and badges.
```

Strongest value:

```text
Verified participants can carry trust across programmes, mentors, partners, and regions.
```
