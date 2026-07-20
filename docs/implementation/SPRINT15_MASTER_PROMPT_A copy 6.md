# RIOS Sprint 15 — Part 0

# Frontend Foundation, Design System & Application Architecture

---

# ROLE

You are acting as the Lead Frontend Architect, Principal UI Engineer, Senior
Product Designer, UX Architect, Accessibility Specialist, and Next.js Expert for
the Research Identity Operating System (RIOS).

Your responsibility is NOT simply to write code.

Your responsibility is to build a frontend architecture that is maintainable for
many years and matches enterprise software quality.

Think like you are designing the frontend for a platform comparable in quality
to:

- GitHub
- Linear
- Notion
- Vercel Dashboard
- Google Scholar
- ORCID
- ResearchGate
- Semantic Scholar

This frontend will become the public face of RIOS.

Every design decision must prioritize:

- usability
- clarity
- accessibility
- maintainability
- scalability
- performance
- consistency

---

# ABSOLUTE RULE

DO NOT WRITE ANY CODE IMMEDIATELY.

The first responsibility is to understand the project.

---

# PHASE 1

# Documentation Analysis (MANDATORY)

Before writing a single line of code, scan the entire repository.

Read every important document that exists.

Examples include (if present):

- README.md
- ARCHITECTURE.md
- SYSTEM_DESIGN.md
- DOMAIN_MODEL.md
- API_DOCUMENTATION.md
- IMPLEMENTATION_PLAN.md
- task.md
- walkthrough.md
- Sprint documentation
- ADR documents
- docs/
- design/
- assets/
- wireframes/
- diagrams/
- backend API specifications
- OpenAPI / Swagger specifications
- Prisma schema
- package structure

Do NOT assume file names.

Search the repository for architecture and documentation files.

Read them.

Use them as the source of truth.

If multiple documents disagree:

Choose the newest architecture.

Explain conflicts before implementation.

---

# PHASE 2

# Repository Analysis

Analyze the existing project.

Understand completely:

Backend Architecture

Existing REST APIs

Authentication

JWT Flow

Database Model

DDD Bounded Contexts

CQRS

Domain Model

Current Folder Structure

Existing TypeScript Configuration

Workspace Structure

Environment Variables

Shared Packages

Reusable Utilities

Infrastructure

Error Handling

Validation

Existing API contracts

Never duplicate functionality.

Never redesign backend architecture.

The frontend must integrate naturally.

---

# PHASE 3

# Frontend Architecture Planning

Before implementation produce a complete architecture report.

Include:

1. Proposed frontend folder structure

2. Feature module organization

3. Component hierarchy

4. Shared component strategy

5. Layout strategy

6. State management strategy

7. Server state strategy

8. Authentication strategy

9. Theme strategy

10. Form strategy

11. Error handling strategy

12. Loading strategy

13. Responsive strategy

14. Accessibility strategy

15. Performance strategy

16. API integration strategy

17. Testing strategy

Do NOT implement yet.

Think first.

---

# PHASE 4

# Technology Verification

Verify the current frontend stack.

If packages are already installed, reuse them.

If packages are missing, justify additions.

Preferred stack:

Next.js (App Router)

TypeScript

Tailwind CSS

shadcn/ui

TanStack Query

React Hook Form

Zod

Framer Motion

Lucide Icons

Sonner

next-themes

Do not install alternatives unless necessary.

---

# PHASE 5

# Design Philosophy

The UI should feel:

Minimal

Elegant

Academic

Professional

Modern

Fast

Clean

Readable

Avoid dashboard clutter.

Avoid unnecessary decoration.

Whitespace is valuable.

Typography should improve readability.

Animations should communicate state rather than decorate.

Every page should feel intentional.

---

# PHASE 6

# Design System

Create a reusable design language.

Define:

Typography

Color System

Spacing Scale

Grid

Cards

Tables

Forms

Dialogs

Buttons

Badges

Avatars

Charts

Icons

Navigation

Empty States

Loading States

Error States

Success States

Skeletons

Toasts

All components must be reusable.

---

# PHASE 7

# Responsive Requirements

Desktop first.

Then optimize:

Laptop

Tablet

Mobile

No horizontal scrolling.

No layout breakage.

Navigation must adapt gracefully.

---

# PHASE 8

# Accessibility

Target WCAG AA compliance.

Support:

Keyboard navigation

Screen readers

Focus indicators

ARIA attributes

Color contrast

Reduced motion preference

Semantic HTML

---

# PHASE 9

# Performance

Optimize for:

Fast navigation

Minimal bundle size

Code splitting

Lazy loading

Image optimization

Caching

Suspense

Streaming where appropriate

Avoid unnecessary re-renders.

---

# PHASE 10

# Frontend Folder Structure

Design a scalable folder structure.

Examples:

app/

components/

features/

hooks/

lib/

providers/

services/

styles/

types/

utils/

Do not create unnecessary nesting.

---

# PHASE 11

# Deliverables

Before implementation provide:

1. Frontend Architecture Diagram

2. Folder Structure

3. Feature Module Structure

4. Component Hierarchy

5. Design System Specification

6. State Management Plan

7. API Integration Plan

8. Authentication Plan

9. Performance Plan

10. Accessibility Checklist

11. Risks

12. Estimated Components

13. Estimated Pages

14. Estimated Timeline

Only after this report is internally consistent should implementation begin.

---

# IMPLEMENTATION RULES

Never redesign the backend.

Never duplicate backend validation.

Reuse API contracts.

Preserve Clean Architecture principles.

Maintain strict TypeScript.

Zero any.

No eslint-disable.

No unnecessary abstractions.

Prefer composition over inheritance.

Use reusable components.

Keep components focused.

Avoid large monolithic pages.

---

# QUALITY GATES

Before completion verify:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

Executive Summary

Architecture Decisions

Design System Overview

Folder Structure

Components Created

Packages Installed

Configuration Changes

Performance Improvements

Accessibility Compliance

Testing Results

Remaining Technical Debt

Preparation for Sprint 15 Part 1

Only declare completion if all quality gates pass.

# RIOS Sprint 15 — Part 1

# Application Shell, Navigation System & Global Layout

---

# ROLE

You are the Lead Product Designer, Principal Frontend Engineer, UX Architect,
Next.js Architect, and Enterprise UI Engineer for the Research Identity
Operating System (RIOS).

This is NOT simply a frontend implementation task.

You are designing the entire application experience that every researcher will
use every day.

Think carefully before implementing anything.

Every future page must naturally fit into this architecture.

The goal is to build a platform that feels comparable to:

• GitHub

• Linear

• Notion

• Vercel Dashboard

• Stripe Dashboard

• Google Scholar

• ResearchGate

without copying them.

---

# FIRST RESPONSIBILITY

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Documentation Review (MANDATORY)

Before implementation scan the repository.

Read all relevant documents.

Especially:

Backend Architecture

Sprint Documentation

Frontend Foundation (Part 0)

API Documentation

Authentication Documentation

Design Documents

OpenAPI

Swagger

README

Architecture Documents

Prisma Schema

Existing Frontend

Component Libraries

Environment Configuration

Workspace Configuration

Never assume.

Always verify.

If documentation conflicts:

Explain the conflict.

Choose the newest architecture.

---

# PHASE 2

# Understand The Product

Before implementation understand:

Who are the users?

Research Students

Professors

Researchers

Supervisors

Industry Researchers

Administrators

Understand their workflow.

The UI should optimize:

Research productivity

Navigation speed

Low cognitive load

Consistency

Accessibility

---

# PHASE 3

# Design The Complete Application Shell

This shell must become the permanent framework for every future page.

Implement:

Persistent Sidebar

Top Navigation

Breadcrumb System

Page Header

Workspace Layout

Content Container

Footer

Command Palette Trigger

Notification Center

Search Entry

Profile Dropdown

Workspace Switcher (future-ready)

Theme Toggle

Keyboard Shortcut Support

Mobile Navigation

Tablet Navigation

Desktop Navigation

---

# SIDEBAR REQUIREMENTS

The sidebar is the heart of the application.

Requirements:

Collapsible

Resizable (optional if architecture supports)

Smooth animation

Icon mode

Expanded mode

Active state

Nested navigation

Keyboard accessible

Responsive

Future-proof

Sections:

Dashboard

Research

    Publications

    Projects

    Research Assets

Academic

    Awards

    Grants

    Patents

    Professional Activities

Intelligence

    Analytics

    Timeline

    Collaboration

Discovery

    Search

    Researchers

AI

    Recommendations

    Knowledge Graph

Public Profile

Settings

Support

Future sections must be addable without rewriting the sidebar.

---

# TOP NAVIGATION

Contains:

Breadcrumbs

Global Search

Notifications

Theme Toggle

Profile Avatar

Quick Actions

Keyboard Shortcut Hint

Page Title

Optional:

Workspace Indicator

---

# COMMAND PALETTE

Design architecture for:

⌘K / Ctrl+K

Search pages

Search commands

Navigate quickly

Future AI commands

Future research search

Do NOT fully implement AI.

Build extensible architecture.

---

# GLOBAL SEARCH BAR

Prepare architecture.

Later will support:

Publications

Researchers

Projects

Datasets

Awards

AI Search

Current sprint only builds UI architecture.

---

# PAGE LAYOUT

Every page should automatically inherit:

Header

Title

Description

Toolbar

Breadcrumb

Scrollable Content

Responsive Container

Consistent Padding

Avoid duplicated layouts.

---

# RESPONSIVE BEHAVIOR

Desktop

Large Laptop

Laptop

Tablet

Phone

Sidebar behavior:

Desktop

Permanent

Tablet

Collapsible

Mobile

Drawer

No layout shifts.

---

# GLOBAL COMPONENTS

Create reusable components.

Examples:

<AppLayout>

<Sidebar>

<SidebarItem>

<SidebarSection>

<PageHeader>

<Breadcrumb>

<SearchBar>

<NotificationBell>

<UserMenu>

<ThemeSwitcher>

<CommandPalette>

<ContentContainer>

<MobileDrawer>

<DesktopSidebar>

<TopNavigation>

<PageToolbar>

Do not create page-specific components here.

---

# STATE MANAGEMENT

Design global state.

Include:

Sidebar collapsed

Theme

Notifications

Command palette

Mobile drawer

Current user

Active workspace

Future extensibility.

Use existing architecture.

---

# ACCESSIBILITY

Support:

Keyboard navigation

Focus trap

ARIA

Screen readers

Reduced motion

Semantic HTML

Visible focus states

---

# PERFORMANCE

Lazy load:

Command Palette

Notification Panel

Large Navigation Groups

Profile Menu

Prevent unnecessary renders.

Optimize layout stability.

---

# ANIMATIONS

Animations should communicate state.

Avoid decorative animation.

Examples:

Sidebar collapse

Drawer opening

Dropdown menus

Hover states

Focus transitions

Keep animations subtle.

---

# DESIGN CONSISTENCY

Every spacing

Every typography

Every icon

Every border

Every radius

Every shadow

must follow Part 0 Design System.

Never introduce inconsistent styles.

---

# TESTING

Test:

Sidebar navigation

Responsive layout

Keyboard navigation

Accessibility

Dark mode

Light mode

Mobile drawer

Global state

Theme switching

Layout persistence

---

# QUALITY GATES

Before completion execute:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Architecture Decisions

3. Navigation Architecture

4. Layout Architecture

5. Sidebar Structure

6. Component Tree

7. State Management Overview

8. Accessibility Compliance

9. Responsive Strategy

10. Performance Optimizations

11. Components Created

12. Files Created

13. Files Modified

14. Testing Results

15. Remaining Risks

16. Preparation for Sprint 15 Part 2

Only certify completion if:

• All quality gates pass

• The application shell is reusable

• Every future page can plug into this layout without redesign

• The architecture remains scalable

• Clean Architecture principles are respected

# RIOS Sprint 15 — Part 2

# Authentication Experience, User Identity & Researcher Onboarding

---

# ROLE

You are acting as:

- Principal Product Designer
- Principal Frontend Engineer
- Identity & Authentication Architect
- UX Researcher
- Security Engineer
- Accessibility Specialist
- Next.js App Router Expert

This is NOT a login page.

This is the complete identity experience of the Research Identity Operating
System (RIOS).

Everything must feel polished, trustworthy, professional and effortless.

Think of authentication experiences from:

• GitHub

• Linear

• Notion

• Vercel

• Stripe

• Google

Take inspiration from their usability—not their visual appearance.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Documentation Analysis (MANDATORY)

Before implementation:

Scan the repository.

Read ALL documentation related to:

Authentication

JWT

Access Tokens

Refresh Tokens

Backend APIs

User Entity

Research Profile

Environment Variables

Security

Middleware

Authorization

Protected Routes

Route Guards

API Documentation

Swagger

OpenAPI

Sprint Documents

Frontend Foundation (Part 0)

Application Shell (Part 1)

Never assume endpoint names.

Never invent API contracts.

Use existing backend contracts.

If missing:

Document the missing contract.

Do NOT guess.

---

# PHASE 2

# Understand User Journey

Before designing screens understand:

Who is the user?

Research student

Professor

Researcher

PhD candidate

Industry researcher

Supervisor

Administrator

Map complete user journey.

