# BudgeTX

A clean and straightforward personal finance tracker that helps you manage expenses, set budgets, and stay on top of your money — without the noise.

## Video Demo

[![BudgeTX Demo](https://img.youtube.com/vi/sTjnNV12kgw/0.jpg)](https://youtu.be/sTjnNV12kgw?si=UX91tcchYdVYu-bN)

## Features

- Track Expenses & Income — Log transactions in seconds with categories and accounts
- Multi-Account Dashboard — Manage checking, savings, and credit cards from one place
- Smart Budgeting — Set monthly budgets and get alerts before you overspend
- Recurring Transactions — Automate rent, subscriptions, and bills
- Monthly Reports — See where your money went with a simple monthly breakdown
- Email Alerts — Get notified when you're close to your budget limit
- Beautiful Landing Page — Clean, modern UI built with shadcn components

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL (via Supabase) |
| ORM | Prisma v7 |
| Auth | Clerk |
| Email | Resend |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Supabase recommended)
- Clerk account (for authentication)
- Resend API key (for email alerts)

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/itzmahtab/web-development-bootcamp-may-2026
   cd web-development-bootcamp-may-2026/BudgeTX
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env` and fill in your credentials:
   - Clerk publishable & secret keys
   - Database URL (Supabase connection string)
   - Resend API key

4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

5. Start the dev server:
   ```bash
   npm run dev
   ```

## Project Structure

```
BudgeTX/
├── actions/          # Server actions (budget, transactions, email, etc.)
├── app/              # Next.js App Router pages & layouts
│   ├── (auth)/       # Sign-in / Sign-up pages
│   ├── (main)/       # Main app (dashboard, accounts, transactions)
│   └── emails/       # Email templates (React Email)
├── components/       # React components
│   └── ui/           # shadcn/ui components
├── data/             # Static data (landing page content, categories)
├── hooks/            # Custom React hooks
├── lib/              # Utilities (Prisma client, helpers, middleware)
├── prisma/           # Database schema & migrations
└── public/           # Static assets (images, icons)
```

## How It Works

1. Sign up — Create an account via Clerk (no credit card needed)
2. Add an account — Create a checking or savings account
3. Log transactions — Record income and expenses with categories
4. Set a budget — Define a monthly spending limit
5. Track progress — The dashboard shows your spending vs budget in real time

When you exceed 80% of your budget, BudgeTX sends you an email alert automatically.

## License

MIT
