# Finab — Product Requirements Document (PRD)

**Product Name:** Finab
**Product Type:** Progressive Web App (PWA)
**Platform:** Web / Mobile PWA / Desktop
**Primary Stack:** Next.js + TypeScript + PostgreSQL + Prisma
**Architecture:** Modular Monolith
**Version:** MVP v1.0
**Status:** Product Specification

---

## 1. Product Overview

Finab is a personal budget tracking Progressive Web App that helps users record income and expenses, manage monthly budgets, monitor spending, and understand their financial habits through simple dashboards and analytics.

The application should be:

- Simple to use
- Mobile-first
- Fast
- Installable as a PWA
- Functional offline
- Secure
- Data-driven
- Responsive across mobile, tablet, and desktop
- Internationalized (English and Myanmar)

The primary user should be able to record an expense in **a few seconds**.

---

## 2. Problem Statement

Many people know how much money they receive but don't know exactly where their money goes.

Common problems include:

- Forgetting to record expenses
- Overspending in specific categories
- Difficulty tracking monthly budgets
- No clear view of spending patterns
- Manually calculating income and expenses
- Losing access to financial information when offline

Finab solves these problems by providing a centralized and easy-to-use budgeting system.

---

## 3. Goals

### Primary Goals

1. Allow users to quickly record income and expenses.
2. Allow users to create and manage budgets.
3. Show users their current financial status.
4. Provide useful spending analytics.
5. Work offline as a PWA.
6. Synchronize data when the connection returns.
7. Protect users' financial data.

### Secondary Goals

- Support savings goals.
- Support recurring transactions.
- Provide spending insights.
- Allow data export.
- Provide notifications.

---

## 4. Non-Goals

The MVP will **not** include:

- Direct bank account integration
- Credit card integration
- Cryptocurrency tracking
- Investment portfolio management
- Payment processing
- Money transfers
- Loans
- Tax filing

These can be considered future features.

---

## 5. Target Users

### Primary User

People who want to manage their personal finances.

Examples:

- University students
- Employees
- Freelancers
- Small business owners
- People trying to control monthly spending

### Example User

> A university student receives a monthly allowance and wants to track food, transportation, education, and entertainment expenses.

---

## 6. Core User Journey

```text
Sign in with Google
       ↓
Set Currency
       ↓
Set Monthly Budget
       ↓
Create Categories
       ↓
Add Income
       ↓
Record Expenses
       ↓
Dashboard
       ↓
Analyze Spending
       ↓
Adjust Budget
       ↓
Track Progress
```

---

## 7. Functional Requirements

## 7.1 Authentication (Google OAuth)

Users sign in with their existing Google account via **Auth.js (GoogleProvider)**:

- Sign in with Google
- Logout
- View profile
- Update profile
- Delete account

- OAuth credentials are stored in environment variables (`AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`)
- Session is managed by Auth.js; middleware protects all private routes
- User record is created automatically (`upsert`) on first sign-in
- No separate password registration flow is needed — authentication is delegated to Google

### User fields

```text
id
name
email
image
currency
timezone
createdAt
updatedAt
```

---

## 8. Dashboard

The dashboard is the main screen.

It should display:

### Financial summary

```text
Current Balance
Total Income
Total Expenses
Remaining Budget
Savings
```

### Monthly overview

```text
August 2026

Income        2,000,000 MMK
Expenses        850,000 MMK
Balance       1,150,000 MMK
```

### Spending categories

```text
Food          250,000
Transport     120,000
Bills         200,000
Shopping      180,000
Education     100,000
```

### Charts

- Income vs Expense
- Category spending
- Monthly spending trend
- Budget utilization

---

## 9. Transaction Management

Transactions are the core data of the application.

Users can:

- Add transaction
- Edit transaction
- Delete transaction
- View transaction
- Search transactions
- Filter transactions
- Sort transactions

### Transaction types