Visitor

↓

Registration

↓

Email Verification

↓

First Login

↓

Profile Setup

↓

Research Profile Creation

↓

Dashboard

↓

Daily Usage

Every transition should feel seamless.

---

# PHASE 3

# Authentication Architecture

Analyze backend.

Verify:

JWT Flow

Refresh Token Strategy

Session Management

Cookie Strategy

Token Storage

Authorization

Protected APIs

Logout

Session Expiration

Role Handling

Permission Handling

Design frontend accordingly.

Never duplicate backend validation.

---

# PHASE 4

# Authentication Screens

Design and implement:

Landing Login

Registration

Forgot Password

Reset Password

Email Verification

Resend Verification

Loading Session

Unauthorized Page

403

404

500

Session Expired

Account Locked

Maintenance Mode

Every page must be responsive.

Every page must follow Design System.

---

# LOGIN EXPERIENCE

Requirements:

Minimal

Fast

Accessible

Professional

Support:

Email

Password

Show Password

Remember Me

Forgot Password

Login Button

Loading State

Validation

Error Messages

Success Transition

No unnecessary fields.

---

# REGISTRATION EXPERIENCE

Collect only required information.

Examples:

Full Name

Email

Password

Confirm Password

Accept Terms

Optional:

Institution

Country

Research Interest

Do not overwhelm users.

Additional information belongs in onboarding.

---

# PASSWORD REQUIREMENTS

Display:

Strength Indicator

Requirements Checklist

Caps Lock Detection

Matching Password Indicator

Visibility Toggle

Inline Validation

Never frustrate users.

---

# EMAIL VERIFICATION

Design complete flow.

Verification Pending

Email Sent

Resend

Expired Link

Verified Successfully

Error State

---

# PASSWORD RESET

Flow:

Forgot Password

↓

Email Sent

↓

Reset Link

↓

Create New Password

↓

Success

Support:

Expired Links

Invalid Links

Rate Limiting Messages

---

# SESSION MANAGEMENT

Design frontend behavior for:

Expired JWT

Expired Refresh Token

Network Failure

Offline Mode

Unauthorized API

Automatic Refresh

Forced Logout

Concurrent Sessions

Never lose user work.

---

# ROUTE PROTECTION

Implement architecture for:

Public Routes

Authenticated Routes

Admin Routes

Researcher Routes

Guest Routes

Loading Routes

Unauthorized Redirects

---

# ONBOARDING EXPERIENCE

After first login:

Guide researcher through setup.

Steps:

Welcome

↓

Basic Information

↓

Research Interests

↓

Institution

↓

Academic Position

↓

Research Fields

↓

ORCID (optional)

↓

Profile Picture

↓

Finish

Support:

Skip

Save Progress

Return Later

---

# EMPTY STATES

Design excellent empty states.

Examples:

No Publications

No Projects

No Awards

No Research Assets

Guide users naturally.

---

# ERROR HANDLING

Support:

API Errors

Timeout

Offline

Network Lost

Duplicate Email

Invalid Password

Server Error

Validation Errors

Authentication Error

Messages must be friendly.

Never expose backend details.

---

# ACCESSIBILITY

Support:

Keyboard navigation

ARIA

Screen Readers

Focus Order

Reduced Motion

Semantic HTML

Color Contrast

Large Touch Targets

---

# RESPONSIVE DESIGN

Desktop

Laptop

Tablet

Phone

Authentication should feel native on every device.

---

# PERFORMANCE

Optimize:

Route Loading

Session Restoration

Code Splitting

Lazy Components

Minimal Bundle

Fast Initial Load

---

# ANIMATIONS

Use subtle animations only.

Examples:

Page Transition

Success

Error

Form Validation

Loading

Never distract users.

---

# GLOBAL COMPONENTS

Create reusable components.

<AuthLayout>

<LoginForm>

<RegisterForm>

<PasswordStrength>

<VerificationBanner>

<SessionLoader>

<ProtectedRoute>

<AuthGuard>

<ProfileSetupWizard>

<FormField>

<FormError>

<AuthCard>

<SuccessMessage>

<ErrorMessage>

---

# TESTING

Create tests for:

Authentication

Protected Routes

Registration

Password Reset

Session Expiration

Refresh Token

Route Guards

Accessibility

Responsive Layout

Validation

Error Handling

---

# QUALITY GATES

Before completion execute:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Authentication Architecture

3. Session Management Strategy

4. Route Protection Strategy

5. Authentication Components

6. Onboarding Flow

7. Validation Strategy

8. Error Handling Strategy

9. Accessibility Compliance

10. Responsive Strategy

11. Components Created

12. Files Created

13. Files Modified

14. Testing Results

15. Remaining Risks

16. Preparation for Sprint 15 Part 3

Only certify completion if:

• All quality gates pass

• Authentication fully integrates with the backend

• Session management is robust

• Route protection is secure

• Clean Architecture is preserved

• No API contracts are violated

• The onboarding experience is complete and reusable

# RIOS Sprint 15 — Part 3

# Research Command Center (Dashboard)

---

# ROLE

You are acting as:

- Principal Product Designer
- Principal UX Researcher
- Staff Frontend Engineer
- Dashboard Architect
- Information Architecture Expert
- Research Workflow Consultant

Your responsibility is to build the primary workspace used by researchers every
day.

This dashboard must become the heart of RIOS.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Documentation Review (MANDATORY)

Before implementation:

Scan the repository.

Read all documentation related to:

- Sprint 15 Part 0
- Sprint 15 Part 1
- Sprint 15 Part 2
- Backend Dashboard APIs
- Publications APIs
- Projects APIs
- Awards APIs
- Grants APIs
- Research Assets APIs
- Analytics APIs
- Timeline APIs
- AI APIs
- Search APIs
- Authentication
- OpenAPI / Swagger
- README
- Architecture Documents
- Design Documents

Do NOT invent APIs.

If dashboard endpoints do not exist, identify reusable endpoints and document
missing backend requirements instead of guessing.

---

# PHASE 2

# Understand Dashboard Purpose

Before implementation answer:

Why does this dashboard exist?

Who uses it?

What problems does it solve?

What information should appear immediately?

What information belongs deeper inside feature pages?

Never overload users.

Every widget must justify its existence.

---

# PHASE 3

# Information Hierarchy

The dashboard should communicate information in this priority:

1. Today's Research Status

2. Important Alerts

3. Current Projects

4. Publication Progress

5. AI Insights

6. Research Metrics

7. Timeline

8. Opportunities

9. Recent Activity

10. Quick Actions

Never reverse this order without justification.

---

# PHASE 4

# Dashboard Layout

Design responsive sections.

Hero Section

↓

Today's Summary

↓

Quick Actions

↓

Research Metrics

↓

Current Projects

↓

Recent Publications

↓

Research Timeline

↓

AI Recommendations

↓

Research Opportunities

↓

Recent Activity

↓

Upcoming Deadlines

↓

Footer

---

# HERO SECTION

Must include:

Welcome Message

Current Date

Researcher Name

Institution

Research Position

Research Interests

Current Focus

Motivational Research Quote (optional)

Do NOT hardcode values.

---

# TODAY SUMMARY

Examples:

Publications in Progress

Projects Active

Awards Pending

Grants Active

Patents Pending

Datasets Published

Recent Citations

Unread Notifications

Upcoming Deadlines

Everything clickable.

---

# QUICK ACTIONS

Provide obvious entry points.

Examples:

New Publication

New Project

Upload Dataset

Add Award

Create Patent

Update Profile

Search Research

Open AI Assistant

Import ORCID

Export CV

Buttons must be keyboard accessible.

---

# RESEARCH METRICS

Visualize:

Publication Count

Citation Count

h-index

i10-index

Projects

Datasets

Awards

Patents

Collaborators

Research Areas

Trend indicators.

Use appropriate charts.

Never mislead.

---

# CURRENT PROJECTS

Display:

Status

Progress

Team

Deadline

Funding

Priority

Recent Updates

Support:

Cards

List

Sorting

Filtering

---

# RECENT PUBLICATIONS

Display:

Title

Venue

Publication Status

Authors

DOI

Citation Count

Publication Date

Quick Edit

Quick View

---

# RESEARCH TIMELINE

Display:

Recent Milestones

Awards

Publications

Projects

Grants

Professional Activities

Chronological visualization.

---

# AI INSIGHTS

Display only if backend supports it.

Examples:

Recommended Collaborators

Suggested Journals

Trending Topics

Research Gaps

Potential Citations

Dataset Recommendations

If unavailable:

Show informative placeholder.

Do NOT fabricate AI output.

---

# RESEARCH OPPORTUNITIES

Examples:

Upcoming Conferences

Grant Deadlines

Calls for Papers

Research Competitions

Scholarship Opportunities

If backend data unavailable:

Gracefully display empty state.

---

# RECENT ACTIVITY

Unified activity feed.

Examples:

Publication Updated

Project Created

Dataset Uploaded

Award Added

Patent Filed

Profile Updated

Timeline Generated

Most recent first.

---

# UPCOMING DEADLINES

Examples:

Conference Submission

Grant Deadline

Project Milestone

Patent Renewal

Review Request

Highlight urgency.

---

# EMPTY STATES

Design meaningful empty states.

Examples:

No Publications

No Projects

No Timeline

No Metrics

No AI Recommendations

Guide users toward the next action.

---

# DASHBOARD CUSTOMIZATION

Design architecture for future support.

Users should eventually be able to:

Reorder Widgets

Hide Widgets

Resize Widgets

Save Layout

Reset Layout

Only implement extensible architecture.

---

# GLOBAL SEARCH ENTRY

Dashboard search should integrate with:

Researchers

Projects

Publications

Awards

Datasets

AI

Reuse Part 1 architecture.

---

# NOTIFICATIONS

Surface:

Unread

Mentions

Deadlines

AI Alerts

System Alerts

Research Updates

Never overwhelm users.

---

# RESPONSIVE DESIGN

Desktop

Laptop

Tablet

Phone

Widgets should stack naturally.

No horizontal scrolling.

---

# ACCESSIBILITY

Keyboard navigation

ARIA

Focus order

Screen readers

Reduced motion

Semantic headings

High contrast

---

# PERFORMANCE

Lazy load heavy widgets.

Cache dashboard queries.

Use skeleton loaders.

Use optimistic updates where appropriate.

Avoid layout shifts.

---

# COMPONENTS

Create reusable components.

Examples:

<DashboardLayout>

<HeroBanner>

<TodaySummary>

<MetricCard>

<MetricsGrid>

<ProjectCard>

<PublicationCard>

<ActivityFeed>

<TimelineWidget>

<AIInsightCard>

<QuickActionGrid>

<DeadlineCard>

<OpportunityCard>

<WidgetContainer>

<DashboardSkeleton>

Do NOT create duplicated UI.

---

# TESTING

Test:

Dashboard rendering

Loading

Empty states

Responsive behavior

Accessibility

Widget interaction

Navigation

API integration

Caching

Error handling

---

# QUALITY GATES

Execute:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Dashboard Architecture

3. Widget Hierarchy

4. Information Architecture

5. API Integration Summary

6. Components Created

7. Files Created

8. Files Modified

9. Performance Strategy

10. Accessibility Review

11. Testing Results

12. Remaining Risks

13. Preparation for Sprint 15 Part 4

Only certify completion if:

• All quality gates pass

• Dashboard integrates with real backend APIs

• No fake data is introduced

• Components are reusable

• Accessibility requirements are met

• Responsive behavior is verified

• Clean Architecture principles remain intact

# RIOS Sprint 15 — Part 4

# Research Profile, Academic Identity & CV Builder

---

# ROLE

You are acting as:

• Principal Product Designer

• Principal UX Researcher

• Academic Portfolio Architect

• Frontend Architect

• Accessibility Specialist

• Next.js Expert

• Information Architecture Expert

Your responsibility is to design the complete Research Identity experience.

This page represents a researcher's academic identity.

This page may be viewed by:

• Professors

• Supervisors

• Scholarship Committees

• Research Collaborators

• Industry Researchers

• Universities

• Recruiters

Everything must communicate professionalism.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Documentation Review (MANDATORY)

Before implementation scan the repository.

Read:

- Sprint 15 Part 0
- Sprint 15 Part 1
- Sprint 15 Part 2
- Sprint 15 Part 3

Read backend documentation.

Locate:

Research Profile APIs

Publication APIs

Research Project APIs

Awards APIs

Grant APIs

Patent APIs

Research Assets APIs

Analytics APIs

Timeline APIs

Search APIs

Authentication APIs

OpenAPI

Swagger

Prisma Schema

Architecture Documents

DDD Documents

Never invent APIs.

Never invent fields.

Never duplicate backend validation.

If profile endpoints are incomplete,

document missing APIs before implementation.

---

# PHASE 2

# Understand The Purpose

Answer:

Why does this page exist?

What questions should visitors answer within five seconds?

What information belongs here?

What information belongs elsewhere?

Prioritize clarity.

Never overwhelm visitors.

---

# PHASE 3

# Research Identity Layout

The page should communicate information in this order.

Hero Section

↓

Research Summary

↓

Research Interests

↓

Academic Position

↓

Institution

↓

Research Metrics

↓

Featured Publications

↓

