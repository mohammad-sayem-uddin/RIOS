# 04 — Frontend Engineering

**Version:** 1.0  
**Status:** Normative  
**Parent:** RIOS Master Architecture Blueprint (MAB)  
**Cross-References:** Volume V (Visualization), Volume VI (Motion), ADR-001,
Constitution §2

---

## 1. Purpose

This document defines the frontend engineering standards for RIOS. The frontend
is the primary interface through which researchers interact with their Research
Identity, Knowledge, and Narrative domains.

---

## 2. Technology Stack

| Layer             | Technology                   | Version           | Purpose                             |
| ----------------- | ---------------------------- | ----------------- | ----------------------------------- |
| Framework         | Next.js                      | 15.x (App Router) | SSR/SSG, routing, Server Components |
| UI Library        | React                        | 19.x              | Component-based UI                  |
| Styling           | Tailwind CSS                 | 4.x               | Utility-first CSS                   |
| Component Library | Radix UI                     | Latest            | Accessible, unstyled primitives     |
| State Management  | Zustand                      | Latest            | Lightweight client state            |
| Data Fetching     | TanStack Query (React Query) | 5.x               | Server state management             |
| Forms             | React Hook Form              | 7.x               | Form state and validation           |
| Schema Validation | Zod                          | Latest            | Runtime type validation             |
| Icons             | Lucide React                 | Latest            | Icon system                         |
| Animation         | Framer Motion                | Latest            | UI animations (Volume VI)           |
| Charts            | Recharts / D3.js             | Latest            | Data visualization (Volume V)       |

---

## 3. App Router Architecture

### 3.1 Route Structure

```
apps/web/src/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Global styles
│   │
│   ├── (auth)/                       # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/                  # Authenticated routes
│   │   ├── layout.tsx                # Dashboard layout
│   │   │
│   │   ├── identity/                 # Identity domain pages
│   │   │   ├── page.tsx              # Identity overview
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx          # Specific identity view
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx      # Edit identity
│   │   │   └── layout.tsx
│   │   │
│   │   ├── knowledge/                # Knowledge domain pages
│   │   │   ├── page.tsx              # Knowledge overview
│   │   │   ├── agendas/
│   │   │   │   └── page.tsx
│   │   │   ├── areas/
│   │   │   │   └── page.tsx
│   │   │   ├── questions/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── narrative/                # Narrative domain pages
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── publication/              # Publication domain pages
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── visualization/            # Visualization domain pages (Volume V)
│   │   │   ├── page.tsx
│   │   │   ├── graphs/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── motion/                   # Motion domain pages (Volume VI)
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── evolution/                # Evolution domain pages
│   │   │   ├── page.tsx
│   │   │   ├── timeline/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── api/                          # API routes (Next.js BFF if needed)
│   │   └── health/
│   │       └── route.ts
│   │
│   └── not-found.tsx                 # 404 page
```

---

## 4. Component Architecture

### 4.1 Component Hierarchy

