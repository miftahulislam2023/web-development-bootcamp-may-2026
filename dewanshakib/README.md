# Khorcha - Personal Finance Tracker

Khorcha meaning "Ledger/Account Book" is a modern personal finance management application that helps you track income, expenses, and visualize your financial journey with beautiful charts.

## Features

- **Transaction Management** - Record income and expenses with descriptions and categories
- **Custom Categories** - Create personalized categories for both income and expense types
- **Visual Analytics** - Interactive radar charts and line charts for financial insights
- **Monthly & Yearly History** - Track financial progress over time with daily, monthly, and yearly summaries
- **Calendar View** - Browse and filter transactions by date
- **Dark/Light Theme** - Toggle between themes for comfortable viewing
- **Secure Authentication** - Google OAuth sign-in for privacy and data security

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **Styling**: Tailwind CSS 4 + Shadcn UI
- **Charts**: Recharts
- **UI Components**: Radix UI + Shadcn

## Project Structure

```
dewanshakib/
├── app/                        # Next.js App Router
│   ├── (private)/             # Protected dashboard routes
│   │   └── dashboard/         # Main dashboard pages
│   │       ├── page.tsx        # Dashboard overview
│   │       ├── categories/     # Category management
│   │       ├── transactions/  # Transaction management
│   │       └── account/        # User account settings
│   ├── api/                   # API routes
│   │   └── auth/              # Authentication endpoints
│   ├── globals.css            # Global styles & theme variables
│   └── page.tsx               # Landing page
├── components/                 # React components
│   ├── layout/                # Layout components (Navbar, Sidebar)
│   ├── pages/                 # Page-specific components
│   │   ├── home/              # Landing page sections
│   │   └── dashboard/         # Dashboard components
│   └── ui/                    # Reusable UI components
├── prisma/
│   └── schema.prisma          # Database schema
├── public/assets/             # Static assets (images, logos)
└── lib/                       # Utilities & generated code
```

## Database Schema

The application uses PostgreSQL with the following key models:

- **User** - Stores user information and relations
- **Transactions** - Records of income/expense with amount, type, category
- **Category** - Custom categories for transactions
- **MonthHistory** - Daily aggregated income/expense data
- **YearHistory** - Monthly aggregated income/expense data

## What I Learned

### Prisma Transactions Practically

Working with Prisma in a real-world application taught me:

- **Defining Models** - Creating relationships between User, Transaction, Category, and History models
- **Relations** - Using `@relation` to establish foreign key relationships between tables
- **Queries** - Performing CRUD operations with Prisma Client
- **Aggregations** - Using Prisma to calculate sum of income/expense for history tracking
- **Unique Constraints** - Using `@@unique` to prevent duplicate entries (e.g., one history entry per day per user)

### Working with Charts

Implemented data visualization using Recharts:

- **Radar Chart** - Displaying category-wise spending distribution
- **Line/Area Chart** - Showing transaction trends over time
- **Data Transformation** - Converting database records into chart-friendly formats
- **Responsive Charts** - Making charts work on different screen sizes
- **Theme Support** - Adapting chart colors for light/dark modes

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Google Cloud Project (for OAuth)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd dewanshakib
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:
   Create a `.env` file with:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/khorcha
BETTER_AUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Set up the database:

```bash
pnpm dlx prisma generate
pnpm dlx prisma db push
```

5. Run the development server:

```bash
pnpm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run start` - Start production server
- `pnpm run lint` - Run ESLint

---

## Live Preview

Check out the live version of Khorcha: **[https://khorcha-2026.vercel.app/](https://khorcha-2026.vercel.app/)**