Active Projects

↓

Awards & Recognition

↓

Research Assets

↓

Timeline

↓

Collaboration

↓

Contact

↓

Footer

---

# HERO SECTION

Display:

Researcher Photo

Full Name

Academic Title

Current Position

Institution

Department

Country

Research Fields

Research Areas

Biography

Availability for Collaboration

ORCID (if available)

Google Scholar Link

GitHub

Personal Website

Profile Completion

Verification Badge (future-ready)

Everything must come from backend APIs.

Never hardcode.

---

# RESEARCH SUMMARY

Create an elegant summary section.

Include:

Total Publications

Total Citations

h-index

i10-index

Projects

Awards

Patents

Research Assets

Collaborators

Years of Research

Visualize clearly.

---

# RESEARCH INTERESTS

Display:

Primary Research Fields

Secondary Fields

Keywords

Areas of Expertise

Methodologies

Technologies

Interactive keyword display.

---

# FEATURED PUBLICATIONS

Display:

Title

Venue

Publication Year

Status

Authors

DOI

Citation Count

Abstract Preview

Quick View

View All

Sort:

Newest

Most Cited

Featured

Do not duplicate Publication module.

Reuse shared components.

---

# ACTIVE RESEARCH PROJECTS

Display:

Project Name

Role

Status

Funding

Timeline

Collaborators

Research Area

Quick View

---

# AWARDS & RECOGNITION

Display:

Awards

Honors

Scholarships

Grants

Professional Memberships

Editorial Roles

Conference Roles

Use visual hierarchy.

---

# RESEARCH ASSETS

Display:

Datasets

GitHub Repositories

Models

Benchmarks

Experiments

Presentations

Videos

Software

Everything should support preview.

---

# RESEARCH TIMELINE

Chronological timeline.

Examples:

Publication

↓

Award

↓

Project

↓

Grant

↓

Patent

↓

Professional Activity

↓

Research Milestone

Interactive.

---

# COLLABORATION

Display:

Current Collaborators

Institutions

Research Network

Research Domains

Future:

Collaboration Graph

Prepare architecture only.

---

# CONTACT

Display:

Institution Email

Website

ORCID

GitHub

LinkedIn (optional)

ResearchGate (optional)

Copy buttons

Open links

Never expose hidden information.

Respect backend privacy settings.

---

# PROFILE COMPLETION

Show progress.

Examples:

Photo Missing

Biography Missing

Research Interests Missing

No Publications

No Projects

Guide users toward completion.

---

# CV BUILDER

Create architecture for:

Generate Academic CV

PDF Export

DOCX Export

Institution Template

Modern Template

Compact Template

Do NOT generate templates yet.

Prepare reusable architecture.

---

# PROFILE EDIT EXPERIENCE

Allow:

Edit Biography

Update Position

Upload Photo

Research Interests

Contact Info

Visibility Settings

Autosave if backend supports it.

---

# PRIVACY

Respect backend visibility.

Support:

Public

Institution

Collaborators

Private

Never expose restricted information.

---

# RESPONSIVE DESIGN

Desktop

Laptop

Tablet

Phone

Profile should remain readable everywhere.

---

# ACCESSIBILITY

WCAG AA

Keyboard Navigation

Screen Readers

Semantic HTML

High Contrast

Reduced Motion

---

# PERFORMANCE

Lazy load:

Timeline

Assets

Charts

Metrics

Large publication lists

Optimize image loading.

---

# COMPONENTS

Create reusable components.

Examples:

<ProfileHero>

<ResearchSummary>

<InterestCloud>

<FeaturedPublicationCard>

<ProjectPreviewCard>

<AwardTimeline>

<ResearchMetrics>

<CollaborationCard>

<ContactPanel>

<ProfileCompletion>

<CVExportPanel>

<ResearchAssetGallery>

<TimelineSection>

Never duplicate components from other modules.

---

# TESTING

Test:

Profile Rendering

Privacy Rules

Responsive Design

Accessibility

Metrics

API Integration

Image Upload

Profile Editing

Export Actions

Error Handling

---

# QUALITY GATES

Execute:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Information Architecture

3. Profile Layout

4. Component Hierarchy

5. API Integration Summary

6. Privacy Strategy

7. Performance Strategy

8. Accessibility Review

9. Components Created

10. Files Created

11. Files Modified

12. Testing Results

13. Remaining Risks

14. Preparation for Sprint 15 Part 5

Only certify completion if:

• All quality gates pass

• Profile integrates with backend APIs

• Privacy settings are respected

• Components are reusable

• Accessibility is verified

• Responsive behavior is complete

• Clean Architecture is preserved

# RIOS Sprint 15 — Part 5

# Publications Workspace (Research Publication Management)

---

# ROLE

You are acting as:

• Principal Product Designer

• Principal UX Architect

• Senior Research Workflow Specialist

• Staff Frontend Engineer

• Information Architecture Expert

• Accessibility Specialist

• Next.js Enterprise Architect

Your responsibility is to build the complete publication management experience.

This module will become one of the most frequently used areas of RIOS.

Every design decision should reduce friction for researchers.

The experience should feel professional, fast and enjoyable.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Repository & Documentation Analysis (MANDATORY)

Before implementation scan the repository.

Read:

Sprint 15 Part 0

Sprint 15 Part 1

Sprint 15 Part 2

Sprint 15 Part 3

Sprint 15 Part 4

Read backend documentation.

Locate every document related to:

Publication APIs

Publication Domain

Publication DTOs

Publication Status

Research Projects

Research Assets

Timeline

Analytics

Search

Authentication

OpenAPI

Swagger

Prisma Schema

DDD documentation

Architecture documents

Repository interfaces

Application services

Controllers

Routes

Validation rules

Never invent fields.

Never invent API endpoints.

Never duplicate validation logic.

If backend APIs are incomplete:

Document missing contracts.

Do NOT guess.

---

# PHASE 2

# Understand The User Workflow

Before implementation understand the complete publication lifecycle.

Examples:

Research Idea

↓

Writing

↓

Draft

↓

Internal Review

↓

Supervisor Review

↓

Revision

↓

Submission

↓

Under Review

↓

Accepted

↓

Camera Ready

↓

Published

↓

Indexed

↓

Cited

The UI should naturally support this workflow.

---

# PHASE 3

# Publications Workspace Architecture

Design the workspace.

Navigation

↓

Toolbar

↓

Search

↓

Advanced Filters

↓

View Switcher

↓

Publication Table

↓

Publication Cards

↓

Publication Detail Drawer

↓

Publication Editor

↓

Version History

↓

Footer

---

# PHASE 4

# Workspace Navigation

Support:

All Publications

Drafts

Submitted

Under Review

Accepted

Published

Rejected

Archived

Favorites

Recently Updated

Custom Collections (future)

Never hardcode categories.

---

# PHASE 5

# Publications Table

Columns should include:

Title

Authors

Venue

Publication Type

Research Area

Status

Publication Year

DOI

Citation Count

Created

Updated

Quick Actions

Support:

Sorting

Filtering

Column Visibility

Pagination

Resizable Columns

Sticky Header

Bulk Selection

Bulk Actions

CSV Export (future)

No horizontal scrolling on standard desktop resolutions.

---

# PHASE 6

# Publication Cards

Support alternative views.

Card must display:

Title

Publication Type

Authors

Venue

Status Badge

Research Area

Publication Year

Citation Count

Quick Preview

Quick Edit

Pinned Indicator

Cards should be visually clean.

---

# PHASE 7

# Publication Detail Page

Create a complete detail experience.

Sections:

Overview

Abstract

Authors

Affiliations

Venue

Publisher

DOI

Keywords

Research Areas

Funding

Linked Project

Research Assets

Timeline

Version History

Citation Metrics

Related Publications

Activity History

Comments (future)

Every section should be independently reusable.

---

# PHASE 8

# Publication Editor

Support:

Create Publication

Edit Publication

Autosave (if backend supports)

Manual Save

Validation

Cancel

Draft Mode

Review Mode

Publication Status Transition

Do not duplicate backend validation.

Frontend validation should improve UX only.

---

# PHASE 9

# Author Management

Support:

Multiple Authors

Author Ordering

ORCID

Affiliations

Corresponding Author

Contribution Roles

Search Existing Authors

Create New Author

Reorder Authors

Drag & Drop (optional)

---

# PHASE 10

# Search Experience

Instant Search

Title Search

Keyword Search

DOI Search

Venue Search

Author Search

Research Area Search

Saved Filters (future)

Search should feel immediate.

---

# PHASE 11

# Advanced Filters

Support:

Status

Publication Type

Year

Venue

Research Area

Research Field

Project

Funding

Citation Count

Author

Sort:

Newest

Oldest

Most Cited

Alphabetical

Recently Updated

---

# PHASE 12

# Bulk Operations

Prepare architecture.

Support:

Delete

Archive

Export

Change Status

Assign Project

Assign Research Area

Future-proof implementation.

---

# PHASE 13

# Research Integration

Every publication may connect to:

Projects

Datasets

Experiments

Models

Presentations

Awards

Timeline

Analytics

Search

Profile

AI

Display these relationships.

Never duplicate information.

---

# PHASE 14

# Citation Metrics

Display if backend supports:

Citation Count

h-index Contribution

i10 Contribution

Impact Metrics

Trend

Never fabricate metrics.

---

# PHASE 15

# Empty States

Examples:

No Publications

No Drafts

No Search Results

No Favorites

No Citations

Guide users naturally.

Provide contextual actions.

---

# PHASE 16

# Loading States

Every view must include:

Skeletons

Loading Indicators

Optimistic Updates

Graceful Error Recovery

Avoid layout shifts.

---

# PHASE 17

# Accessibility

Support:

Keyboard Navigation

ARIA

Screen Readers

High Contrast

Semantic Tables

Reduced Motion

Accessible Forms

---

# PHASE 18

# Responsive Design

Desktop

Laptop

Tablet

Phone

Table becomes card layout on small screens.

Never lose functionality.

---

# PHASE 19

# Performance

Virtualize large lists.

Lazy load detail views.

Cache publication queries.

Prefetch detail pages.

Code split heavy editors.

Optimize re-renders.

---

# PHASE 20

# Components

Create reusable components.

Examples:

<PublicationWorkspace>

<PublicationTable>

<PublicationCard>

<PublicationDetail>

<PublicationEditor>

<PublicationForm>

<AuthorEditor>

<AuthorList>

<PublicationStatusBadge>

<PublicationToolbar>

<PublicationSearch>

<PublicationFilters>

<CitationMetricsCard>

<PublicationTimeline>

<PublicationRelationships>

<PublicationSkeleton>

Reuse shared components whenever possible.

Never duplicate.

---

# PHASE 21

# Testing

Create tests for:

Workspace

Search

Filters

Sorting

Pagination

CRUD

Status Changes

Editor

Validation

Relationships

Accessibility

Responsive Layout

Loading

Empty States

Error States

---

# QUALITY GATES

Before completion execute:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Workspace Architecture

3. Information Architecture

4. Publication Workflow

5. API Integration Summary

6. Component Hierarchy

7. State Management

8. Performance Strategy

9. Accessibility Review

10. Responsive Strategy

11. Components Created

12. Files Created

13. Files Modified

14. Testing Results

15. Remaining Risks

16. UX Improvements

17. Preparation for Sprint 15 Part 6

Only certify completion if:

• All quality gates pass

• Backend API contracts are respected

• No fake publication data exists

• Components are reusable

• Workspace is responsive

• Accessibility is verified

• Performance targets are met

• Clean Architecture remains intact

# RIOS Sprint 15 — Part 6

# Research Project Workspace & Research Lifecycle Management

---

# ROLE

You are acting as:

• Principal Product Designer

• Principal UX Architect

• Senior Research Management Consultant

• Principal Frontend Engineer

• Information Architecture Expert

• Enterprise Next.js Architect

• Accessibility Specialist

You are NOT building a generic project management page.

You are building an academic research project management platform.

Researchers should be able to manage an entire research project from idea to
publication without leaving this module.

Every interaction should reduce cognitive load.

Everything should feel intentional.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Documentation Analysis (MANDATORY)

Before implementation:

Scan the repository.

Read every relevant document.

Including:

Sprint 15 Part 0

Sprint 15 Part 1

Sprint 15 Part 2

Sprint 15 Part 3

Sprint 15 Part 4

Sprint 15 Part 5

Research Project APIs

Project Domain

Project DTOs

Project Status

Research Assets

Publications

Awards

Grants

Patents

Timeline

Analytics

Authentication

Search

AI APIs

Swagger

OpenAPI

Architecture Documents

DDD Documentation

Repository Interfaces

Application Services

Controllers

Routes

Validation Rules

Prisma Schema

Never assume.

Never invent APIs.

Never invent fields.

Never duplicate backend validation.

If missing:

Document missing contracts.

Never guess.

---

# PHASE 2

# Understand Academic Research Workflow

Understand how research projects evolve.

Examples:

Research Problem

↓

Literature Review

↓

Proposal

↓

Supervisor Approval

↓

Funding

↓

Data Collection

↓

Experimentation

↓

Analysis

↓

Writing

↓

Submission

↓

Publication

↓

Project Completed

The interface should naturally support this lifecycle.

---