```text
INCOME
EXPENSE
```

### Transaction fields

```text
id
userId
type
amount
categoryId
date
note
paymentMethod
createdAt
updatedAt
```

---

## 10. Add Transaction

The user should be able to add a transaction quickly.

### Form

```text
Type
[ Expense ▼ ]

Amount
[ 5,000 ]

Category
[ Food ▼ ]

Date
[ Today ]

Payment Method
[ Cash ▼ ]

Note
[ Lunch ]

        Save
```

### Validation

- Amount must be greater than 0.
- Type must be valid.
- Category must exist.
- Date must be valid.
- User must be authenticated.

---

## 11. Categories

Users should have default categories.

### Expense

```text
Food
Transport
Shopping
Bills
Education
Entertainment
Health
Travel
Other
```

### Income

```text
Salary
Freelance
Business
Allowance
Gift
Other
```

Users can:

- Create category
- Rename category
- Delete category
- Select category icon
- Select category color

A category cannot be deleted if existing transactions depend on it unless those transactions are reassigned.

---

## 12. Budget Management

Users can create budgets.

### Monthly budget

```text
Monthly Budget

Total
2,000,000 MMK

Spent
1,250,000 MMK

Remaining
750,000 MMK
```

### Category budget

```text
Food

Budget: 300,000 MMK
Spent: 250,000 MMK

████████░░ 83%
```

Budget statuses:

```text
SAFE
WARNING
EXCEEDED
```

Example:

```text
< 75%     Safe
75–90%    Warning
> 90%     Critical
> 100%    Exceeded
```

These thresholds should be configurable later.

---

## 13. Recurring Transactions

Users can create recurring transactions.

Examples:

```text
Rent
500,000 MMK
Monthly
5th

Salary
2,000,000 MMK
Monthly
25th
```

Supported frequencies:

```text
Daily
Weekly
Monthly
Yearly
Custom
```

The system should automatically generate the transaction when appropriate.

---

## 14. Savings Goals

Users can create financial goals.

Example:

```text
🎯 New Laptop

Target
3,000,000 MMK

Saved
1,800,000 MMK

Progress
60%

Remaining
1,200,000 MMK
```

Users can:

- Create goal
- Add money
- Withdraw money
- Edit goal
- Delete goal
- Set target date

---

## 15. Reports & Analytics

The application should provide financial reports.

### Monthly report

```text
August 2026

Income       2,000,000
Expenses       850,000
Savings      1,150,000
```

### Spending analysis

The user can see:

- Highest spending category
- Lowest spending category
- Total spending
- Average daily spending
- Monthly spending
- Spending trends

### Charts

Use:

- Donut chart
- Bar chart
- Line chart
- Progress bars

---

## 16. Calendar

Users can view transactions by date.

```text
August 2026

Mon Tue Wed Thu Fri Sat Sun
                  1   2   3
4   5   6   7   8   9  10
11 12 13 14 15 16 17
18 19 20 21 22 23 24
25 26 27 28 29 30 31
```

Selecting a date shows transactions from that day.

---

## 17. Search & Filtering

Users should be able to search transactions.

### Search

```text
🔍 Search transactions
```

Example:

```text
Search: "Lunch"
```

### Filters

```text
Type
[All] [Income] [Expense]

Category
[All] [Food] [Transport]

Date
[Today]
[This Week]
[This Month]
[Custom]
```

---

## 18. PWA Requirements

This is an important part of the product.

The application must:

- Be installable
- Have a Web App Manifest
- Use HTTPS in production
- Provide service-worker functionality
- Support offline access
- Cache application assets
- Provide responsive mobile UI
- Support standalone display mode
- Define theme-color and maskable icons that remain legible in both Light and Dark modes

After installation:

```text
Home Screen
     ↓
Finab
     ↓
App-like experience
```

---

## 19. Offline Mode

Users should be able to access important functionality without an internet connection.

### Offline supported