```
components/
├── ui/                               # Design system primitives (@rios/ui)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Dialog.tsx
│   ├── DropdownMenu.tsx
│   ├── Tabs.tsx
│   ├── Toast.tsx
│   ├── Tooltip.tsx
│   ├── Badge.tsx
│   ├── Avatar.tsx
│   ├── Skeleton.tsx
│   ├── Separator.tsx
│   ├── Select.tsx
│   ├── Textarea.tsx
│   ├── Checkbox.tsx
│   ├── Switch.tsx
│   ├── Table.tsx
│   ├── Pagination.tsx
│   ├── Breadcrumb.tsx
│   ├── Command.tsx
│   ├── Popover.tsx
│   └── index.ts                      # Barrel export
│
├── layout/                           # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   ├── PageContainer.tsx
│   ├── PageHeader.tsx
│   └── MobileNav.tsx
│
├── shared/                           # Shared feature components
│   ├── SearchBar.tsx
│   ├── NotificationBell.tsx
│   ├── UserMenu.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorFallback.tsx
│   ├── EmptyState.tsx
│   ├── ConfirmDialog.tsx
│   └── Pagination.tsx
│
├── features/                         # Domain-specific feature components
│   ├── identity/
│   │   ├── IdentityCard.tsx
│   │   ├── IntellectualDirection.tsx
│   │   ├── ResearchMaturity.tsx
│   │   ├── EvidenceTimeline.tsx
│   │   └── IdentityForm.tsx
│   │
│   ├── knowledge/
│   │   ├── AgendaList.tsx
│   │   ├── AreaCard.tsx
│   │   ├── QuestionTree.tsx
│   │   ├── EvidenceChain.tsx
│   │   └── KnowledgeGraph.tsx
│   │
│   ├── narrative/
│   │   ├── NarrativeEditor.tsx
│   │   ├── NarrativePreview.tsx
│   │   └── NarrativeVersions.tsx
│   │
│   ├── publication/
│   │   ├── PublicationList.tsx
│   │   ├── PublicationCard.tsx
│   │   ├── CitationGraph.tsx
│   │   └── PublicationForm.tsx
│   │
│   ├── visualization/
│   │   ├── KnowledgeMap.tsx
│   │   ├── RelationshipGraph.tsx
│   │   ├── TimelineView.tsx
│   │   └── NetworkDiagram.tsx
│   │
│   └── evolution/
│       ├── EvolutionTimeline.tsx
│       ├── MaturityChart.tsx
│       └── GrowthMetrics.tsx
│
└── providers/                        # Context providers
    ├── AuthProvider.tsx
    ├── ThemeProvider.tsx
    ├── QueryProvider.tsx
    └── ToastProvider.tsx
```

### 4.2 Component Rules

| ID      | Rule                                                                  | Source                       |
| ------- | --------------------------------------------------------------------- | ---------------------------- |
| CMP-001 | UI primitives in `components/ui/` are domain-agnostic                 | Design system isolation      |
| CMP-002 | Feature components map 1:1 to domain concepts                         | DDM domain mapping           |
| CMP-003 | Server Components are the default; Client Components only when needed | Next.js 15 best practice     |
| CMP-004 | Client Components prefixed with `'use client'` directive              | Next.js 15                   |
| CMP-005 | Components MUST be accessible (WCAG 2.1 AA)                           | Quality attribute priority 7 |
| CMP-006 | Components MUST have TypeScript props interfaces                      | Type safety                  |
| CMP-007 | Domain-specific components MUST NOT import from other domains         | Domain boundary enforcement  |

---

## 5. Server Components vs Client Components

### 5.1 Decision Matrix

| Aspect              | Server Component             | Client Component            |
| ------------------- | ---------------------------- | --------------------------- |
| Data fetching       | ✅ Direct async/await        | ❌ Requires hook (useQuery) |
| Database access     | ✅ Direct                    | ❌ Via API only             |
| Event handlers      | ❌ Not supported             | ✅ Required                 |
| State (useState)    | ❌ Not supported             | ✅ Required                 |
| Effects (useEffect) | ❌ Not supported             | ✅ Required                 |
| Browser APIs        | ❌ Not available             | ✅ Available                |
| Bundle impact       | ❌ Zero (not sent to client) | ✅ Included in bundle       |

### 5.2 Component Classification

| Component              | Type   | Rationale                            |
| ---------------------- | ------ | ------------------------------------ |
| Identity overview page | Server | Read-only projection display         |
| Identity edit form     | Client | Form state, validation, submission   |
| Knowledge graph        | Client | Interactive, uses D3/canvas          |
| Publication list       | Server | Read-only list from projection       |
| Search bar             | Client | Input handling, debouncing           |
| Navigation             | Server | Static navigation structure          |
| Notification bell      | Client | Real-time updates, polling           |
| Timeline view          | Client | Interactive, animations              |
| Error boundaries       | Client | React error boundary requires client |
| Loading states         | Client | Suspense requires client boundary    |

### 5.3 Data Fetching Pattern (Server Components)