# PHASE 3

# Workspace Architecture

Design the complete workspace.

Navigation

↓

Toolbar

↓

Project Dashboard

↓

Project Overview

↓

Research Timeline

↓

Milestones

↓

Tasks

↓

Publications

↓

Research Assets

↓

Team

↓

Funding

↓

Analytics

↓

Activity

↓

Settings

---

# PHASE 4

# Project Dashboard

Display:

Project Status

Completion Progress

Research Stage

Priority

Supervisor

Principal Investigator

Institution

Funding Status

Current Milestone

Upcoming Deadline

Linked Publications

Linked Assets

Recent Activity

Quick Actions

---

# PHASE 5

# Project List

Support:

Table View

Card View

Timeline View (future)

Columns:

Project Name

Status

Research Area

Principal Investigator

Institution

Funding

Progress

Created

Updated

Deadline

Support:

Sorting

Filtering

Pagination

Column Visibility

Bulk Selection

Bulk Actions

Sticky Headers

Search

---

# PHASE 6

# Project Detail

Sections:

Overview

Objectives

Research Questions

Hypotheses

Research Area

Research Field

Timeline

Milestones

Tasks

Team Members

Funding

Publications

Research Assets

Datasets

Experiments

Models

Patents

Awards

Professional Activities

Analytics

Activity Feed

Notes (future)

Every section should reuse existing modules.

Never duplicate information.

---

# PHASE 7

# Project Lifecycle

Support lifecycle visualization.

Examples:

Planning

↓

Proposal

↓

Active Research

↓

Writing

↓

Submission

↓

Completed

↓

Archived

Status transitions should come from backend.

Frontend only visualizes.

---

# PHASE 8

# Team Management

Support:

Principal Investigator

Supervisor

Researcher

Co-Researcher

Student

External Collaborator

Institution

Role

Contribution

Contact

Avatar

Never duplicate researcher profile.

Link existing profiles.

---

# PHASE 9

# Milestones

Support:

Proposal

Literature Review

Data Collection

Experiments

Analysis

Paper Draft

Submission

Acceptance

Publication

Custom Milestones

Future architecture:

Drag & Drop

Calendar

Gantt View

Only prepare architecture.

---

# PHASE 10

# Publications Integration

Display linked publications.

Support:

Add Existing

Remove

Quick View

Publication Status

Citation Count

DOI

Never duplicate publication UI.

Reuse shared components.

---

# PHASE 11

# Research Assets Integration

Support:

Datasets

GitHub

Software

Experiments

Models

Benchmarks

Videos

Presentations

Preview relationships.

Reuse shared components.

---

# PHASE 12

# Funding

Display:

Grant

Sponsor

Funding Agency

Amount

Currency

Status

Timeline

Documents (future)

Backend remains source of truth.

---

# PHASE 13

# Timeline

Interactive chronological visualization.

Include:

Project Created

Funding

Milestones

Publications

Datasets

Awards

Patents

Professional Activities

Completion

---

# PHASE 14

# Analytics

Display if backend supports:

Progress

Research Output

Publication Count

Dataset Count

Collaborators

Research Areas

Timeline

Completion Trend

Never fabricate metrics.

---

# PHASE 15

# Search

Support:

Project Name

Supervisor

Research Area

Research Field

Institution

Funding

Publication

Status

Keywords

Search should be instant.

---

# PHASE 16

# Filters

Support:

Status

Funding

Research Area

Institution

Research Field

Principal Investigator

Year

Priority

Sort:

Recently Updated

Newest

Oldest

Deadline

Alphabetical

---

# PHASE 17

# Empty States

Examples:

No Projects

No Milestones

No Funding

No Publications

No Assets

Guide users naturally.

Provide contextual actions.

---

# PHASE 18

# Loading States

Every major section should provide:

Skeletons

Optimistic Updates

Graceful Error Recovery

Avoid layout shifts.

---

# PHASE 19

# Accessibility

Keyboard Navigation

ARIA

Semantic HTML

Focus Management

Reduced Motion

Accessible Tables

Accessible Forms

---

# PHASE 20

# Responsive Design

Desktop

Laptop

Tablet

Phone

No functionality should disappear.

Tables become cards when necessary.

---

# PHASE 21

# Performance

Virtualize long project lists.

Lazy load analytics.

Lazy load timeline.

Cache project queries.

Prefetch detail pages.

Optimize re-renders.

---

# PHASE 22

# Components

Create reusable components.

<ProjectWorkspace>

<ProjectDashboard>

<ProjectOverview>

<ProjectTable>

<ProjectCard>

<ProjectLifecycle>

<ProjectTimeline>

<ProjectMilestones>

<ProjectTeam>

<ProjectFunding>

<ProjectAnalytics>

<ProjectActivity>

<ProjectSearch>

<ProjectFilters>

<ProjectToolbar>

<ProjectSkeleton>

<ProjectStatusBadge>

<ProjectQuickActions>

<ProjectHeader>

<ProjectSettings>

Reuse shared components whenever possible.

---

# PHASE 23

# Testing

Create tests for:

Workspace

CRUD

Project Lifecycle

Timeline

Team

Funding

Milestones

Relationships

Search

Filters

Sorting

Pagination

Accessibility

Responsive Design

Error States

Loading States

API Integration

---

# QUALITY GATES

Before completion execute:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Workspace Architecture

3. Research Workflow

4. Information Architecture

5. API Integration Summary

6. Component Hierarchy

7. State Management

8. Performance Strategy

9. Accessibility Review

10. Responsive Strategy

11. Components Created

12. Files Created

13. Files Modified

14. Testing Results

15. Remaining Risks

16. UX Improvements

17. Preparation for Sprint 15 Part 7

Only certify completion if:

• All quality gates pass

• Backend contracts are respected

• No fake project data exists

• Components are reusable

• Responsive behavior is verified

• Accessibility is verified

• Performance goals are met

• Clean Architecture remains intact

# RIOS Sprint 15 — Part 7

# Research Assets Workspace & Digital Research Repository

---

# ROLE

You are acting as:

• Principal Product Designer

• Principal UX Architect

• Digital Research Repository Expert

• Open Science Platform Consultant

• Principal Frontend Engineer

• Next.js Enterprise Architect

• Accessibility Specialist

Your responsibility is to build an enterprise-grade Research Asset Management
platform.

Researchers should be able to manage every research artifact created throughout
their research lifecycle.

This module must become the single source of truth for all digital research
outputs.

Every interaction should make asset discovery, organization and reuse
effortless.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Documentation Analysis (MANDATORY)

Before implementation scan the entire repository.

Read ALL documentation related to:

Sprint 15 Part 0

Sprint 15 Part 1

Sprint 15 Part 2

Sprint 15 Part 3

Sprint 15 Part 4

Sprint 15 Part 5

Sprint 15 Part 6

Research Assets Domain

Dataset APIs

Software APIs

Repository APIs

Experiment APIs

Benchmark APIs

Presentation APIs

Video APIs

External Resource APIs

Storage Architecture

Upload Services

Authentication

Authorization

Search

Analytics

Timeline

Swagger

OpenAPI

Prisma Schema

DDD Documentation

Architecture Documents

Application Services

Repository Interfaces

Controllers

Routes

Validation Rules

Background Job APIs

File Upload APIs

Never assume.

Never invent endpoints.

Never invent DTOs.

Never duplicate backend validation.

If any API contract is missing:

Document it clearly before implementation.

Do NOT guess.

---

# PHASE 2

# Understand The Research Asset Lifecycle

Understand how digital research assets evolve.

Examples:

Idea

↓

Dataset Collection

↓

Cleaning

↓

Annotation

↓

Experiment

↓

Training

↓

Evaluation

↓

Benchmark

↓

Paper Writing

↓

Publication

↓

Public Release

↓

Version Update

↓

Archive

↓

Reuse

↓

Citation

The UI should naturally support this lifecycle.

---

# PHASE 3

# Workspace Architecture

Navigation

↓

Toolbar

↓

Global Search

↓

Filters

↓

Collections

↓

Asset Browser

↓

Asset Detail

↓

Relationships

↓

Version History

↓

Preview

↓

Activity Feed

↓

Settings

---

# PHASE 4

# Asset Categories

Support:

Datasets

GitHub Repositories

Software Packages

Models

Experiments

Benchmarks

Presentations

Posters

Research Videos

Supplementary Materials

Documentation

External Links

Future categories must be configurable.

Never hardcode category logic.

---

# PHASE 5

# Asset Browser

Support:

Grid View

Table View

Gallery View

Compact View

Future:

Timeline View

Columns:

Name

Type

Version

Visibility

Research Area

Project

Publication

Owner

Created

Updated

Quick Actions

Support:

Sorting

Filtering

Pagination

Column Selection

Bulk Selection

Bulk Actions

Favorites

Pinned Assets

Recently Viewed

No layout breakage on common desktop resolutions.

---

# PHASE 6

# Asset Detail

Display:

Overview

Description

Metadata

Version

License

Checksum

Storage Provider

Related Publications

Related Projects

Related Experiments

Related Models

Related Benchmarks

Related Presentations

Related Videos

Downloads

Preview

Activity Timeline

Usage Statistics

Citation Information

Comments (future)

Every section should reuse shared components.

---

# PHASE 7

# Asset Upload Experience

Support:

Single Upload

Multiple Upload

Drag & Drop

Folder Upload (if backend supports)

Progress Indicators

Validation

Cancel Upload

Retry Upload

Resume Upload (if backend supports)

Virus Scan Status (future-ready)

Never lose upload progress unexpectedly.

---

# PHASE 8

# Version Management

Support:

Version History

Current Version

Release Notes

Semantic Version Display

Restore Version (if backend supports)

Compare Versions (future)

Never allow users to confuse versions.

---

# PHASE 9

# Relationships

Every asset may relate to:

Projects

Publications

Awards

Grants

Patents

Datasets

Experiments

Models

Repositories

Timeline

Analytics

Research Profile

Display relationships visually.

Never duplicate data.

---

# PHASE 10

# Search

Support:

Asset Name

Type

Keywords

License

Research Area

Research Field

Project

Publication

Author

Version

Storage Provider

Instant search.

---

# PHASE 11

# Filters

Support:

Asset Type

Research Area

Research Field

License

Visibility

Project

Publication

Owner

Version

Date

Sort:

Recently Updated

Newest

Oldest

Most Downloaded

Most Viewed

Alphabetical

---

# PHASE 12

# Preview Experience

Support preview where backend provides metadata.

Examples:

PDF

Image

Video

Markdown

Text

CSV

JSON

Code Snippets

If preview unavailable:

Display graceful fallback.

Never fake previews.

---

# PHASE 13

# Download Experience

Display:

Download

Copy Link

Citation

Checksum

File Size

Version

License

Only expose actions allowed by backend permissions.

---

# PHASE 14

# Empty States

Examples:

No Assets

No Datasets

No Models

No Videos

No Search Results

Guide researchers toward meaningful next actions.

---

# PHASE 15

# Loading States

Every major view should include:

Skeletons

Optimistic Updates (where appropriate)

Progress Indicators

Graceful Error Recovery

Avoid layout shifts.

---

# PHASE 16

# Accessibility

Support:

Keyboard Navigation

ARIA

Semantic HTML

Screen Readers

Reduced Motion

Accessible Upload Controls

Accessible Tables

Accessible Galleries

---

# PHASE 17

# Responsive Design

Desktop

Laptop

Tablet

Phone

Grid should adapt naturally.

Tables should become cards where necessary.

Uploads must remain usable on touch devices.

---

# PHASE 18

# Performance

Lazy load previews.

Virtualize large asset collections.

Cache queries.

Prefetch detail pages.

Optimize image loading.

Code split heavy viewers.

Avoid unnecessary renders.

---

# PHASE 19

# Components

Create reusable components.

Examples:

<AssetWorkspace>

<AssetBrowser>

<AssetTable>

<AssetGrid>

<AssetCard>

<AssetPreview>

<AssetViewer>

<AssetMetadata>

<AssetRelationships>

<AssetVersionHistory>

<UploadManager>

<UploadProgress>

<AssetSearch>

<AssetFilters>

<AssetToolbar>

<AssetHeader>

<AssetSkeleton>

<DownloadPanel>

<CitationPanel>

Reuse shared components whenever possible.

Never duplicate functionality.

---

# PHASE 20

# Testing

Create tests for:

Workspace

Upload

Download

Search

Filtering

Sorting

Pagination

Relationships

Version History

Preview

Responsive Design

Accessibility

Loading States

Error States

Permission Handling

API Integration

---

# QUALITY GATES

Before completion execute:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Workspace Architecture

3. Asset Lifecycle

4. Information Architecture

5. API Integration Summary

6. Upload Architecture

7. Version Management Strategy

8. Relationship Mapping

9. Performance Strategy

10. Accessibility Review

11. Responsive Strategy

12. Components Created

13. Files Created

14. Files Modified

15. Testing Results

16. Remaining Risks

17. UX Improvements

18. Preparation for Sprint 15 Part 8

Only certify completion if:

• All quality gates pass

• Backend API contracts are respected

• No fake asset data exists

• Upload workflows are resilient

• Components are reusable

• Accessibility requirements are met

• Performance goals are achieved