- View recent transactions
- Add transactions
- Edit transactions
- View budgets
- View cached dashboard data

### Offline architecture

```text
                Browser
                   │
                   ▼
              Next.js PWA
                   │
             ┌─────┴─────┐
             │           │
          Online       Offline
             │           │
             ▼           ▼
        PostgreSQL    IndexedDB
             ▲           │
             │           │
             └─── Sync ──┘
```

Use **IndexedDB**, not localStorage, for the application's offline data layer.

---

## 20. Synchronization

When the device goes offline:

```text
Create Expense
      ↓
IndexedDB
      ↓
Pending
```

When the connection returns:

```text
Pending
   ↓
Sync Queue
   ↓
Next.js Server
   ↓
PostgreSQL
   ↓
Synced
```

Each local transaction should have a synchronization state such as:

```text
PENDING
SYNCED
FAILED
```

---

## 21. Notifications

The application can notify users about:

### Budget

> You've used 90% of your Food budget.

### Recurring transaction

> Your rent transaction is due tomorrow.

### Goal

> You're 80% of the way toward your laptop goal.

Notifications should be optional and configurable.

---

## 22. Currency

The application should support multiple currencies.

Initial currencies:

```text
MMK
USD
THB
SGD
EUR
GBP
JPY
```

Each user has a default currency. The default for Finab is **MMK**, with timezone defaulting to **Asia/Yangon**.

Example:

```text
Currency: MMK

1,500,000 MMK
```

For MVP, **do not automatically convert currencies**. Store transactions in the user's selected currency.

Multi-currency conversion can be added later.

---

## 23. Export

Users should be able to export financial data.

### Supported formats

```text
CSV
PDF
```

Example CSV:

```text
Date,Type,Category,Amount,Note

2026-08-01,EXPENSE,Food,5000,Lunch
2026-08-02,EXPENSE,Transport,3000,Bus
2026-08-25,INCOME,Salary,2000000,Salary
```

---

## 24. Insights

The system should generate simple rule-based insights.

Examples:

> Food is your largest expense category this month.

> Your spending increased by 15% compared with last month.

> You have used 85% of your monthly budget.

> Your average daily spending is 28,000 MMK.

These should initially be calculated using normal business logic rather than AI.

---

## 25. Future AI Assistant

A future version could provide a natural-language financial assistant.

Example:

```text
User:
How much did I spend on food this month?

AI:
You spent 250,000 MMK on food this month.
```

Another:

```text
User:
Where did most of my money go?

AI:
Food was your largest expense category,
accounting for 32% of your spending.
```

The AI should only access data that the authenticated user is authorized to access.

---

## 26. Database Design

Recommended core schema:

```text
User
 │
 ├── Transaction
 │       └── Category
 │
 ├── Budget
 │       └── Category
 │
 ├── Goal
 │
 ├── RecurringTransaction
 │
 └── Notification
```

### Main tables

```text
users
categories
transactions
budgets
goals
recurring_transactions
notifications
```

Every table is scoped to the authenticated user.

---

## 27. Architecture

Use a **modular monolith**.

```text
                         PWA
                          │
                          ▼
                    ┌───────────┐
                    │  Next.js  │
                    └─────┬─────┘
                          │
             ┌────────────┼────────────┐
             │            │            │
             ▼            ▼            ▼
          Auth       Transactions   Budgets
             │            │            │
             └────────────┼────────────┘
                          ▼
                   Business Layer
                          │
                          ▼
                       Prisma
                          │
                          ▼
                    PostgreSQL
```

Component organization (three levels):

