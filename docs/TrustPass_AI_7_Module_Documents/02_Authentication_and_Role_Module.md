# TrustPass AI — Module 2: Authentication & Role Module

## 1. Module Purpose

The **Authentication & Role Module** manages how users enter TrustPass AI and what experience they see after logging in.

This module is important because TrustPass AI has multiple user types:

- Startup founders
- Mentors
- Programme administrators
- Ecosystem owners
- Partners or service providers

Each role has a different journey, different permissions, and different dashboard experience.

The module must make onboarding simple while keeping the product professional and secure.

---

## 2. Core Objective

The Authentication & Role Module should answer:

> **Who is this user, what role do they play in the ecosystem, and what should they be allowed to access?**

It should route users into the right workflow:

```text
Startup Founder → Startup Passport journey
Mentor → Mentor Passport journey
Programme Admin → Admin verification workspace
Ecosystem Owner → Organisation and programme management
Partner → Partner linkage journey
```

---

## 3. User Roles

## 3.1 Startup Founder

A startup founder creates an account to submit a startup profile and receive a Startup Passport.

### Main Access

- Startup dashboard
- Startup profile form
- Document upload
- Verification status
- Startup Passport
- Missing evidence requests
- Linkage recommendations

---

## 3.2 Mentor

A mentor creates an account to become a verified ecosystem mentor.

### Main Access

- Mentor dashboard
- Mentor profile
- Expertise submission
- Mentor Passport
- Linkage requests
- Engagement plans
- Feedback forms

---

## 3.3 Programme Administrator

A programme administrator reviews startup and mentor applications.

### Main Access

- Admin dashboard
- Application inbox
- AI verification workspace
- Passport issuance
- Evidence requests
- Linkage approval
- Programme assignment

---

## 3.4 Ecosystem Owner / Super Admin

An ecosystem owner manages the organisation-level setup.

### Main Access

- Organisation dashboard
- Programme setup
- Eligibility rules
- User management
- Audit logs
- Reports
- AI policy configuration

---

## 3.5 Partner / Service Provider

A partner or service provider joins the ecosystem to support verified startups.

### Main Access

- Partner dashboard
- Partner Passport
- Startup linkage requests
- Engagement records
- Feedback submission

---

## 4. Authentication Pages

## 4.1 Login Page

### Purpose

Allow existing users to securely access the system.

### Page Layout

Recommended layout:

- Left side: brand panel with passport visual
- Right side: login form

### Left Brand Panel Copy

```text
Welcome back to TrustPass AI.
Continue building trusted startup and mentor ecosystems.
```

### Form Fields

- Email address
- Password

### Actions

- Sign in
- Continue with Google
- Forgot password
- Create new account

### Login Success Routing

| User Role | Route After Login |
|---|---|
| Startup Founder | Startup Dashboard |
| Mentor | Mentor Dashboard |
| Programme Admin | Admin Dashboard |
| Ecosystem Owner | Organisation Dashboard |
| Partner | Partner Dashboard |

---

## 4.2 Sign Up Page

### Purpose

Allow new users to create an account.

### Form Fields

- Full name
- Email
- Password
- Confirm password
- Organisation name
- Country
- Role selection

### Primary CTA

```text
Create Account
```

### Secondary CTA

```text
Already have an account? Sign in
```

---

## 4.3 Role Selection Page

### Purpose

Route users into the correct passport or admin journey.

### Role Cards

| Role | Card Title | Description | CTA |
|---|---|---|---|
| Startup Founder | Create Startup Passport | Submit your startup for AI-assisted verification | Continue |
| Mentor | Create Mentor Passport | Verify your expertise and join ecosystem programmes | Continue |
| Programme Admin | Manage Verification | Review applications and issue passports | Continue |
| Partner | Join as Partner | Support verified startups through ecosystem linkages | Continue |
| Ecosystem Owner | Configure Ecosystem | Manage programmes, rules, users, and reports | Continue |

### Page Copy

```text
Choose your ecosystem role.
Your role determines the passport, dashboard, and workflows available to you.
```

---

## 4.4 Forgot Password Page

### Purpose

Help users recover their account.

### Fields

- Email address

### CTA

```text
Send Reset Link
```