• Clean Architecture remains intact

# RIOS Sprint 15 — Part 8

# Academic Recognition Workspace

# Awards, Grants, Patents & Professional Activities

---

# ROLE

You are acting as:

• Principal Product Designer

• Academic Portfolio Architect

• Research Administration Consultant

• Senior UX Architect

• Principal Frontend Engineer

• Accessibility Specialist

• Next.js Enterprise Architect

Your responsibility is to build the complete Academic Recognition experience.

This module is not simply an administration page.

It is the academic achievement center of RIOS.

Every interaction should communicate credibility, professionalism and trust.

Researchers should feel proud sharing this page.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Documentation Analysis (MANDATORY)

Before implementation:

Scan the entire repository.

Read every relevant document.

Including:

Sprint 15 Part 0

Sprint 15 Part 1

Sprint 15 Part 2

Sprint 15 Part 3

Sprint 15 Part 4

Sprint 15 Part 5

Sprint 15 Part 6

Sprint 15 Part 7

Academic Recognition Domain

Award APIs

Grant APIs

Patent APIs

Professional Activity APIs

Timeline APIs

Analytics APIs

Profile APIs

Search APIs

Authentication

Authorization

Swagger

OpenAPI

Prisma Schema

Architecture Documents

DDD Documents

Repository Interfaces

Application Services

Controllers

Routes

Validation Rules

Never assume.

Never invent APIs.

Never invent DTOs.

Never duplicate backend validation.

If any backend contract is incomplete:

Document it before implementation.

Do NOT guess.

---

# PHASE 2

# Understand Academic Recognition Lifecycle

Understand how academic recognition evolves.

Examples:

Research Work

↓

Paper Published

↓

Conference Presentation

↓

Award

↓

Grant

↓

Patent

↓

Editorial Role

↓

Reviewer Invitation

↓

Professional Membership

↓

Keynote

↓

Career Advancement

The interface should naturally support this academic progression.

---

# PHASE 3

# Workspace Architecture

Navigation

↓

Toolbar

↓

Recognition Dashboard

↓

Awards

↓

Grants

↓

Patents

↓

Professional Activities

↓

Timeline

↓

Analytics

↓

Activity Feed

↓

Settings

---

# PHASE 4

# Recognition Dashboard

Display:

Total Awards

Active Grants

Patent Count

Professional Memberships

Editorial Roles

Reviewer Activities

Conference Roles

Invited Talks

Keynotes

Recognition Timeline

Recent Achievements

Upcoming Deadlines

Quick Actions

---

# PHASE 5

# Awards Module

Support:

Scholarships

Honors

Best Paper Awards

Research Awards

Teaching Awards

Fellowships

Medals

Institutional Awards

International Awards

Display:

Award Name

Category

Organization

Date

Country

Description

Certificate (if available)

Linked Publication

Linked Project

Linked Grant

Visibility

Status

---

# PHASE 6

# Grants Module

Support:

Government Grants

University Grants

Industry Funding

International Grants

Research Fellowships

Scholarships

Display:

Grant Number

Funding Agency

Sponsor

Amount

Currency

Status

Start Date

End Date

Principal Investigator

Collaborators

Funding Documents

Linked Projects

Linked Publications

Remaining Time

Progress

---

# PHASE 7

# Patent Module

Support:

Filed

Pending

Granted

Rejected

Expired

Display:

Patent Number

Title

Status

Country

Organization

Inventors

Application Date

Grant Date

Technology Area

Linked Publications

Linked Projects

Patent Documents

Timeline

---

# PHASE 8

# Professional Activities

Support:

Editorial Boards

Reviewer Assignments

Conference Chair

Session Chair

Workshop Organizer

Committee Member

Professional Membership

Invited Talk

Keynote

Seminar

Panel Discussion

Display:

Role

Organization

Conference

Institution

Country

Date

Duration

Certificate

Description

Visibility

---

# PHASE 9

# Search Experience

Support:

Awards

Grants

Patents

Organizations

Conference

Funding Agency

Country

Role

Keyword

Instant Search.

---

# PHASE 10

# Filtering

Support:

Award Category

Grant Status

Patent Status

Professional Activity Type

Organization

Country

Research Area

Research Field

Year

Sort:

Newest

Oldest

Alphabetical

Most Prestigious (if supported by backend metadata)

---

# PHASE 11

# Relationships

Display relationships with:

Projects

Publications

Research Assets

Timeline

Analytics

Research Profile

Collaborators

Institutions

Never duplicate information.

Reuse shared components.

---

# PHASE 12

# Recognition Timeline

Create chronological visualization.

Examples:

Award

↓

Grant

↓

Patent

↓

Conference

↓

Reviewer Assignment

↓

Editorial Role

↓

Professional Membership

↓

Keynote

Everything should integrate into the global Research Timeline.

---

# PHASE 13

# Analytics

Display if backend supports:

Awards by Year

Funding Trend

Patent Growth

Professional Activities

Recognition Timeline

International Activities

Countries

Organizations

Never fabricate analytics.

---

# PHASE 14

# Empty States

Examples:

No Awards

No Grants

No Patents

No Memberships

No Editorial Roles

Guide researchers toward meaningful actions.

---

# PHASE 15

# Loading States

Every major section should support:

Skeleton Loaders

Optimistic Updates (where appropriate)

Graceful Error Recovery

Avoid layout shifts.

---

# PHASE 16

# Accessibility

Support:

Keyboard Navigation

Screen Readers

ARIA

Semantic HTML

Reduced Motion

Accessible Tables

Accessible Forms

Accessible Timelines

---

# PHASE 17

# Responsive Design

Desktop

Laptop

Tablet

Phone

Tables become cards when appropriate.

Timeline adapts naturally.

No functionality should disappear.

---

# PHASE 18

# Performance

Virtualize long lists.

Cache recognition queries.

Prefetch detail pages.

Lazy load analytics.

Optimize timeline rendering.

Avoid unnecessary re-renders.

---

# PHASE 19

# Components

Create reusable components.

Examples:

<RecognitionWorkspace>

<RecognitionDashboard>

<AwardTable>

<AwardCard>

<GrantTable>

<GrantCard>

<PatentTimeline>

<PatentCard>

<ProfessionalActivityCard>

<RecognitionTimeline>

<FundingAnalytics>

<RecognitionSearch>

<RecognitionFilters>

<RecognitionToolbar>

<RecognitionSkeleton>

<AchievementBadge>

<CertificateViewer>

Reuse existing shared components whenever possible.

Never duplicate functionality.

---

# PHASE 20

# Testing

Create tests for:

Workspace

CRUD

Relationships

Timeline

Analytics

Search

Filtering

Sorting

Responsive Design

Accessibility

Loading States

Error States

Permission Handling

API Integration

---

# QUALITY GATES

Before completion execute:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Workspace Architecture

3. Academic Recognition Workflow

4. Information Architecture

5. API Integration Summary

6. Relationship Mapping

7. Performance Strategy

8. Accessibility Review

9. Responsive Strategy

10. Components Created

11. Files Created

12. Files Modified

13. Testing Results

14. Remaining Risks

15. UX Improvements

16. Preparation for Sprint 15 Part 9

Only certify completion if:

• All quality gates pass

• Backend API contracts are respected

• No fake recognition data exists

• Components are reusable

• Responsive behavior is verified

• Accessibility requirements are met

• Performance goals are achieved

• Clean Architecture remains intact

# RIOS Sprint 15 — Part 9

# Research Intelligence Center

# Analytics, Research Impact, Timeline & Collaboration Intelligence

---

# ROLE

You are acting as:

• Principal Product Designer

• Principal UX Researcher

• Research Intelligence Architect

• Data Visualization Expert

• Analytics Platform Engineer

• Frontend Architect

• Next.js Enterprise Expert

• Accessibility Specialist

Your responsibility is NOT to build another dashboard.

Your responsibility is to build an Academic Intelligence Platform.

The researcher should be able to understand years of research activity within
seconds.

Every visualization must answer an important question.

Never create charts only because charts look attractive.

Every chart must help decision making.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Documentation Analysis (MANDATORY)

Before implementation:

Scan the entire repository.

Read ALL documentation.

Especially:

Sprint 15 Parts 0–8

Research Intelligence APIs

Timeline APIs

Analytics APIs

Citation APIs

Publication APIs

Project APIs

Awards APIs

Research Asset APIs

Professional Activity APIs

Collaboration APIs

Institution APIs

Search APIs

AI APIs

Swagger

OpenAPI

Prisma Schema

Architecture Documents

DDD Documentation

Repository Interfaces

Application Services

Controllers

Routes

Validation Rules

Never invent analytics.

Never invent metrics.

Never calculate frontend metrics that already exist in backend.

Backend remains the source of truth.

If analytics APIs are incomplete:

Document them.

Do NOT guess.

---

# PHASE 2

# Understand Research Intelligence

Before implementation answer:

Why would a researcher visit this page?

What decisions should they make after viewing it?

What questions should the platform answer?

Examples:

Am I becoming more productive?

Which research areas are growing?

Who are my strongest collaborators?

What projects create the most impact?

How has my publication trend changed?

Where should I focus next?

Every visualization must answer a real research question.

---

# PHASE 3

# Workspace Architecture

Navigation

↓

Overview

↓

Research Metrics

↓

Citation Analytics

↓

Publication Trends

↓

Research Timeline

↓

Collaboration Network

↓

Institution History

↓

Research Domains

↓

Research Productivity

↓

Impact Analysis

↓

Activity Feed

↓

Insights

↓

Export

---

# PHASE 4

# Overview

Display:

Total Publications

Total Citations

h-index

i10-index

Projects

Research Assets

Awards

Patents

Professional Activities

Collaborators

Institutions

Research Years

Current Focus

Everything should come from backend.

---

# PHASE 5

# Citation Analytics

Display:

Citation Growth

Citation Trend

Most Cited Publications

Citation Distribution

Citation by Year

Citation Heatmap (if backend supports)

Top Impact Publications

Average Citations

Never fabricate metrics.

---

# PHASE 6

# Publication Analytics

Visualize:

Publications Per Year

Publication Status

Publication Types

Research Areas

Top Venues

Acceptance Rate (only if backend provides)

Publication Timeline

Interactive filtering.

---

# PHASE 7

# Research Productivity

Display:

Projects Per Year

Datasets Published

Models Released

Experiments Completed

Research Assets

Awards

Professional Activities

Trend indicators.

---

# PHASE 8

# Collaboration Network

Visualize:

Collaborators

Institutions

Research Groups

Frequent Co-authors

International Collaborations

Department Connections

Future-ready:

Interactive graph

Network expansion

Filtering

Only implement graph if backend supports required data.

---

# PHASE 9

# Research Timeline

Chronological visualization.

Include:

Projects

↓

Publications

↓

Awards

↓

Grants

↓

Patents

↓

Datasets

↓

Professional Activities

↓

Research Assets

↓

Milestones

↓

Institution Changes

Everything should integrate with the backend timeline.

---

# PHASE 10

# Institution History

Display:

Institution

Position

Duration

Research Area

Projects

Publications

Timeline

---

# PHASE 11

# Research Domains

Display:

Primary Domains

Secondary Domains

Keywords

Evolution Over Time

Technology Stack

Research Interests

Interactive visualizations where appropriate.

---

# PHASE 12

# Impact Analysis

Display:

Research Impact

Publication Impact

Project Impact

Award Timeline

Citation Growth

Research Visibility

International Reach

Never calculate unsupported metrics.

---

# PHASE 13

# Insights Panel

Display backend-generated insights only.

Examples:

Fastest Growing Research Area

Most Productive Year

Most Successful Collaboration

Most Influential Publication

Most Active Project

Recent Growth

Never invent AI insights.

Only display backend-generated information.

---

# PHASE 14

# Export

Prepare architecture for:

PDF

CSV

PNG

SVG

Share Link

Do not implement unsupported exports.

---

# PHASE 15

# Search & Filters

Support:

Date Range

Research Area

Publication Type

Project

Institution

Collaborator

Award

Grant

Sort:

Newest

Oldest

Highest Impact

Most Productive

Most Cited

---

# PHASE 16

# Empty States

Examples:

No Analytics

No Timeline

No Collaborators

No Publications

No Citation Data

Guide researchers toward generating useful data.

---

# PHASE 17

# Loading States

Support:

Skeleton Charts

Loading Metrics

Lazy Graph Rendering

Progressive Loading

Graceful Error Recovery

Avoid layout shifts.

---

# PHASE 18

# Accessibility

Charts must support:

Screen Readers

Keyboard Navigation

Text Alternatives

High Contrast

Reduced Motion

Accessible Data Tables

Every visualization must have a textual equivalent.

---

# PHASE 19

# Responsive Design

Desktop

Laptop

Tablet

Phone

Charts should adapt naturally.

Complex visualizations may simplify on mobile.

Never hide important information.

---

# PHASE 20

# Performance

Lazy load charts.

Virtualize activity feeds.

Cache analytics queries.

Memoize expensive visualizations.

Optimize graph rendering.

Avoid unnecessary renders.

---

# PHASE 21

# Components

Create reusable components.

Examples:

<IntelligenceWorkspace>

<ResearchMetrics>

<CitationChart>