```text
components/ui/          # generic, reusable UI (Button, Card, Input, Select, Dialog, Sheet, Drawer, DropdownMenu, Tabs, Tooltip, Popover, Calendar, Skeleton)
components/shared/      # shared application components (AppHeader, AppSidebar, MobileNavigation, ThemeToggle, LanguageSwitcher, UserMenu, PageHeader, EmptyState, LoadingState)
features/
├── auth/
├── transactions/
│   └── components/     # TransactionForm, TransactionList, TransactionItem, TransactionFilters
├── categories/
├── budgets/
│   └── components/     # BudgetProgress, BudgetOverview, BudgetCard
├── goals/
├── recurring/
├── reports/
├── dashboard/
│   └── components/     # FinancialSummary, BalanceCard, IncomeCard, ExpenseCard, SpendingChart, RecentTransactions
└── notifications/
```

Do not place large amounts of business-specific UI inside global shared component folders; feature components live inside their feature directory.

---

## 28. Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend

- Next.js Server Actions
- Next.js Route Handlers
- Business/service layer

### Database

- PostgreSQL
- Prisma ORM

### Validation

- Zod

### Charts

- Recharts

### Internationalization

- Message-based translations (`messages/en.json`, `messages/mm.json`); prefer Next.js built-in or a lightweight dictionary over a new library

### Offline

- Service Worker
- IndexedDB

### Authentication

- Auth.js (Google OAuth)

---

## 29. API / Server Actions

You don't need to create a separate Express backend.

For example:

```text
Server Actions

createTransaction()
updateTransaction()
deleteTransaction()

createBudget()
updateBudget()
deleteBudget()

createGoal()
addGoalContribution()

createCategory()
deleteCategory()
```

Route Handlers can be used where an actual HTTP API is useful:

```text
/api/auth/[...nextauth]   # Auth.js handler
/api/export
/api/reports
/api/sync
/api/webhooks
```

---

## 30. Security Requirements

Because this application handles financial information:

### Authentication

All private pages require authentication.

### Authorization

Every database query must be scoped to the authenticated user.

```text
WHERE userId = currentUser.id
```

### Validation

Validate all input on the server with Zod.

### Database

Use parameterized, type-safe queries through Prisma.

### Sensitive information

Never expose:

- Authentication secrets
- Database credentials
- Private server environment variables

### Environment variables

```text
DATABASE_URL=
AUTH_SECRET=
```

These must never be committed to Git.

---

## 31. UI/UX Requirements

### 31.1 Design Direction

The application is a budget-tracking PWA. The visual style must be: Minimal, Modern, Clean, Trustworthy, Financial-focused, Data-focused, and Mobile-first. Avoid an overly colorful or complicated banking-style interface.

The UI should prioritize: clear financial information, easy transaction entry, readable data, strong visual hierarchy, consistent spacing, simple navigation, and touch-friendly controls. The primary user action, "Add Transaction", must always be easy to access.

### Navigation

Mobile:

```text
┌──────────────────────────┐
│       Dashboard          │
│                          │
│      Balance             │
│                          │
│   Income    Expenses     │
│                          │
│      Spending            │
│                          │
├──────────────────────────┤
│ Home Transactions Budgets│
│ Goals            Settings│
└──────────────────────────┘
```

Desktop:

```text
┌────────────┬──────────────────────────┐
│            │                          │
│ Dashboard  │        Dashboard         │
│            │                          │
│ Transactions│       Analytics         │
│            │                          │
│ Budgets    │                          │
│            │                          │
│ Goals      │                          │
│            │                          │
│ Reports    │                          │
│            │                          │
│ Settings   │                          │
└────────────┴──────────────────────────┘
```

The **Add Transaction** button should always be easy to access on mobile.

### 31.2 Theme System

The application must support three appearance modes: **Light**, **Dark**, and **System**. The user's appearance preference must persist (cookie or `localStorage`).

Use a centralized theme system based on semantic design tokens. Do not hardcode visual colors throughout feature components.

Required semantic tokens:

```text
background
foreground
card
card-foreground
border
primary
primary-foreground
secondary
muted
muted-foreground
success
destructive
warning
```