```tsx
// apps/web/src/app/(dashboard)/identity/page.tsx

import { getResearchIdentity } from '@/lib/api/identity';
import { IdentityCard } from '@/components/features/identity/IdentityCard';
import { IntellectualDirection } from '@/components/features/identity/IntellectualDirection';

// Server Component — no 'use client' directive
export default async function IdentityPage() {
  // Direct data fetching on server
  const identity = await getResearchIdentity();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Research Identity</h1>
      <IdentityCard identity={identity} />
      <IntellectualDirection directions={identity.intellectualDirections} />
    </div>
  );
}
```

### 5.4 Data Fetching Pattern (Client Components)

```tsx
// apps/web/src/components/features/identity/IdentityForm.tsx

'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const identitySchema = z.object({
  directions: z.array(z.string()).min(1, 'At least one direction required'),
});

type IdentityFormData = z.infer<typeof identitySchema>;

export function IdentityForm({ identityId }: { identityId: string }) {
  const { data: identity } = useQuery({
    queryKey: ['identity', identityId],
    queryFn: () => fetchIdentity(identityId),
  });

  const mutation = useMutation({
    mutationFn: updateIdentity,
    onSuccess: () => {
      // Invalidate and refetch
    },
  });

  const form = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    defaultValues: { directions: identity?.directions ?? [] },
  });

  return (
    <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))}>
      {/* Form fields */}
    </form>
  );
}
```

---

## 6. State Management

### 6.1 State Categories

| Category     | Tool                 | Scope               | Persistence                    |
| ------------ | -------------------- | ------------------- | ------------------------------ |
| Server state | TanStack Query       | API data            | Cache (stale-while-revalidate) |
| Client state | Zustand              | UI state            | In-memory (or localStorage)    |
| Form state   | React Hook Form      | Form data           | Per-form                       |
| URL state    | Next.js searchParams | Filters, pagination | URL                            |
| Theme state  | React Context        | Dark/light mode     | localStorage                   |

### 6.2 State Rules

| ID     | Rule                                                                                   |
| ------ | -------------------------------------------------------------------------------------- |
| ST-001 | Server state (projections) managed by TanStack Query ONLY                              |
| ST-002 | Client state (UI-only) managed by Zustand ONLY                                         |
| ST-003 | Form state managed by React Hook Form ONLY                                             |
| ST-004 | No global state management (Redux, MobX) — TanStack Query replaces global server state |
| ST-005 | Query keys follow convention: `['{domain}', '{entity}', '{id}']`                       |
| ST-006 | Stale time default: 5 minutes for projections                                          |

---

## 7. Routing

### 7.1 Route-to-Domain Mapping

| Route                  | Domain        | Volume      | Description                |
| ---------------------- | ------------- | ----------- | -------------------------- |
| `/identity`            | Identity      | Volume I    | Research Identity overview |
| `/identity/{id}`       | Identity      | Volume I    | Specific identity view     |
| `/knowledge`           | Knowledge     | Volume II   | Knowledge overview         |
| `/knowledge/agendas`   | Knowledge     | Volume II   | Research agendas           |
| `/knowledge/areas`     | Knowledge     | Volume II   | Research areas             |
| `/knowledge/questions` | Knowledge     | Volume II   | Research questions         |
| `/narrative`           | Narrative     | Volume III  | Narrative builder          |
| `/publication`         | Publication   | Volume IV   | Publication management     |
| `/visualization`       | Visualization | Volume V    | Data visualizations        |
| `/motion`              | Motion        | Volume VI   | Motion/animation views     |
| `/evolution`           | Evolution     | Volume VIII | Evolution timeline         |

### 7.2 Route Guards

```tsx
// Middleware for authentication
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  if (!token && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/identity') ||
    pathname.startsWith('/knowledge') ||
    pathname.startsWith('/narrative') ||
    pathname.startsWith('/publication') ||
    pathname.startsWith('/visualization') ||
    pathname.startsWith('/motion') ||
    pathname.startsWith('/evolution')
  );
}
```

---

## 8. Forms

### 8.1 Form Architecture