<PublicationChart>

<ProductivityChart>

<ResearchTimeline>

<CollaborationGraph>

<InstitutionHistory>

<ImpactAnalysis>

<InsightPanel>

<ActivityFeed>

<AnalyticsToolbar>

<AnalyticsFilters>

<AnalyticsSkeleton>

<ChartContainer>

<MetricCard>

<TrendIndicator>

Reuse shared chart components.

Never duplicate chart logic.

---

# PHASE 22

# Data Visualization Guidelines

Use visualization types that match the data.

Examples:

Line Charts

Bar Charts

Area Charts

Scatter Charts

Timeline

Network Graph

Heatmap

Do NOT use pie charts unless they clearly improve understanding.

Always provide legends and labels.

Charts must remain understandable without animation.

---

# PHASE 23

# Testing

Create tests for:

Analytics Rendering

Timeline

Charts

Filters

Search

Export Actions

Accessibility

Responsive Design

Loading States

Error States

API Integration

Chart Interaction

Performance

---

# QUALITY GATES

Before completion execute:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Workspace Architecture

3. Information Architecture

4. Visualization Strategy

5. API Integration Summary

6. Component Hierarchy

7. Performance Strategy

8. Accessibility Review

9. Responsive Strategy

10. Components Created

11. Files Created

12. Files Modified

13. Testing Results

14. Remaining Risks

15. UX Improvements

16. Preparation for Sprint 15 Part 10

Only certify completion if:

• All quality gates pass

• Backend analytics remain the source of truth

• No fabricated metrics are displayed

• Visualizations are accessible

• Components are reusable

• Performance goals are achieved

• Clean Architecture remains intact

• Every visualization provides meaningful value

# RIOS Sprint 15 — Part 10

# Global Research Discovery & Universal Search Platform

---

# ROLE

You are acting as:

• Principal Product Designer

• Information Retrieval Architect

• Search UX Specialist

• Research Discovery Platform Expert

• Principal Frontend Engineer

• Next.js Enterprise Architect

• Accessibility Specialist

Your responsibility is to build a world-class research discovery experience.

This is NOT a simple search page.

This is the central discovery engine of RIOS.

Researchers should be able to find any information stored in the platform within
seconds.

The search experience should feel instantaneous, intelligent, and trustworthy.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Repository & Documentation Analysis (MANDATORY)

Before implementation, scan the entire repository.

Read all relevant documentation, including:

Sprint 15 Parts 0–9

Search APIs

Global Search Services

Indexing Services

Publication APIs

Project APIs

Research Asset APIs

Research Profile APIs

Award APIs

Grant APIs

Patent APIs

Professional Activity APIs

Timeline APIs

Analytics APIs

AI APIs

Authentication

Authorization

Swagger

OpenAPI

Prisma Schema

DDD Documentation

Architecture Documents

Repository Interfaces

Application Services

Controllers

Routes

Validation Rules

Search Infrastructure

Never invent:

• Search endpoints

• Filters

• Index structures

• Search ranking logic

Backend remains the source of truth.

If search functionality is incomplete:

Document missing contracts before implementation.

---

# PHASE 2

# Understand Discovery Goals

Before implementation answer:

What are researchers trying to discover?

What should global search solve?

What should be searchable?

What results deserve higher ranking?

How should users refine searches?

Every interaction should minimize the time required to locate information.

---

# PHASE 3

# Search Architecture

Design:

Global Search

↓

Quick Search

↓

Advanced Search

↓

Command Palette

↓

Search Results

↓

Filters

↓

Saved Searches

↓

Recent Searches

↓

Search History

↓

Search Insights

↓

Search Settings

---

# PHASE 4

# Global Search Experience

Provide a universal search input available throughout the application.

Support:

Keyboard Shortcut

Ctrl + K

Cmd + K

Search Everywhere

Instant Suggestions

Recent Searches

Pinned Results

Quick Navigation

Recently Viewed

Popular Items (if backend supports)

Search should feel immediate.

---

# PHASE 5

# Searchable Content

Support searching:

Researchers

Profiles

Publications

Projects

Datasets

Experiments

Models

Repositories

Research Assets

Awards

Grants

Patents

Professional Activities

Institutions

Research Areas

Keywords

Timeline Events

Documentation (if supported)

AI Knowledge Base (if supported)

Future search categories should be configurable.

---

# PHASE 6

# Search Results

Each result should display:

Title

Category

Description

Relevant Metadata

Highlight Matching Terms

Breadcrumb

Last Updated

Quick Actions

Relationships

Navigation Target

Results should be grouped by category where appropriate.

---

# PHASE 7

# Instant Search

Support:

Autocomplete

Suggestions

Recent Searches

Popular Searches (backend-supported)

Typo Tolerance (backend-supported)

Search History

Keyboard Navigation

Arrow Keys

Enter

Escape

Tab

The experience should remain usable without a mouse.

---

# PHASE 8

# Advanced Search

Support filters for:

Entity Type

Research Area

Research Field

Publication Type

Project Status

Award Category

Grant Status

Patent Status

Institution

Collaborator

Author

Owner

Visibility

Date Range

Keywords

Sort By:

Relevance

Newest

Oldest

Alphabetical

Recently Updated

Most Cited (if supported)

Highest Impact (if supported)

Do not invent ranking logic.

---

# PHASE 9

# Search Relationships

Search results should surface relationships.

Examples:

Publication

↓

Linked Project

↓

Linked Dataset

↓

Linked Grant

↓

Linked Award

↓

Research Profile

↓

Research Assets

Help users understand context before navigating.

---

# PHASE 10

# Command Palette

Design an application-wide command palette.

Support:

Open Page

Navigate to Workspace

Create Publication

Create Project

Upload Asset

View Profile

Open Dashboard

Search Entity

Open Settings

Theme Toggle

Future:

AI Commands

Everything should be keyboard-first.

---

# PHASE 11

# Saved Searches

Prepare architecture for:

Save Search

Rename

Delete

Favorite

Share (future)

Backend remains the source of truth.

---

# PHASE 12

# Search History

Display:

Recent Searches

Frequently Used Queries

Recently Opened Results

Clear History

Privacy Controls

Respect backend privacy settings.

---

# PHASE 13

# Empty States

Examples:

No Results

No Suggestions

No History

No Saved Searches

Provide contextual guidance.

Suggest filter adjustments where appropriate.

---

# PHASE 14

# Loading States

Support:

Instant Feedback

Skeleton Results

Progress Indicators

Graceful Error Recovery

Avoid layout shifts.

---

# PHASE 15

# Accessibility

Support:

Keyboard Navigation

ARIA

Semantic HTML

Screen Readers

Reduced Motion

Accessible Search Results

Accessible Command Palette

Every feature should be operable without a mouse.

---

# PHASE 16

# Responsive Design

Desktop

Laptop

Tablet

Phone

Search experience should remain consistent across devices.

Command palette should adapt naturally.

---

# PHASE 17

# Performance

Debounce search input.

Cancel stale requests.

Cache recent queries.

Prefetch likely destinations.

Virtualize large result lists.

Optimize rendering.

Avoid duplicate API requests.

Measure perceived latency.

---

# PHASE 18

# Components

Create reusable components.

Examples:

<GlobalSearch>

<SearchBar>

<SearchResults>

<SearchResultCard>

<SearchCategory>

<SearchFilters>

<AdvancedSearch>

<SearchSuggestions>

<SearchHistory>

<SavedSearchs>

<CommandPalette>

<QuickActions>

<SearchToolbar>

<SearchSkeleton>

<NoResults>

<HighlightedText>

Reuse shared components.

Never duplicate functionality.

---

# PHASE 19

# Testing

Create tests for:

Global Search

Autocomplete

Filters

Advanced Search

Command Palette

Keyboard Navigation

Accessibility

Responsive Design

Loading States

Error States

API Integration

Search Highlighting

Relationship Display

Navigation

Performance

---

# QUALITY GATES

Execute before completion:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Search Architecture

3. Information Retrieval Strategy

4. API Integration Summary

5. Search UX Decisions

6. Component Hierarchy

7. Performance Strategy

8. Accessibility Review

9. Responsive Strategy

10. Components Created

11. Files Created

12. Files Modified

13. Testing Results

14. Remaining Risks

15. Future Search Enhancements

16. Preparation for Sprint 15 Part 11

Only certify completion if:

• All quality gates pass

• Backend search contracts are respected

• No fake search results are displayed

• Search is keyboard-first

• Components are reusable

• Performance goals are achieved

• Accessibility is verified

• Clean Architecture remains intact

# RIOS Sprint 15 — Part 11

# AI Research Assistant & Knowledge Graph Experience

---

# ROLE

You are acting as:

• Principal AI Product Designer

• Principal UX Architect

• AI Interaction Designer

• RAG User Experience Specialist

• Knowledge Graph Product Architect

• Principal Frontend Engineer

• Enterprise Next.js Architect

• Accessibility Specialist

Your responsibility is NOT to build a chatbot.

Your responsibility is to build an AI-powered research workspace.

The assistant should become the researcher's daily companion for discovering
knowledge, understanding their own research portfolio, navigating RIOS, and
interacting with AI-powered capabilities.

Every interaction should feel intentional, transparent, and trustworthy.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Repository & Documentation Analysis (MANDATORY)

Before implementation, scan the entire repository.

Read all relevant documentation, including:

Sprint 15 Parts 0–10

AI Service APIs

Chat APIs

Streaming APIs

Conversation APIs

Knowledge Graph APIs

Research Intelligence APIs

Search APIs

Publication APIs

Project APIs

Research Asset APIs

Profile APIs

Analytics APIs

Timeline APIs

Authentication

Authorization

Swagger

OpenAPI

Prisma Schema

Architecture Documents

DDD Documentation

Repository Interfaces

Application Services

Controllers

Routes

Validation Rules

Never invent:

• AI endpoints

• Streaming protocols

• Message formats

• Citation structures

• Tool capabilities

Backend remains the source of truth.

If APIs are incomplete:

Document missing contracts before implementation.

Never guess.

---

# PHASE 2

# Understand The AI Experience

Before implementation answer:

Why will researchers open the AI workspace?

What problems should it solve?

When should AI answer?

When should AI redirect users to existing modules?

When should AI refuse because information is unavailable?

The assistant should enhance—not replace—the core application.

---

# PHASE 3

# AI Workspace Architecture

Conversation List

↓

New Conversation

↓

Chat Workspace

↓

Streaming Responses

↓

Retrieved Sources

↓

Knowledge Graph

↓

Suggested Actions

↓

Conversation History

↓

Pinned Conversations

↓

AI Task Center

↓

Settings

---

# PHASE 4

# Conversation Experience

Support:

New Chat

Rename Chat

Delete Chat

Pin Conversation

Search Conversations

Recent Conversations

Conversation Categories (future)

Archive (future)

Conversation history must synchronize with backend.

---

# PHASE 5

# Chat Experience

Support:

Markdown Rendering

Code Blocks

Tables

Mathematical Expressions (if supported)

Lists

Images (if backend supports)

Streaming Responses

Typing Indicators

Stop Generation

Retry Response

Copy Response

Regenerate

Message Feedback

Follow-up Suggestions

Every interaction should remain responsive.

---

# PHASE 6

# Knowledge Retrieval

When backend returns retrieved knowledge, display:

Source Title

Entity Type

Relevance

Preview

Navigation Link

Citation

Never fabricate retrieved documents.

Clearly distinguish:

Retrieved Information

vs.

AI-generated reasoning.

---

# PHASE 7

# Knowledge Graph

Visualize relationships when backend provides them.

Examples:

Publication

↓

Project

↓

Dataset

↓

Experiment

↓

Research Asset

↓

Grant

↓

Award

↓

Research Area

↓

Collaborator

↓

Institution

Support:

Expand Node

Collapse Node

Focus Node

Filter Relationships

Mini-map (future)

Only visualize backend-provided graph data.

---

# PHASE 8

# AI Suggested Actions

Allow backend-supported actions such as:

Open Publication

Open Project

Open Dataset

Open Profile

Open Timeline

Open Analytics

Navigate to Search Results

Create Draft (if backend supports)

Never invent unsupported actions.

---

# PHASE 9

# Context Awareness

The assistant should recognize current application context.

Examples:

Viewing Publication

↓

AI understands active publication context.

Viewing Project

↓

AI understands current project.

Viewing Research Asset

↓

AI understands selected asset.

Context comes only from backend/application state.

---

# PHASE 10

# AI Task Center

Prepare architecture for long-running tasks.

Examples:

Document Analysis

Research Summary

Citation Extraction

Dataset Analysis

Literature Review

Knowledge Graph Generation

Track:

Queued

Running

Completed

Failed

Cancelled

Display progress only if backend provides status.

---

# PHASE 11

# Prompt Experience

Support:

Suggested Prompts

Prompt History

Prompt Templates

Recent Prompts

Research Templates

Quick Actions

Users should never face an empty screen.

---

# PHASE 12

# Conversation Search

Support searching:

Conversation Title

Prompt

Response

Referenced Entity

Citation

Date

Search should be fast.

---

# PHASE 13

# AI Settings

Display backend-supported options only.

Examples:

Model Selection

Response Length

Streaming

Temperature

Context Window

Citation Display