- The primary visual accent should use a calm emerald or teal-inspired color direction.
- Financial meaning must not rely only on the primary color.
- Use semantic states for: Income, Expense, Budget warning, Budget exceeded, Success, Error.
- All semantic colors must work correctly in both Light and Dark modes.
- Dark mode should use dark neutral surfaces and avoid pure black backgrounds where possible.
- Default appearance: **System** (user can override).

### 31.3 Design System

The UI should use a consistent design system. Define and document:

- Color tokens
- Typography
- Spacing
- Border radius
- Shadows
- Borders
- Interactive states
- Focus states
- Disabled states

The project should use semantic design tokens rather than repeating raw color classes throughout the application, for example:

```text
bg-background
text-foreground
bg-card
text-muted-foreground
bg-primary
```

The goal is that changing the theme should not require modifying every feature component.

### 31.4 Component Architecture

Organize UI components into three levels.

**1. Generic UI Components** — `components/ui/`

Reusable, generic components with no financial business logic. Examples: Button, Card, Input, Select, Dialog, Sheet, Drawer, DropdownMenu, Tabs, Tooltip, Popover, Calendar, Skeleton.

**2. Shared Application Components** — `components/shared/`

Reusable across multiple features. Examples: AppHeader, AppSidebar, MobileNavigation, ThemeToggle, LanguageSwitcher, UserMenu, PageHeader, EmptyState, LoadingState.

**3. Feature Components**

Feature-specific components live inside their relevant feature. Examples:

```text
features/transactions/components/
  TransactionForm
  TransactionList
  TransactionItem
  TransactionFilters

features/budgets/components/
  BudgetProgress
  BudgetOverview
  BudgetCard

features/dashboard/components/
  FinancialSummary
  BalanceCard
  IncomeCard
  ExpenseCard
  SpendingChart
  RecentTransactions
```

Do not place large amounts of business-specific UI inside global shared component folders.

### 31.5 Financial UI Components

Reusable financial presentation components should be created when the same financial UI logic is repeated. Examples: MoneyDisplay, AmountInput, BalanceCard, BudgetProgress, TransactionTypeBadge, CategoryIcon.

Currency formatting must be centralized. Do not duplicate currency formatting logic throughout the application.

### 31.6 Responsive Design

The application must follow a mobile-first design approach.

**Mobile**

The mobile experience should behave like an application:

- Bottom navigation for primary navigation
- Touch-friendly controls
- Responsive cards
- Easy access to Add Transaction
- Full-screen or bottom-sheet patterns where appropriate for forms and filters

The primary navigation should prioritize the most important actions: Dashboard, Transactions, Add Transaction, Budgets, More or Settings. The Add Transaction action should be visually prominent and easily accessible.

**Desktop**

The desktop experience should use:

- Sidebar navigation
- Top application header
- Responsive dashboard grid
- Larger data visualization areas
- Efficient use of horizontal space

The mobile and desktop interfaces should share the same design language but do not need to use identical layouts.

### 31.7 Dashboard UI

The dashboard should prioritize financial information. Recommended component hierarchy:

```text
DashboardPage
├── AppHeader
│   ├── LanguageSwitcher
│   ├── ThemeToggle
│   └── UserMenu
├── FinancialSummary
│   ├── BalanceCard
│   ├── IncomeCard
│   └── ExpenseCard
├── BudgetOverview
├── SpendingChart
├── RecentTransactions
└── QuickActions
```

The page should not become one large component. Use smaller feature components with clear responsibilities.

### 31.8 Internationalization

The application must support:

- English
- Myanmar

All user-facing application text must be designed for localization. Do not hardcode English text directly throughout feature components. Use translation keys.

Example organization:

```text
messages/
├── en.json
└── mm.json
```

Example keys:

```text
dashboard.title
dashboard.balance
dashboard.income
dashboard.expense
```

The language preference should persist. Prefer Next.js built-in i18n or a lightweight message dictionary; do not add a new dependency without justification (see Architecture Changes).

