# Budget Tracker - AI Development Rules

## Project

Budget Tracker is an offline-first PWA built with:

- Next.js App Router
- TypeScript
- PostgreSQL
- Prisma
- Zod
- Tailwind CSS

## Architecture

Use a modular monolith with feature-based organization.

Directory responsibilities:

- app/: routing and page composition only
- features/: feature-specific business logic and UI
- components/ui/: reusable UI components
- lib/: shared infrastructure and utilities

## Data Flow

Follow this flow:

UI
→ Server Action or Route Handler
→ Zod Validation
→ Service Layer
→ Prisma
→ PostgreSQL

Do not access Prisma directly from React Client Components.

## TypeScript Rules

- Strict TypeScript.
- Do not use `any`.
- Avoid unnecessary type assertions.
- Prefer type inference when the type is obvious.
- Use explicit types for public function boundaries.

## Validation

- Validate all external input with Zod.
- Server-side validation is mandatory.
- Never trust client input.

## Database Rules

- All user-owned data must be scoped to the authenticated user.
- Never accept a userId directly from the client as authorization.
- Use Prisma migrations for schema changes.
- Do not modify the database schema without explaining the migration impact.

## UI, Theming & Internationalization

- Follow the existing design system; use semantic design tokens (e.g., `bg-background`, `text-foreground`) instead of hardcoded colors.
- Support Light, Dark, and System appearance modes and persist the user's choice.
- Ensure new UI works in both English and Myanmar (Myanmar Unicode). Use translation keys from `messages/` instead of hardcoded user-facing text.
- Test layouts with both English and Myanmar text, including long or mixed strings; avoid fixed-width layouts sized for short English labels.
- Follow the three-level component architecture: Generic UI (`components/ui/`) → Shared (`components/shared/`) → Feature (`features/*/components/`).
- Do not create unnecessarily large page components; compose smaller feature components with clear responsibilities.
- Reuse existing UI components before creating new ones.
- Maintain mobile-first responsive behavior with touch-friendly controls.
- Do not introduce new UI libraries without justification (see Architecture Changes).

## Code Changes

Before changing code:

1. Analyze relevant files.
2. Explain the proposed approach.
3. Identify affected files.
4. Make the smallest reasonable change.
5. Do not refactor unrelated code.

After changing code:

1. Run lint.
2. Run TypeScript checks.
3. Run relevant tests.
4. Report changed files.
5. Report any remaining issues.

## Architecture Changes

Do not introduce:

- Microservices
- New state management libraries
- New dependencies [if need request me]
- New database technologies

without explaining why they are needed.

Prefer existing project patterns.
