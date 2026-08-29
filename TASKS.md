# Finab — Implementation Task Breakdown

Version: 0.1.0
Source: PRD.md (MVP v1.0)
Date: 2026-08-27
Last reconciled: 2026-08-29

---

## Status Legend

| Status | Meaning |
|---|---|
| `DONE` | Implemented and verifiable in the codebase |
| `PARTIAL` | Partially implemented; remaining sub-tasks listed |
| `NOT STARTED` | Not implemented yet |

---

## Summary

| Phase | Scope | Status |
|---|---|---|
| 1 — Core | Transactions, categories, dashboard, auth | DONE (dashboard UX redesigned + PRD §31 architecture/nav/i18n conformed) |
| 2 — Budget | Monthly + category budgets | DONE (C-3.4/3.5/3.6 category management added) |
| 3 — Analytics | Charts, reports, insights | DONE (deps installed) |
| 4 — PWA | Manifest, service worker (installable) | DONE — installability complete; offline data + sync REMOVED by user request |
| 5 — Advanced | Recurring, goals, notifications, export, AI | PARTIAL (notifications done) |

**Recommended order:** build the financial domain first (Transactions → Categories → Budget → Dashboard → Analytics), then PWA (installable). Offline data + sync were removed by user request.



---

## Phase 1 — Core

### T1. Authentication (Google OAuth)