### Confirmation Message

```text
If an account exists for this email, we have sent password reset instructions.
```

---

## 4.5 Reset Password Page

### Fields

- New password
- Confirm new password

### CTA

```text
Update Password
```

---

## 4.6 Email Verification Page

### Purpose

Verify user email before allowing full system access.

### Message

```text
Please verify your email to continue.
We sent a verification link to your inbox.
```

### Actions

- Resend verification email
- Change email address
- Back to login

---

## 4.7 Organisation Invite Acceptance Page

### Purpose

Allow admins, reviewers, mentors, or partners to join an organisation by invitation.

### Flow

```text
User receives invite
      ↓
Clicks invite link
      ↓
Reviews organisation name and assigned role
      ↓
Creates account or signs in
      ↓
Access is granted
```

### Page Content

- Organisation name
- Invited role
- Invited by
- Accept invite button

---

## 5. Onboarding Flows

## 5.1 Startup Founder Onboarding

### Flow

```text
Sign Up
      ↓
Verify Email
      ↓
Select Role: Startup Founder
      ↓
Create Startup Profile
      ↓
Upload Documents
      ↓
Submit for Verification
      ↓
Go to Startup Dashboard
```

### Required Startup Onboarding Fields

- Startup name
- Founder name
- Country
- Sector
- Startup stage
- Website or product link
- Support needed

### Completion State

```text
Your startup profile is ready.
Continue to upload evidence for AI verification.
```

---

## 5.2 Mentor Onboarding

### Flow

```text
Sign Up
      ↓
Verify Email
      ↓
Select Role: Mentor
      ↓
Create Mentor Profile
      ↓
Submit Expertise and Credentials
      ↓
Submit for Verification
      ↓
Go to Mentor Dashboard
```

### Required Mentor Onboarding Fields

- Mentor name
- Organisation
- Country
- Expertise areas
- Sector focus
- Preferred startup stage
- Availability
- LinkedIn or profile URL

### Completion State

```text
Your mentor profile has been submitted for verification.
You will receive your Mentor Passport once approved.
```

---

## 5.3 Programme Admin Onboarding

### Flow

```text
Accept Organisation Invite
      ↓
Create Account
      ↓
Verify Email
      ↓
Confirm Role
      ↓
Access Admin Dashboard
```

### Admin Should Not Self-Assign

Programme administrator access should usually be granted through organisation invitation or super admin approval.

---

## 5.4 Ecosystem Owner Onboarding

### Flow

```text
Request Demo / Create Organisation
      ↓
Create Admin Account
      ↓
Verify Email
      ↓
Set Organisation Profile
      ↓
Create First Programme
      ↓
Invite Admins or Reviewers
```

---

## 6. Access Control Requirements

## 6.1 Basic Permission Logic

| Action | Startup | Mentor | Admin | Owner | Partner |
|---|---|---|---|---|---|
| Edit own profile | Yes | Yes | Yes | Yes | Yes |
| Upload startup documents | Yes | No | Limited | Yes | No |
| Upload mentor credentials | No | Yes | Limited | Yes | No |
| Run AI verification | No | No | Yes | Yes | No |
| Issue passport | No | No | Yes | Yes | No |
| View own passport | Yes | Yes | Yes | Yes | Yes |
| View all applications | No | No | Yes | Yes | No |
| Configure programme rules | No | No | Limited | Yes | No |
| View audit logs | No | No | Limited | Yes | No |
| Accept linkage request | No | Yes | No | No | Yes |

---

## 6.2 Dashboard Routing

After login, the user should be routed to the correct dashboard based on their role.

### Examples

```text
Startup Founder → /startup/dashboard
Mentor → /mentor/dashboard
Programme Admin → /admin/dashboard
Ecosystem Owner → /owner/dashboard
Partner → /partner/dashboard
```

---

## 6.3 Multi-Role Users

Some users may have more than one role.

Example:

- A mentor may also be a startup founder.
- An ecosystem owner may also act as programme admin.
- A partner may also provide mentorship.

### Required Feature

The system should allow role switching.

### UI Component

Add a role switcher in the top bar:

```text
Current Role: Programme Admin
Switch Role: Startup Founder / Mentor / Owner
```