```tsx
// Form pattern: React Hook Form + Zod + domain validation

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Schema matches domain value object validation
const schema = z.object({
  title: z.string().min(1).max(200),
  directions: z.array(z.string()).min(1),
  description: z.string().max(2000).optional(),
});

type FormData = z.infer<typeof schema>;

export function ResearchAgendaForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', directions: [], description: '' },
  });

  return (
    <Form {...form}>
      <FormField
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Agenda Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage /> {/* Zod error message */}
          </FormItem>
        )}
      />
    </Form>
  );
}
```

### 8.2 Form Rules

| ID      | Rule                                                           |
| ------- | -------------------------------------------------------------- |
| FRM-001 | All forms MUST use React Hook Form                             |
| FRM-002 | All form validation MUST use Zod schemas                       |
| FRM-003 | Zod schemas MUST mirror domain value object invariants         |
| FRM-004 | Form submission MUST handle loading, error, and success states |
| FRM-005 | Forms MUST provide accessible error messages                   |

---

## 9. Error Boundaries

### 9.1 Error Boundary Hierarchy

```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <QueryProvider>
        <Sidebar />
        <main>{children}</main>
      </QueryProvider>
    </ErrorBoundary>
  );
}
```

### 9.2 Error Boundary Rules

| ID     | Rule                                                                                 |
| ------ | ------------------------------------------------------------------------------------ |
| EB-001 | Every route group MUST have an error boundary                                        |
| EB-002 | Error boundaries MUST display user-friendly messages                                 |
| EB-003 | Error boundaries MUST log errors for observability                                   |
| EB-004 | Error boundaries MUST provide a retry mechanism                                      |
| EB-005 | Domain-specific errors (NotFound, InvariantViolation) display context-appropriate UI |

### 9.3 Not Found Pages

```tsx
// app/(dashboard)/identity/[id]/not-found.tsx
export default function IdentityNotFound() {
  return (
    <EmptyState
      title="Identity Not Found"
      description="The requested Research Identity does not exist or has been removed."
      action={
        <Button asChild>
          <Link href="/identity">Back to Identities</Link>
        </Button>
      }
    />
  );
}
```

---

## 10. Loading States

### 10.1 Loading Strategy

| Pattern             | Usage             | Implementation                             |
| ------------------- | ----------------- | ------------------------------------------ |
| Suspense boundaries | Server Components | `<Suspense fallback={<Skeleton />}>`       |
| Loading states      | Route-level       | `loading.tsx` per route                    |
| Skeleton screens    | Component-level   | Shimmer skeleton components                |
| Progressive loading | Large lists       | Infinite scroll with intersection observer |

### 10.2 Loading Rules

| ID     | Rule                                                   |
| ------ | ------------------------------------------------------ |
| LD-001 | Every route MUST have a `loading.tsx` with skeleton UI |
| LD-002 | Skeleton shapes MUST match final content layout        |
| LD-003 | Loading states MUST NOT cause layout shift (CLS)       |
| LD-004 | Data fetching MUST use Suspense or loading indicators  |

---

## 11. Accessibility

### 11.1 WCAG 2.1 AA Requirements

| Criterion                    | Implementation                                |
| ---------------------------- | --------------------------------------------- |
| 1.1.1 Non-text Content       | All images have alt text                      |
| 1.3.1 Info and Relationships | Semantic HTML (headings, landmarks, lists)    |
| 1.4.1 Use of Color           | Color is not the only means of conveying info |
| 1.4.3 Contrast (Minimum)     | 4.5:1 ratio for normal text                   |
| 2.1.1 Keyboard               | All interactive elements keyboard accessible  |
| 2.4.1 Bypass Blocks          | Skip navigation link                          |
| 2.4.3 Focus Order            | Logical tab order                             |
| 2.4.6 Headings and Labels    | Descriptive headings                          |
| 3.1.1 Language of Page       | `lang` attribute on `<html>`                  |
| 4.1.2 Name, Role, Value      | ARIA attributes on custom components          |

### 11.2 Accessibility Rules