### 31.9 Myanmar Language Requirements

The application must correctly support Myanmar Unicode. The UI must be tested with:

- English text
- Myanmar text
- Mixed English and Myanmar text
- Currency values
- Long translations
- Different text lengths

Do not assume English and Myanmar labels have equal length. Avoid fixed-width buttons or layouts that only work with short English labels. Use fonts that properly support Myanmar Unicode. Typography and line-height must remain readable for both English and Myanmar.

### 31.10 Language Switching

Provide a `LanguageSwitcher` component. The user should be able to switch between English and မြန်မာ.

The language control should be easily accessible from:

- Desktop: application header
- Mobile: header and/or Settings

The exact implementation may depend on the existing application architecture.

### 31.11 Appearance Settings

The Settings section should include:

- Appearance: Light / Dark / System
- Language: English / Myanmar

The selected preferences should persist between sessions.

### 31.12 UI/UX Rules

1. One primary action per screen where possible.
2. Use color to communicate financial meaning, not only decoration.
3. Do not rely only on color for important states. Icons, labels, or text should also communicate meaning.
4. Prioritize fast transaction entry: Open → Tap Add Transaction → Enter amount → Select category → Save.
5. Avoid unnecessary modals and navigation steps.
6. Provide clear loading, empty, error, and success states.
7. Use skeleton loading where appropriate.
8. Confirm or provide protection for destructive actions.
9. Maintain accessible contrast in both Light and Dark modes.
10. Ensure touch targets are appropriate for mobile devices.

---

## 32. MVP Scope

Keep the first release relatively small.

### Phase 1 — Core

- [x] Authentication (Google OAuth)
- [ ] Dashboard
- [ ] Add income
- [ ] Add expense
- [ ] Transaction history
- [ ] Categories
- [ ] Edit/delete transactions
- [ ] Search/filter

### Phase 2 — Budget

- [ ] Monthly budget
- [ ] Category budgets
- [ ] Budget progress
- [ ] Budget warnings

### Phase 3 — Analytics

- [ ] Spending charts
- [ ] Income/expense charts
- [ ] Monthly reports
- [ ] Spending insights

### Phase 4 — PWA

- [ ] Web manifest
- [ ] Service worker
- [ ] Installable app
- [ ] IndexedDB
- [ ] Offline transaction creation
- [ ] Synchronization

### Phase 5 — Advanced

- [ ] Recurring transactions
- [ ] Savings goals
- [ ] Notifications
- [ ] CSV/PDF export
- [ ] AI assistant

---

## 33. MVP Success Criteria

The MVP is successful if a user can:

1. Sign in with Google.
2. Set their currency.
3. Add income.
4. Add expenses.
5. Categorize expenses.
6. See their current balance.
7. Set a monthly budget.
8. See budget usage.
9. Analyze spending through charts.
10. Use the app offline.
11. Install the application on their phone.
12. Have offline transactions synchronized when they reconnect.

---

## 34. Recommended Development Order

Build it in this order:

```text
1. Project setup
       ↓
2. PostgreSQL + Prisma
       ↓
3. Authentication (Google OAuth)
       ↓
4. Database schema
       ↓
5. Transaction CRUD
       ↓
6. Categories
       ↓
7. Dashboard
       ↓
8. Budget system
       ↓
9. Reports & charts
       ↓
10. PWA
       ↓
11. IndexedDB
       ↓
12. Offline sync
       ↓
13. Recurring transactions
       ↓
14. Savings goals
       ↓
15. Notifications
       ↓
16. AI features
```

### Strongest recommendation

Don't start with the PWA/offline synchronization or AI. Build the financial domain correctly first:

**Transaction → Category → Budget → Dashboard → Analytics**

Then add:

**PWA → IndexedDB → Sync**

That separation will make the architecture much easier to reason about and will give you a much stronger portfolio project than simply making a CRUD expense tracker.