For MVP, this can be simplified to one role per user.

---

## 7. Authentication UI Components

## 7.1 Auth Layout

A reusable layout for login, signup, and password pages.

### Layout Elements

- Brand logo
- Passport visual
- Form card
- Footer links
- Privacy and terms links

---

## 7.2 Role Card

Used on the role selection page.

### Card Contents

- Icon
- Role name
- Short description
- CTA button

Example:

```text
Startup Founder
Create a Startup Passport and get verified for ecosystem programmes.
```

---

## 7.3 Invite Card

Used for organisation invite acceptance.

### Card Contents

- Organisation name
- Invited role
- Invited by
- Accept button
- Decline link

---

## 7.4 Auth Status Messages

Standard messages:

| Scenario | Message |
|---|---|
| Login error | Invalid email or password |
| Email not verified | Please verify your email before continuing |
| Password reset sent | Check your inbox for reset instructions |
| Invite expired | This invite link has expired |
| Access denied | You do not have permission to access this page |

---

## 8. Security and Trust Features

## 8.1 Account Security

The module should support:

- Secure password flow
- Email verification
- Forgot password
- Session handling
- Logout
- Optional Google login
- Optional two-factor authentication in future

---

## 8.2 Role-Based Access

The module should prevent users from accessing pages outside their role.

Example:

A startup founder should not access:

- Admin verification workspace
- Other startup applications
- Programme rules
- Audit logs

---

## 8.3 Organisation-Based Access

Admins should only view data for their own organisation.

Example:

An accelerator admin should only view applications submitted to that accelerator’s programmes.

---

## 9. What Needs to Be Built

## 9.1 Pages

Build these pages:

1. Login page
2. Sign up page
3. Forgot password page
4. Reset password page
5. Email verification page
6. Role selection page
7. Organisation invite acceptance page
8. Access denied page

---

## 9.2 User Flows

Build these flows:

1. New user signup
2. Email verification
3. Login
4. Logout
5. Forgot password
6. Role selection
7. Role-based dashboard routing
8. Organisation invite acceptance

---

## 9.3 UI Components

Build these components:

- AuthLayout
- LoginForm
- SignupForm
- ForgotPasswordForm
- ResetPasswordForm
- EmailVerificationMessage
- RoleSelectionCard
- OrganisationInviteCard
- RoleSwitcher
- AccessDeniedMessage

---

## 9.4 Admin-Controlled Access

Build features for:

- Inviting programme admins
- Inviting mentors
- Inviting partners
- Assigning roles
- Disabling users
- Viewing user status

For hackathon MVP, this can be mocked or simplified.

---

## 10. MVP Scope for Hackathon

For the hackathon, build only what helps the demo.

### Must Build

- Login page
- Signup page
- Role selection page
- Startup founder route
- Admin route
- Mentor route
- Basic dashboard redirect

### Nice to Have

- Email verification screen
- Forgot password screen
- Organisation invite screen
- Role switcher

### Can Be Mocked

- Actual email sending
- Full password recovery
- Complex permission matrix
- Multi-organisation access

---

## 11. UX Rules

## 11.1 Keep Role Selection Simple

Do not overwhelm users with too many role details.

Use simple language:

```text
I am a Startup Founder
I am a Mentor
I am a Programme Admin
I am an Ecosystem Owner
```

## 11.2 Route Quickly

After role selection, take users directly into the relevant workflow.

## 11.3 Explain Passport Outcome

During signup, remind users what they will receive.

Example for startup:

```text
After verification, your startup can receive a digital Startup Passport with verified stamps and badges.
```

Example for mentor:

```text
After approval, you can receive a Mentor Passport and become eligible for startup linkage requests.
```

---

## 12. Success Criteria

This module is successful if:

- Users can sign up easily
- Users understand which role to choose
- Users are routed to the right dashboard
- Admin and startup experiences are clearly separated
- Passport journey begins immediately after login
- The product feels secure and trustworthy

---

## 13. Final Positioning

The Authentication & Role Module is not just a login system.

It is the gateway into the TrustPass ecosystem.

The module should make users feel:

```text
I am entering a trusted verification system.
My role matters.
My passport journey starts here.
```