| ID       | Rule                                                        |
| -------- | ----------------------------------------------------------- |
| A11Y-001 | All components MUST pass axe-core automated checks          |
| A11Y-002 | All interactive elements MUST have visible focus indicators |
| A11Y-003 | All images MUST have meaningful alt text                    |
| A11Y-004 | Color contrast MUST meet 4.5:1 minimum ratio                |
| A11Y-005 | All forms MUST have associated labels                       |
| A11Y-006 | Error messages MUST be announced to screen readers          |

---

## 12. Internationalization

### 12.1 i18n Strategy

| Aspect                 | Implementation                  |
| ---------------------- | ------------------------------- |
| Library                | `next-intl`                     |
| Locale detection       | Accept-Language header + cookie |
| Translation files      | `messages/{locale}.json`        |
| Routing                | `/en/identity`, `/es/identity`  |
| Date/number formatting | `Intl` API                      |

### 12.2 i18n Rules

| ID       | Rule                                                            |
| -------- | --------------------------------------------------------------- |
| I18N-001 | All user-facing text MUST use translation keys                  |
| I18N-002 | Default locale is `en`                                          |
| I18N-003 | Domain terminology uses CTD canonical terms as translation keys |
| I18N-004 | Date formats follow locale conventions                          |

---

## 13. Performance

### 13.1 Performance Budgets

| Metric                         | Target            | Measurement      |
| ------------------------------ | ----------------- | ---------------- |
| First Contentful Paint (FCP)   | < 1.5s            | Lighthouse       |
| Largest Contentful Paint (LCP) | < 2.5s            | Lighthouse       |
| Cumulative Layout Shift (CLS)  | < 0.1             | Lighthouse       |
| First Input Delay (FID)        | < 100ms           | Web Vitals       |
| Time to Interactive (TTI)      | < 3.5s            | Lighthouse       |
| Total bundle size              | < 200KB (initial) | Webpack analyzer |

### 13.2 Performance Rules

| ID       | Rule                                                  |
| -------- | ----------------------------------------------------- |
| PERF-001 | Prefer Server Components to reduce client bundle      |
| PERF-002 | Dynamic imports for heavy components (charts, graphs) |
| PERF-003 | Images optimized via `next/image`                     |
| PERF-004 | Fonts loaded via `next/font` (no FOUT)                |
| PERF-005 | API responses cached with stale-while-revalidate      |
| PERF-006 | Route prefetching for likely navigations              |

---

## 14. Design System Integration

### 14.1 Design Token Architecture

```css
/* tailwind.config.ts */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* RIOS brand colors */ },
        domain: {
          identity: '#...',
          knowledge: '#...',
          narrative: '#...',
          publication: '#...',
        },
      },
    },
  },
};
```

### 14.2 Design System Rules

| ID     | Rule                                                    |
| ------ | ------------------------------------------------------- |
| DS-001 | All UI primitives from `@rios/ui` package               |
| DS-002 | Custom Tailwind config for RIOS design tokens           |
| DS-003 | No inline styles; Tailwind classes only                 |
| DS-004 | Component variants use `class-variance-authority` (CVA) |
| DS-005 | Dark mode support via Tailwind dark mode                |

---

## 15. Folder Structure Summary

```
apps/web/
├── src/
│   ├── app/                          # App Router (routes)
│   ├── components/
│   │   ├── ui/                       # Design system primitives
│   │   ├── layout/                   # Layout components
│   │   ├── shared/                   # Shared feature components
│   │   ├── features/                 # Domain feature components
│   │   └── providers/                # Context providers
│   ├── lib/
│   │   ├── api/                      # API client functions
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── utils/                    # Utility functions
│   │   ├── types/                    # TypeScript types
│   │   └── constants/                # Constants
│   ├── styles/                       # Global styles
│   └── middleware.ts                 # Next.js middleware
├── public/                           # Static assets
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json
└── package.json
```

---

_This document is part of the RIOS Engineering Blueprint. It is subordinate to
the Master Architecture Blueprint, Architecture Governance Standard, and all
normative architecture documents._