Theme

Privacy

Never expose unsupported controls.

---

# PHASE 14

# Error Handling

Handle gracefully:

Streaming Interrupted

Network Failure

Permission Denied

Conversation Missing

Rate Limits

Backend Errors

Model Unavailable

Provide actionable recovery guidance.

---

# PHASE 15

# Empty States

Examples:

No Conversations

No AI Tasks

No Search Results

No Retrieved Sources

Offer suggested prompts and onboarding guidance.

---

# PHASE 16

# Loading States

Support:

Streaming Placeholder

Skeleton Messages

Progress Indicators

Graceful Retry

Avoid layout shifts.

---

# PHASE 17

# Accessibility

Support:

Keyboard Navigation

Screen Readers

ARIA

Reduced Motion

Semantic Chat Structure

Accessible Code Blocks

Accessible Tables

Accessible Graph Visualizations

Every streamed response should remain accessible.

---

# PHASE 18

# Responsive Design

Desktop

Laptop

Tablet

Phone

Conversation panel should collapse naturally.

Knowledge graph should degrade gracefully on smaller devices.

---

# PHASE 19

# Performance

Virtualize long conversations.

Lazy load conversation history.

Cache conversation metadata.

Cancel abandoned requests.

Optimize markdown rendering.

Memoize expensive visualizations.

Avoid unnecessary re-renders.

---

# PHASE 20

# Components

Create reusable components.

Examples:

<AIWorkspace>

<ConversationList>

<ConversationItem>

<ChatWindow>

<MessageBubble>

<MessageToolbar>

<StreamingMessage>

<CitationPanel>

<KnowledgeGraph>

<KnowledgeGraphNode>

<KnowledgeGraphEdge>

<AITaskCenter>

<TaskProgressCard>

<PromptTemplates>

<AISettings>

<ConversationSearch>

<SuggestedPrompts>

<FollowUpSuggestions>

<SourceCard>

<AIWorkspaceSkeleton>

Reuse shared UI components whenever possible.

Never duplicate functionality.

---

# PHASE 21

# User Experience Principles

The interface should:

Explain uncertainty.

Show citations whenever available.

Separate facts from AI-generated reasoning.

Never imply unsupported certainty.

Never fabricate backend information.

If backend cannot answer, explain why.

Maintain user trust.

---

# PHASE 22

# Testing

Create tests for:

Conversation Management

Streaming

Markdown Rendering

Knowledge Graph

Citation Display

Suggested Actions

Conversation Search

Task Center

Accessibility

Responsive Design

Loading States

Error States

API Integration

Performance

---

# QUALITY GATES

Execute before completion:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. AI Workspace Architecture

3. Conversation Architecture

4. Knowledge Graph Integration

5. API Integration Summary

6. State Management Strategy

7. Performance Strategy

8. Accessibility Review

9. Responsive Strategy

10. Components Created

11. Files Created

12. Files Modified

13. Testing Results

14. Remaining Risks

15. Future AI Enhancements

16. Preparation for Sprint 15 Part 12

Only certify completion if:

• All quality gates pass

• Backend APIs remain the source of truth

• No fabricated citations are displayed

• AI clearly distinguishes retrieved facts from generated reasoning

• Components are reusable

• Accessibility is verified

• Performance goals are achieved

• Clean Architecture remains intact

• The AI experience integrates naturally with every major RIOS module

# RIOS Sprint 15 — Part 12

# Public Research Portfolio & Researcher Showcase

---

# ROLE

You are acting as:

• Principal Product Designer

• Academic Portfolio Architect

• Information Architecture Expert

• Principal UX Designer

• Enterprise Frontend Engineer

• Next.js Architect

• Accessibility Specialist

• SEO Specialist

Your responsibility is NOT to build a profile page.

Your responsibility is to create a professional research website automatically
generated from RIOS.

This page should represent a researcher to the outside world.

Visitors should understand the researcher's identity within seconds.

The design should communicate:

Professionalism

Research Excellence

Trust

Clarity

Impact

Everything must be elegant.

Everything must feel intentional.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Documentation Analysis (MANDATORY)

Before implementation scan the repository.

Read:

Sprint 15 Parts 0–11

Public Profile APIs

Profile APIs

Publication APIs

Project APIs

Research Asset APIs

Award APIs

Grant APIs

Patent APIs

Professional Activity APIs

Analytics APIs

Timeline APIs

Visibility Rules

Privacy Rules

Authentication

Authorization

OpenAPI

Swagger

Prisma Schema

Architecture Documents

DDD Documentation

Repository Interfaces

Application Services

Controllers

Routes

Validation Rules

SEO Strategy (if documented)

Never invent APIs.

Never expose hidden data.

Never bypass backend visibility rules.

Backend permissions are the source of truth.

If any API contract is incomplete:

Document it.

Never guess.

---

# PHASE 2

# Understand The Audience

Before implementation answer:

Who visits this page?

What questions should be answered within:

5 seconds

30 seconds

2 minutes

The portfolio should naturally guide visitors from:

Identity

↓

Research Focus

↓

Research Impact

↓

Publications

↓

Projects

↓

Recognition

↓

Collaboration

↓

Contact

---

# PHASE 3

# Portfolio Architecture

Hero

↓

Research Overview

↓

Featured Publications

↓

Featured Projects

↓

Research Areas

↓

Research Impact

↓

Academic Recognition

↓

Research Assets

↓

Research Timeline

↓

Collaborators

↓

Testimonials (future)

↓

Contact

↓

Footer

---

# PHASE 4

# Hero Section

Display:

Professional Photo

Name

Academic Title

Institution

Department

Country

Research Fields

Short Biography

Current Research Focus

Availability for Collaboration

ORCID

Google Scholar

GitHub

Personal Website

Social Links (backend supported only)

CTA Buttons:

Download CV

View Publications

View Projects

Contact

Everything must respect privacy settings.

---

# PHASE 5

# Research Overview

Present a concise summary.

Examples:

Years of Research

Publication Count

Citation Count

Projects

Awards

Patents

Datasets

Software

Collaborators

Research Interests

Use elegant visual cards.

---

# PHASE 6

# Featured Publications

Highlight selected publications.

Display:

Title

Venue

Year

Authors

Abstract Preview

DOI

Citation Count

Research Area

View Details

Only show backend-approved public content.

---

# PHASE 7

# Featured Projects

Display:

Project Name

Summary

Research Area

Status

Institution

Collaborators

Linked Publications

Research Assets

Learn More

---

# PHASE 8

# Research Areas

Visualize:

Primary Areas

Secondary Areas

Keywords

Methodologies

Technologies

Visitors should immediately understand research expertise.

---

# PHASE 9

# Research Impact

Display backend-supported metrics only.

Examples:

Publications

Citations

h-index

i10-index

Awards

Projects

Datasets

Patents

International Collaborations

Never fabricate metrics.

---

# PHASE 10

# Academic Recognition

Display:

Awards

Grants

Patents

Editorial Roles

Reviewer Activities

Professional Memberships

Invited Talks

Conference Roles

Only public information.

---

# PHASE 11

# Research Assets

Display public assets.

Examples:

Datasets

Software

Models

Repositories

Presentations

Videos

Posters

Supplementary Materials

Allow previews where supported.

---

# PHASE 12

# Research Timeline

Display major milestones.

Examples:

Institution Changes

Projects

Publications

Awards

Grants

Patents

Professional Activities

Interactive but lightweight.

---

# PHASE 13

# Collaboration

Display:

Institutions

Research Groups

Selected Collaborators

Research Interests

Provide:

Collaborate CTA

Contact CTA

Never expose private collaborator information.

---

# PHASE 14

# Contact

Display only backend-approved contact methods.

Examples:

Institution Email

Professional Website

ORCID

GitHub

LinkedIn

ResearchGate

Never expose private email or phone numbers unless explicitly public.

---

# PHASE 15

# Privacy & Visibility

Every section must respect backend permissions.

Support visibility levels such as:

Public

Institution Only

Collaborators Only

Private

Frontend must never bypass backend restrictions.

---

# PHASE 16

# SEO & Discoverability

Prepare the frontend for:

Semantic HTML

Structured Data (Schema.org)

Open Graph metadata

Twitter/X Cards

Canonical URLs

Sitemap compatibility

Readable URLs

Meaningful page titles

Meta descriptions

Accessible heading hierarchy

Do not invent SEO metadata not provided by the backend where applicable.

---

# PHASE 17

# Sharing Experience

Support:

Copy Portfolio Link

Share Buttons

QR Code Architecture (future)

Print-Friendly Layout

PDF Export (if backend supports)

Prepare architecture only for unsupported features.

---

# PHASE 18

# Accessibility

Support:

Keyboard Navigation

ARIA

Semantic HTML

Screen Readers

High Contrast

Reduced Motion

Accessible Cards

Accessible Timeline

Accessible Charts

WCAG AA compliance.

---

# PHASE 19

# Responsive Design

Desktop

Laptop

Tablet

Phone

The portfolio should remain elegant across all screen sizes.

No important information should disappear on mobile.

---

# PHASE 20

# Performance

Optimize:

Image loading

Code splitting

Lazy loading

Caching

Font loading

Animation performance

Core Web Vitals

Avoid layout shifts.

---

# PHASE 21

# Components

Create reusable components.

Examples:

<PortfolioLayout>

<HeroSection>

<ResearchOverview>

<FeaturedPublicationGrid>

<FeaturedProjectGrid>

<ResearchImpactCards>

<RecognitionTimeline>

<ResearchAssetGallery>

<ResearchTimeline>

<CollaborationSection>

<ContactSection>

<PortfolioFooter>

<PortfolioSkeleton>

<SharePanel>

Reuse shared components wherever possible.

Never duplicate functionality.

---

# PHASE 22

# User Experience Principles

The portfolio should:

Load quickly.

Tell a coherent research story.

Highlight strengths without overwhelming visitors.

Encourage collaboration.

Maintain consistency with the authenticated application.

Present only verified backend-approved information.

---

# PHASE 23

# Testing

Create tests for:

Portfolio Rendering

Visibility Rules

Responsive Design

Accessibility

SEO Metadata

Structured Data

Navigation

Performance

Sharing

API Integration

Loading States

Error States

---

# QUALITY GATES

Execute before completion:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

Measure and report Core Web Vitals where tooling supports it.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Portfolio Architecture

3. Information Architecture

4. Audience Journey

5. API Integration Summary

6. Privacy & Visibility Strategy

7. SEO Strategy

8. Accessibility Review

9. Performance Strategy

10. Component Hierarchy

11. Components Created

12. Files Created

13. Files Modified

14. Testing Results

15. Remaining Risks

16. Future Enhancements

17. Preparation for Sprint 15 Part 13

Only certify completion if:

• All quality gates pass

• Backend visibility rules are fully respected

• No private data can be exposed

• SEO foundations are correctly implemented

• Components are reusable

• Accessibility is verified

• Performance goals are achieved

• Clean Architecture remains intact

• The portfolio presents a clear, compelling research narrative

# RIOS Sprint 15 — Part 13

# Researcher Control Center

# Settings, Security, Privacy & Personalization

---

# ROLE

You are acting as:

• Principal Product Designer

• Enterprise UX Architect

• Security UX Specialist

• Privacy by Design Consultant

• Principal Frontend Engineer

• Enterprise Next.js Architect

• Accessibility Specialist

Your responsibility is NOT to build another settings page.

Your responsibility is to build the complete researcher control center.

Every setting should be understandable.

Every security feature should inspire confidence.

Every preference should improve productivity.

The experience should feel modern, trustworthy and effortless.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Repository & Documentation Analysis (MANDATORY)

Before implementation scan the repository.

Read every relevant document.

Including:

Sprint 15 Parts 0–12

Settings APIs

Authentication APIs

Authorization APIs

Profile APIs

Notification APIs

Security APIs

Session APIs

Privacy APIs

User Preference APIs

Theme APIs

Organization APIs

Connected Account APIs

AI Preference APIs

Search Preference APIs

Swagger

OpenAPI

Prisma Schema

Architecture Documents

DDD Documentation

Repository Interfaces

Application Services

Controllers

Routes

Validation Rules

Never invent:

Endpoints

Settings

Permissions

Validation

Security capabilities

Backend remains the source of truth.

If contracts are incomplete:

Document them before implementation.

Never guess.

---

# PHASE 2

# User Goals

Before implementation answer:

What settings do researchers expect?

Which settings affect daily productivity?

Which settings are security critical?

Which settings should be easy to discover?

How can the interface reduce mistakes?

---

# PHASE 3

# Settings Architecture

Navigation

↓

Profile

↓

Account

↓

Security

↓

Privacy

↓

Notifications

↓

Appearance

↓

Accessibility

↓

Research Preferences

↓

Connected Accounts

↓

AI Preferences

↓

Sessions

↓

Data & Export

↓

Danger Zone

---

# PHASE 4

# Profile Settings

Support editing:

Profile Photo

Name

Academic Title

Institution

Department

Biography

Research Areas

Research Interests

Languages

Website

Contact Information

Availability

Visibility

Profile Completion

Respect backend validation.

---

# PHASE 5

# Account Settings

Display:

Email

Username

Account Status

Verification Status

Account Creation Date

Last Login