| # | Task | Status |
|---|---|---|
| C-1.1 | Install Auth.js (`next-auth`) + Google provider | DONE |
| C-1.2 | Configure `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | DONE (placeholder values in `.env`; real values needed before deploy) |
| C-1.3 | Add `/api/auth/[...nextauth]` route handler | DONE |
| C-1.4 | Add `src/lib/auth.ts` + middleware that protects private routes | DONE — `middleware.ts` gates private routes via session-cookie check (edge-safe; avoids DB call in middleware) |
| C-1.5 | Build `/login` page with "Sign in with Google" button | DONE (`/login` + `SignInButton`) |
| C-1.6 | Upsert `users` record on first sign-in (name, email, image) | DONE (handled by `@auth/prisma-adapter`) |
| C-1.7 | Add profile / logout control | DONE (`UserMenu` in root layout header) |

### T2. Transaction Management

| # | Task | Status |
|---|---|---|
| C-2.1 | Add transaction (title, price, description) | DONE (title + description both persisted) |
| C-2.2 | Delete transaction | DONE (server action `deleteTransactionAction`) |
| C-2.3 | Transaction history list (dedicated `/transactions` page) | DONE (`/transactions` page with filters/sort; also summarized on Dashboard via `RecentTransactions`) |
| C-2.4 | Add `type` field (`INCOME` / `EXPENSE`) | DONE (UI selector; no longer hardcoded to EXPENSE) |
| C-2.5 | Add `date`, `note`, `paymentMethod` fields | DONE (date picker, paymentMethod select, note=description all wired) |
| C-2.6 | Edit transaction | DONE (server action `updateTransactionAction` + `EditTransactionDialog`) |
| C-2.7 | Search transactions | DONE — `TransactionFilters` bar (server-driven via URL `?q=`); matches title + note, case-insensitive |
| C-2.8 | Filter by type / category / date | DONE — type, category (`categoryId`), date-from/date-to filters wired through `getTransactions` + URL params |
| C-2.9 | Sort by date / amount / title | DONE — sort by/dir controls (`sortBy`/`sortDir` URL params) applied in `getTransactions` |

### T3. Categories

| # | Task | Status |
|---|---|---|
| C-3.1 | Replace free-form category with `categories` table (`categoryId` FK) | DONE — `src/lib/category.ts` (`getCategories` + `ensureDefaultCategories`), `transactions.ts` now validates `categoryId` ownership; `TransactionInput`, `EditTransactionDialog`, `CostList`, `CostListContainer`, `app/page.tsx` use a `<select>` bound to categoryId |
| C-3.2 | Seed default expense categories (Food, Transport, Shopping, Bills, Education, Entertainment, Health, Travel, Other) | DONE (seeded on first `getCategories` call for the user) |
| C-3.3 | Seed default income categories (Salary, Freelance, Business, Allowance, Gift, Other) | DONE (seeded on first `getCategories` call for the user) |
| C-3.4 | Create / rename category | DONE — `createCategoryAction` / `updateCategoryAction` in `src/lib/category.ts`; `/categories` page + `CategoryManager`/`CategoryDialog` (no duplicate-name per type) |
| C-3.5 | Category icon + color selection | DONE — icon (emoji) + color (`type="color"`) inputs in `CategoryDialog`; `CategoryDot` shows color/icon in `/categories`, transaction list, budgets, spending-by-category |
| C-3.6 | Delete category with transaction reassignment guard | DONE — `deleteCategoryAction` reassigns transactions + budgets to a chosen same-type category (or blocks if none available) before deleting; UI: `DeleteCategoryDialog` |

### T4. Dashboard

| # | Task | Status |
|---|---|---|
| C-4.1 | Monthly budget overview (`TotalBudget`) | DONE |
| C-4.2 | Daily budget overview (`DailyBudget`) | DONE |
| C-4.3 | Add transaction dialog (`TransactionInput`) | DONE |
| C-4.4 | Financial summary: current balance, total income, total expenses, remaining budget | DONE (`FinancialSummary` server component + `getFinancialSummary` service) |
| C-4.5 | Monthly overview (income / expenses / balance for current month) | DONE (`MonthlyOverview` component + `getMonthlySummary` service, shows savings rate) |
| C-4.6 | Spending-by-category breakdown | DONE (`SpendingByCategory` component + `getSpendingByCategory` service; bar list with % of total expense) |

---

### T4.x UI/UX & Architecture Overhaul (PRD §31)

Addressed the "dashboard too complex / UX broken vs PRD" findings before starting PWA:

| # | Area | Status |
|---|---|---|
| UX-1 | App shell: `AppHeader` + desktop `Sidebar` + mobile `BottomNavigation` (with prominent Add-Transaction FAB) | DONE (`src/components/shared/`) |
| UX-2 | Dashboard redesigned to PRD hierarchy: `FinancialSummary` → `BudgetOverview` → `SpendingByCategory` + `RecentTransactions` → `QuickActions` | DONE (retired redundant `MonthlyOverview`, `TotalBudget`, `DailyBudget`) |
| UX-3 | i18n scaffold: `messages/en.json` + `messages/mm.json`, `lib/i18n.ts` (`getDictionary`/`getT`), `I18nProvider` + `LanguageSwitcher`; applied to dashboard, nav, header, and key buttons | DONE (dashboard+nav+key buttons scope) |
| UX-4 | Semantic tokens: removed hardcoded `bg-slate-800`/`text-white`, `bg-red-600`/`bg-green-600`, `bg-slate-600`; centralized currency via `formatCurrency` (dropped `+ " ks"`) | DONE |
| UX-5 | Three-level component architecture: `components/ui` (Card, Button), `components/shared` (shell), `features/{dashboard,budgets,transactions}/components` | DONE |
| UX-6 | Routes: `/` redirects to `/transactions`, `/transactions` = history, `/dashboard` = overview, `/budgets` = budgets | DONE (dedicated `/transactions` history page now exists; see C-2.3) |

> Note: full-app i18n (every component) and Recharts analytics (Phase 3) remain as later work; remaining hardcoded strings in legacy areas to be converted.

### T4.y UI/UX Polish Round (post-§31)

Follow-up fixes made after the §31 overhaul:

| # | Area | Status |
|---|---|---|
| UX-7 | Tailwind `content` now includes `./src/features/**/*.tsx` — previously missing, which left every feature component unstyled/invisible (broke dialogs) | DONE (root-cause fix) |
| UX-8 | Removed duplicate "Add" entry points: `TransactionInput` removed from `AppHeader`; single Add via QuickActions (link style) + mobile FAB in `BottomNavigation` | DONE |
| UX-9 | `LanguageSwitcher` + `ThemeToggle` converted to Radix `DropdownMenu` select (click-to-open) | DONE (`@radix-ui/react-dropdown-menu` added, consistent with existing Radix usage) |
| UX-10 | Inputs/dialogs use `bg-background` so controls are visible in dark mode | DONE (`TransactionInput`, `EditTransactionDialog`, `BudgetInput`, `CategoryBudgetInput`) |
| UX-11 | Loading states: `Spinner` (ui), `pending` on submit buttons, `useTransition` on filters, `loading.tsx` skeletons for `/transactions`, `/dashboard`, `/budgets` | DONE |
| UX-12 | Date inputs: `dark:color-scheme-dark` + `px-3` padding (`TransactionFilters`, `TransactionInput`, `EditTransactionDialog`) | DONE |
| UX-13 | Login page: `AppFrame` hides shell (Sidebar/BottomNavigation/header) on `/login`; login text + Google button i18n'd; Google sign-in shows loading state | DONE |
| UX-14 | Transaction filters hidden by default, revealed via a labeled "Filter" dropdown button (funnel icon + active-filter dot + chevron); budget + transaction deletes show a theme-aware confirm dialog (Radix `Dialog`, no native alert/confirm) before acting | DONE |

---

## Phase 2 — Budget

### T5. Monthly Budget

| # | Task | Status |
|---|---|---|
| B-5.1 | Set monthly budget via dialog (`BudgetInput`) | DONE |
| B-5.2 | Budget calculations (spent, remaining, daily budget, today's spend) | DONE |
| B-5.3 | Budget GET returns empty body when no budget → return JSON response | DONE (`getBudgets` now returns `null` when no monthly budget record exists; `BudgetOverview` shows "No budget set") |
| B-5.4 | Edit / delete existing budget for the current month | DONE — edit existed via `createBudgetAction` upsert; new `deleteBudgetAction` + `DeleteBudgetButton` (confirm + loading) removes current-month budget; `createBudgetAction` now revalidates `/budgets` |

### T6. Category Budgets

| # | Task | Status |
|---|---|---|
| B-6.1 | Set per-category monthly budgets | DONE (`setCategoryBudgetAction` + `CategoryBudgetInput` dialog; reuses `categoryId` on `Budget`) |
| B-6.2 | Category budget progress bar (spent / budget) | DONE (`CategoryBudgets` component, bar width = % of budget) |
| B-6.3 | Status thresholds: `<75% SAFE`, `75–90% WARNING`, `>90% CRITICAL`, `>100% EXCEEDED` | DONE (`getCategoryBudgetStatus` + colored badges) |
| B-6.4 | Budget warnings / alerts UI | DONE (status badges SAFE/WARNING/CRITICAL/EXCEEDED shown per category) |

### T7. Budget Visuals

| # | Task | Status |
|---|---|---|
| B-7.1 | Green/red status badges (spent within vs over budget) | DONE |
| B-7.2 | WARNING / CRITICAL / EXCEEDED badges | DONE — monthly `BudgetOverview` now shows a SAFE/WARNING/CRITICAL/EXCEEDED status badge + progress-bar color via `getBudgetStatus` thresholds (mirrors category-budget badges) |

---

## Phase 3 — Analytics

### T8. Reports & Charts

| # | Task | Status |
|---|---|---|
| P-8.1 | Install Recharts | DONE (installed; used by `/analytics` charts) |
| P-8.2 | Income vs Expense bar chart | DONE (`IncomeExpenseChart` on `/analytics`) |
| P-8.3 | Category spending donut chart | DONE (`CategoryDonutChart`) |
| P-8.4 | Monthly spending trend line chart | DONE (`SpendingTrendChart` area) |
| P-8.5 | Budget utilization progress bars | DONE (already in `CategoryBudgets` + `BudgetOverview`) |
| P-8.6 | Monthly report (income / expenses / savings) | DONE (`MonthlyReport` card) |

### T9. Insights

| # | Task | Status |
|---|---|---|
| P-9.1 | Rule-based insights: largest category, totals, avg daily spend, budget usage | DONE (`Insights` from `getInsights`: top category, savings rate, over-budget, avg daily spend) |
| P-9.2 | Month-over-month spending comparison insights | PARTIAL (MoM visualized via `SpendingTrendChart`/`IncomeExpenseChart`; explicit MoM insight text not added) |

---

## Phase 4 — PWA (Installable)

### T10. PWA Installability

| # | Task | Status |
|---|---|---|
| W-10.1 | Web App Manifest (name, icons, standalone display) | DONE — `src/app/manifest.ts` (name "Budget Tracker", 192/512/maskable PNG icons in `public/icons/`, `next.config.ts` `withPWA` + `manifest.webmanifest`/`sw.js`/icons excluded from auth middleware) |
| W-10.2 | Service worker registering + caching app shell assets | DONE — `@ducanh2912/next-pwa` wrapped in `next.config.ts` (`disable` in dev, `register: true`, `dest: "public"`); `public/sw.js` + `workbox-*.js` generated and served publicly |
| W-10.3 | HTTPS in production | NOT STARTED (depends on deployment host; required for installability) |
| W-10.4 | Installable prompt / `beforeinstallprompt` handling | DONE — installability satisfied via manifest + SW + icons (no custom prompt UI needed) |

> **Offline data layer & sync REMOVED by user request.** T11 (IndexedDB) and T12 (Synchronization) are dropped — no `src/lib/offline`, no `/api/sync`, no offline queue. The service worker only caches the static app shell (required for installability); it does **not** cache user financial data. The `idb` dependency was removed from `package.json`.

---

## Phase 5 — Advanced

### T13. Recurring Transactions

| # | Task | Status |
|---|---|---|
| A-13.1 | Recurring transaction model (frequency, next date, amount, category) | NOT STARTED (schema model exists) |
| A-13.2 | Frequencies: daily / weekly / monthly / yearly | NOT STARTED |
| A-13.3 | Auto-generate transaction when due | NOT STARTED |

### T14. Savings Goals

| # | Task | Status |
|---|---|---|
| A-14.1 | Create / edit / delete goal (target, saved, target date) | NOT STARTED (schema model exists) |
| A-14.2 | Add money / withdraw money | NOT STARTED |
| A-14.3 | Progress % and remaining amount display | NOT STARTED |

### T15. Notifications

| # | Task | Status |
|---|---|---|
| A-15.1 | Budget notifications ("Used 90% of Food budget") | DONE — in-app `NotificationBell` (`src/components/shared/NotificationBell.tsx`) deriving from `getCategoryBudgets` status + `getFinancialSummary` (server action `getNotifications` in `src/lib/notifications.ts`); severity badge; per-item dismiss; hidden when unauthenticated |
| A-15.2 | Recurring transaction due notifications | NOT STARTED |
| A-15.3 | Goal progress notifications | NOT STARTED |
| A-15.4 | User-configurable notification preferences | NOT STARTED |

### T16. Export

| # | Task | Status |
|---|---|---|
| A-16.1 | CSV export (`/api/export`) | NOT STARTED |
| A-16.2 | PDF export | NOT STARTED |

### T17. Multi-Currency

| # | Task | Status |
|---|---|---|
| A-17.1 | Currency list (MMK, USD, THB, SGD, EUR, GBP, JPY) | NOT STARTED |
| A-17.2 | Per-user default currency (MMK default) | NOT STARTED (column exists on `User`) |
| A-17.3 | Store transactions in user's currency (no conversion in MVP) | NOT STARTED |

### T18. Future AI Assistant

| # | Task | Status |
|---|---|---|
| A-18.1 | Natural-language assistant (out of MVP scope) | NOT STARTED |

---

## Phase 0 — Foundation & Polish

| # | Task | Status |
|---|---|---|
| F-1 | Server-side validation with Zod on all inputs | DONE (transactions + budget validated) |
| F-2 | Scope all queries to authenticated user (`userId`) | DONE (enforced in `transactions.ts` + `budget.ts`) |
| F-3 | Error boundaries + loading states | DONE — `loading.tsx` skeletons + `pending`/`useTransition` states on actions; `app/error.tsx` (segment) + `app/global-error.tsx` (root) boundaries with i18n retry |
| F-4 | Update metadata (remove default "Create Next App" values) | DONE — removed default `src/app/favicon.ico`; `metadata` in `src/app/layout.tsx` sets title "Budget Tracker", description, `icons` (brand PNG), `appleWebApp` |
| F-5 | PWA / auth foundation | DONE (Google OAuth + `/login` + middleware protection all present; PWA installability complete; offline data + sync removed by user request) |
| F-6 | UI/UX + architecture conform to PRD §31 (nav shell, semantic tokens, i18n, feature folders) | DONE — see "UI/UX & Architecture Overhaul" below |