Subscription/Plan (if backend supports)

Allow:

Change Email

Change Username

Verify Email

Only expose supported actions.

---

# PHASE 6

# Security Center

Support:

Change Password

Two-Factor Authentication (if supported)

Recovery Methods

Trusted Devices

Recent Security Events

Password Strength

Security Recommendations

Never expose unsupported features.

---

# PHASE 7

# Active Sessions

Display:

Current Device

Browser

Operating System

Location (if backend provides)

IP Address (if backend permits)

Last Active

Support:

Terminate Session

Terminate All Other Sessions

Refresh Session

Display confirmation dialogs for destructive actions.

---

# PHASE 8

# Privacy Controls

Support backend-defined visibility settings.

Examples:

Profile Visibility

Publication Visibility

Project Visibility

Research Asset Visibility

Award Visibility

Analytics Visibility

Contact Visibility

Search Visibility

Explain each setting clearly.

---

# PHASE 9

# Notification Center

Support:

Email Notifications

In-App Notifications

Research Updates

Publication Updates

Project Updates

Grant Deadlines

Award Reminders

AI Notifications

Security Alerts

System Announcements

Respect backend notification capabilities.

---

# PHASE 10

# Appearance

Support:

Light Theme

Dark Theme

System Theme

Density (if supported)

Sidebar Preferences

Layout Preferences

Animation Preferences

Persist settings across devices if backend supports it.

---

# PHASE 11

# Accessibility Preferences

Support backend and frontend capabilities.

Examples:

Reduced Motion

High Contrast

Font Scaling

Keyboard Shortcuts

Focus Indicators

Explain each option.

---

# PHASE 12

# Research Preferences

Display backend-supported preferences.

Examples:

Default Research Area

Preferred Citation Style

Preferred Language

Default Dashboard

Search Preferences

Publication Preferences

Export Preferences

Do not invent unsupported preferences.

---

# PHASE 13

# Connected Accounts

Display only backend-supported integrations.

Examples:

ORCID

GitHub

Google Scholar

ResearchGate

Institution SSO

University Account

Support:

Connect

Disconnect

Reconnect

Connection Status

Last Sync (if supported)

Never imply synchronization that the backend does not provide.

---

# PHASE 14

# AI Preferences

Display backend-supported controls only.

Examples:

Preferred AI Model

Streaming Responses

Citation Display

Conversation History

Suggested Prompts

AI Privacy Settings

Do not expose unsupported controls.

---

# PHASE 15

# Data Management

Support backend-approved actions.

Examples:

Export Profile

Export Publications

Export Projects

Export Research Assets

Download Personal Data

Prepare architecture for GDPR or similar privacy workflows if supported by the
backend.

Never implement unsupported exports.

---

# PHASE 16

# Danger Zone

Group destructive actions separately.

Examples:

Delete Account

Deactivate Account

Remove Connected Accounts

Reset Preferences

Delete AI History (if supported)

Require confirmation.

Explain consequences.

Never make destructive actions easy to trigger accidentally.

---

# PHASE 17

# Search

Support searching settings.

Examples:

Password

Theme

Notifications

Privacy

Sessions

Profile

Search should immediately navigate to matching settings.

---

# PHASE 18

# Loading & Error States

Every settings section should include:

Skeletons

Loading Indicators

Optimistic Updates (where appropriate)

Graceful Error Recovery

Validation Messages

Avoid layout shifts.

---

# PHASE 19

# Accessibility

Support:

Keyboard Navigation

ARIA

Semantic HTML

Screen Readers

Reduced Motion

Accessible Forms

Accessible Dialogs

WCAG AA compliance.

---

# PHASE 20

# Responsive Design

Desktop

Laptop

Tablet

Phone

Settings navigation should adapt naturally.

No functionality should disappear on mobile.

---

# PHASE 21

# Performance

Lazy load rarely used sections.

Cache preference queries.

Minimize unnecessary renders.

Code split heavy modules.

Optimize form performance.

---

# PHASE 22

# Components

Create reusable components.

Examples:

<SettingsLayout>

<ProfileSettings>

<AccountSettings>

<SecurityCenter>

<SessionManager>

<PrivacyControls>

<NotificationPreferences>

<AppearanceSettings>

<AccessibilitySettings>

<ResearchPreferences>

<ConnectedAccounts>

<AISettings>

<DataExportPanel>

<DangerZone>

<SettingsSearch>

<SettingsSkeleton>

Reuse shared form components.

Never duplicate functionality.

---

# PHASE 23

# Testing

Create tests for:

Settings Navigation

Profile Updates

Security Actions

Privacy Controls

Session Management

Notifications

Appearance

Accessibility

Connected Accounts

AI Preferences

Search

Responsive Design

Loading States

Error States

API Integration

Permission Handling

---

# QUALITY GATES

Execute before completion:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Settings Architecture

3. Information Architecture

4. Security Strategy

5. Privacy Strategy

6. API Integration Summary

7. Component Hierarchy

8. Performance Strategy

9. Accessibility Review

10. Responsive Strategy

11. Components Created

12. Files Created

13. Files Modified

14. Testing Results

15. Remaining Risks

16. UX Improvements

17. Preparation for Sprint 15 Part 14

Only certify completion if:

• All quality gates pass

• Backend permissions are respected

• No unsupported settings are exposed

• Components are reusable

• Accessibility is verified

• Performance goals are achieved

• Privacy rules are enforced

• Clean Architecture remains intact

# RIOS Sprint 15 — Part 13

# Researcher Control Center

# Settings, Security, Privacy & Personalization

---

# ROLE

You are acting as:

• Principal Product Designer

• Enterprise UX Architect

• Security UX Specialist

• Privacy by Design Consultant

• Principal Frontend Engineer

• Enterprise Next.js Architect

• Accessibility Specialist

Your responsibility is NOT to build another settings page.

Your responsibility is to build the complete researcher control center.

Every setting should be understandable.

Every security feature should inspire confidence.

Every preference should improve productivity.

The experience should feel modern, trustworthy and effortless.

---

# ABSOLUTE RULE

DO NOT WRITE CODE IMMEDIATELY.

---

# PHASE 1

# Repository & Documentation Analysis (MANDATORY)

Before implementation scan the repository.

Read every relevant document.

Including:

Sprint 15 Parts 0–12

Settings APIs

Authentication APIs

Authorization APIs

Profile APIs

Notification APIs

Security APIs

Session APIs

Privacy APIs

User Preference APIs

Theme APIs

Organization APIs

Connected Account APIs

AI Preference APIs

Search Preference APIs

Swagger

OpenAPI

Prisma Schema

Architecture Documents

DDD Documentation

Repository Interfaces

Application Services

Controllers

Routes

Validation Rules

Never invent:

Endpoints

Settings

Permissions

Validation

Security capabilities

Backend remains the source of truth.

If contracts are incomplete:

Document them before implementation.

Never guess.

---

# PHASE 2

# User Goals

Before implementation answer:

What settings do researchers expect?

Which settings affect daily productivity?

Which settings are security critical?

Which settings should be easy to discover?

How can the interface reduce mistakes?

---

# PHASE 3

# Settings Architecture

Navigation

↓

Profile

↓

Account

↓

Security

↓

Privacy

↓

Notifications

↓

Appearance

↓

Accessibility

↓

Research Preferences

↓

Connected Accounts

↓

AI Preferences

↓

Sessions

↓

Data & Export

↓

Danger Zone

---

# PHASE 4

# Profile Settings

Support editing:

Profile Photo

Name

Academic Title

Institution

Department

Biography

Research Areas

Research Interests

Languages

Website

Contact Information

Availability

Visibility

Profile Completion

Respect backend validation.

---

# PHASE 5

# Account Settings

Display:

Email

Username

Account Status

Verification Status

Account Creation Date

Last Login

Subscription/Plan (if backend supports)

Allow:

Change Email

Change Username

Verify Email

Only expose supported actions.

---

# PHASE 6

# Security Center

Support:

Change Password

Two-Factor Authentication (if supported)

Recovery Methods

Trusted Devices

Recent Security Events

Password Strength

Security Recommendations

Never expose unsupported features.

---

# PHASE 7

# Active Sessions

Display:

Current Device

Browser

Operating System

Location (if backend provides)

IP Address (if backend permits)

Last Active

Support:

Terminate Session

Terminate All Other Sessions

Refresh Session

Display confirmation dialogs for destructive actions.

---

# PHASE 8

# Privacy Controls

Support backend-defined visibility settings.

Examples:

Profile Visibility

Publication Visibility

Project Visibility

Research Asset Visibility

Award Visibility

Analytics Visibility

Contact Visibility

Search Visibility

Explain each setting clearly.

---

# PHASE 9

# Notification Center

Support:

Email Notifications

In-App Notifications

Research Updates

Publication Updates

Project Updates

Grant Deadlines

Award Reminders

AI Notifications

Security Alerts

System Announcements

Respect backend notification capabilities.

---

# PHASE 10

# Appearance

Support:

Light Theme

Dark Theme

System Theme

Density (if supported)

Sidebar Preferences

Layout Preferences

Animation Preferences

Persist settings across devices if backend supports it.

---

# PHASE 11

# Accessibility Preferences

Support backend and frontend capabilities.

Examples:

Reduced Motion

High Contrast

Font Scaling

Keyboard Shortcuts

Focus Indicators

Explain each option.

---

# PHASE 12

# Research Preferences

Display backend-supported preferences.

Examples:

Default Research Area

Preferred Citation Style

Preferred Language

Default Dashboard

Search Preferences

Publication Preferences

Export Preferences

Do not invent unsupported preferences.

---

# PHASE 13

# Connected Accounts

Display only backend-supported integrations.

Examples:

ORCID

GitHub

Google Scholar

ResearchGate

Institution SSO

University Account

Support:

Connect

Disconnect

Reconnect

Connection Status

Last Sync (if supported)

Never imply synchronization that the backend does not provide.

---

# PHASE 14

# AI Preferences

Display backend-supported controls only.

Examples:

Preferred AI Model

Streaming Responses

Citation Display

Conversation History

Suggested Prompts

AI Privacy Settings

Do not expose unsupported controls.

---

# PHASE 15

# Data Management

Support backend-approved actions.

Examples:

Export Profile

Export Publications

Export Projects

Export Research Assets

Download Personal Data

Prepare architecture for GDPR or similar privacy workflows if supported by the
backend.

Never implement unsupported exports.

---

# PHASE 16

# Danger Zone

Group destructive actions separately.

Examples:

Delete Account

Deactivate Account

Remove Connected Accounts

Reset Preferences

Delete AI History (if supported)

Require confirmation.

Explain consequences.

Never make destructive actions easy to trigger accidentally.

---

# PHASE 17

# Search

Support searching settings.

Examples:

Password

Theme

Notifications

Privacy

Sessions

Profile

Search should immediately navigate to matching settings.

---

# PHASE 18

# Loading & Error States

Every settings section should include:

Skeletons

Loading Indicators

Optimistic Updates (where appropriate)

Graceful Error Recovery

Validation Messages

Avoid layout shifts.

---

# PHASE 19

# Accessibility

Support:

Keyboard Navigation

ARIA

Semantic HTML

Screen Readers

Reduced Motion

Accessible Forms

Accessible Dialogs

WCAG AA compliance.

---

# PHASE 20

# Responsive Design

Desktop

Laptop

Tablet

Phone

Settings navigation should adapt naturally.

No functionality should disappear on mobile.

---

# PHASE 21

# Performance

Lazy load rarely used sections.

Cache preference queries.

Minimize unnecessary renders.

Code split heavy modules.

Optimize form performance.

---

# PHASE 22

# Components

Create reusable components.

Examples:

<SettingsLayout>

<ProfileSettings>

<AccountSettings>

<SecurityCenter>

<SessionManager>

<PrivacyControls>

<NotificationPreferences>

<AppearanceSettings>

<AccessibilitySettings>

<ResearchPreferences>

<ConnectedAccounts>

<AISettings>

<DataExportPanel>

<DangerZone>

<SettingsSearch>

<SettingsSkeleton>

Reuse shared form components.

Never duplicate functionality.

---

# PHASE 23

# Testing

Create tests for:

Settings Navigation

Profile Updates

Security Actions

Privacy Controls

Session Management

Notifications

Appearance

Accessibility

Connected Accounts

AI Preferences

Search

Responsive Design

Loading States

Error States

API Integration

Permission Handling

---

# QUALITY GATES

Execute before completion:

pnpm lint

pnpm typecheck

pnpm test

pnpm build

All must pass.

---

# FINAL REPORT

Provide:

1. Executive Summary

2. Settings Architecture

3. Information Architecture

4. Security Strategy

5. Privacy Strategy

6. API Integration Summary

7. Component Hierarchy

8. Performance Strategy

9. Accessibility Review

10. Responsive Strategy

11. Components Created

12. Files Created

13. Files Modified

14. Testing Results

15. Remaining Risks

16. UX Improvements

17. Preparation for Sprint 15 Part 14

Only certify completion if:

• All quality gates pass

• Backend permissions are respected

• No unsupported settings are exposed

• Components are reusable

• Accessibility is verified

• Performance goals are achieved

• Privacy rules are enforced

• Clean Architecture remains intact
