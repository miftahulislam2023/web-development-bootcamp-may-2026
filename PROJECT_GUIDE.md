# FinanceApp - Complete Project Guide

A production-ready personal finance dashboard application with complete backend (Express.js + Prisma) and frontend (Next.js + React Query) implementation.

## 📋 Project Overview

**FinanceApp** is a comprehensive financial management system that enables users to:

- Track income and expenses
- Manage multiple accounts
- Create and monitor budgets
- Categorize transactions
- View financial analytics and trends
- Receive notifications and alerts

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   FinanceApp System                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Frontend (Next.js)           Backend (Express.js)       │
│  ├── Dashboard                ├── Auth Service           │
│  ├── Transactions             ├── Transaction Service    │
│  ├── Budgets                  ├── Budget Service         │
│  ├── Settings                 ├── Category Service       │
│  ├── React Query              └── Prisma ORM            │
│  └── Zustand Store                                       │
│                                                           │
│                   ↔ REST API (JSON)                      │
│                                                           │
│              Database (PostgreSQL)                        │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun runtime
- PostgreSQL 12+
- Git

### Backend Setup

```bash
cd backend

# 1. Install dependencies
bun install

# 2. Configure database
cp .env.example .env
# Edit .env and set DATABASE_URL

# 3. Run migrations
bun run db:migrate

# 4. Seed default data (optional)
bun run db:seed

# 5. Start development server
bun run dev
# Backend runs on http://localhost:3000
```

**Verify backend**:

```bash
curl http://localhost:3000/api/health
```

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
bun install

# 2. Configure environment
# .env.local already set to http://localhost:3000/api

# 3. Start development server
bun run dev
# Frontend runs on http://localhost:3001
```

**Access frontend**: http://localhost:3001

## 📊 Database Schema

### Core Models

**User**

- Unique identifier, email, name, password hash, role, status, avatar
- Relationships: 1→∞ Session, Account, Transaction, Budget, Notification

**Account**

- Type (checking, savings, credit), balance, currency
- Relationships: 1→∞ Transaction

**Transaction**

- Type (income/expense/transfer), amount, category, date, description
- Relationships: 1→1 Account, Category, Budget (optional)

**Category**

- Name, type (income/expense), user-specific or global
- Relationships: 1→∞ Transaction, Budget

**Budget**

- Limit amount, period (monthly/yearly), alert threshold
- Relationships: 1→1 Category

**Session**

- JWT refresh tokens, expiry, device info

**Attachment** (optional)

- Receipt images/documents for transactions

**AuditLog**

- Track all user actions for compliance

### Relationships Diagram

```
User (1)
 ├── (∞) Session
 ├── (∞) Account
 │    └── (∞) Transaction
 │         ├── (1) Category
 │         └── (1) Budget
 ├── (∞) Category
 ├── (∞) Budget
 ├── (∞) Notification
 ├── (∞) Attachment
 └── (1) AuditLog
```

## 🔐 Authentication Flow

```
1. Register/Login
   ├── User enters credentials
   └── Backend validates & generates JWT (15min access + 7day refresh)

2. Access Protected Routes
   ├── Frontend checks localStorage for token
   ├── Includes token in Authorization header
   └── Backend validates JWT

3. Token Expiration
   ├── 401 response received
   ├── Automatic refresh via refresh token endpoint
   ├── New access token stored
   └── Request retried

4. Logout
   ├── Frontend clears tokens
   ├── Backend invalidates refresh token
   └── Redirect to login
```

## 📁 Project Structure

```
FinanceApp/
├── backend/
│   ├── src/
│   │   ├── index.ts                    # Bootstrap
│   │   ├── core/
│   │   │   ├── BaseController.ts      # Base class for controllers
│   │   │   ├── BaseModule.ts          # Base class for modules
│   │   │   ├── IgnitorApp.ts          # Main app class
│   │   │   ├── config/                # Configuration
│   │   │   ├── errors/                # Error handling
│   │   │   └── logging/               # Logger setup
│   │   ├── Modules/                   # Feature modules
│   │   │   ├── Auth/                  # Authentication
│   │   │   ├── Transactions/          # Transaction management
│   │   │   ├── Budgets/               # Budget management
│   │   │   └── Categories/            # Category management
│   │   ├── middleware/                # Express middleware
│   │   ├── providers/                 # Service providers (Prisma)
│   │   ├── lib/                       # Utilities
│   │   └── types/                     # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma              # Data models
│   │   ├── migrations/                # DB migrations
│   │   └── seed.ts                    # Seeding script
│   ├── bruno/                         # API testing collection
│   ├── docker-compose.yml             # PostgreSQL setup
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md

└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── (dashboard)/           # Protected dashboard routes
    │   │   ├── auth/                  # Login/register pages
    │   │   ├── layout.tsx             # Root layout
    │   │   └── globals.css            # Global styles
    │   ├── components/
    │   │   ├── ui/                    # Base UI components
    │   │   ├── layout/                # Layout components
    │   │   ├── cards/                 # Feature cards
    │   │   ├── charts/                # Data visualization
    │   │   └── forms/                 # Form components
    │   └── lib/
    │       ├── api.ts                 # API client
    │       ├── store.ts               # Zustand stores
    │       ├── hooks.ts               # React Query hooks
    │       └── utils.ts               # Utilities
    ├── public/                        # Static assets
    ├── .env.local                     # Environment config
    ├── next.config.ts
    ├── tsconfig.json
    ├── tailwind.config.js
    └── package.json
```

## 🔌 API Endpoints

### Authentication (`/auth/v1`)

```
POST   /register           # Create new user
POST   /login              # Login user
POST   /logout             # Logout (invalidate token)
GET    /me                 # Get current user
PATCH  /me                 # Update profile
POST   /refresh            # Refresh access token
```

### Transactions (`/transactions/v1`)

```
GET    /                   # List transactions (paginated, filterable)
POST   /                   # Create transaction
GET    /:id                # Get single transaction
PATCH  /:id                # Update transaction
DELETE /:id                # Delete transaction
GET    /summary            # Get financial summary
```

### Categories (`/categories/v1`)

```
GET    /                   # List categories (global + user)
POST   /                   # Create category
```

### Budgets (`/budgets/v1`)

```
GET    /                   # List all budgets
POST   /                   # Create budget
GET    /:id                # Get single budget
PATCH  /:id                # Update budget
DELETE /:id                # Delete budget
```

## 🛠️ Tech Stack

### Backend

| Component  | Technology   | Version  |
| ---------- | ------------ | -------- |
| Runtime    | Bun          | Latest   |
| Framework  | Express.js   | 5.1.0    |
| Language   | TypeScript   | 5.x      |
| ORM        | Prisma       | 7.2.0    |
| Database   | PostgreSQL   | 12+      |
| Auth       | JWT + bcrypt | Standard |
| Validation | Zod          | 4.1.1    |

### Frontend

| Component      | Technology      | Version |
| -------------- | --------------- | ------- |
| Runtime        | Node.js / Bun   | 18+     |
| Framework      | Next.js         | 16.2.6  |
| UI Library     | React           | 19.2.4  |
| Language       | TypeScript      | 5.x     |
| Styling        | TailwindCSS     | 4.x     |
| Components     | shadcn/ui       | Latest  |
| State (Server) | React Query     | 5.28.0  |
| State (Client) | Zustand         | 4.4.1   |
| Forms          | React Hook Form | 7.48.0  |
| HTTP           | Axios           | 1.6.2   |
| Charts         | Recharts        | 2.10.3  |
| Icons          | Lucide React    | 1.14.0  |

## 📝 Configuration

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/financeapp"
NODE_ENV="development"
PORT=3000
JWT_SECRET="your-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🧪 Testing

### API Testing with Bruno/Postman

```bash
cd backend/bruno

# Import collection
# File: FinanceApp.postman_collection.json

# Import environment
# File: FinanceApp.postman_environment.json

# Test flow:
1. Register user
2. Login (saves access token)
3. Test protected endpoints
```

### Test Data

Default seeded user (via `bun run db:seed`):

```
Email: admin@example.com
Password: password123
```

Default categories created:

- Groceries (expense)
- Salary (income)
- Utilities (expense)
- Entertainment (expense)
- Transportation (expense)
- Healthcare (expense)

## 🚢 Deployment

### Backend Deployment (Heroku/Railway/Vercel)

```bash
# Build
bun run build

# Add Procfile or deployment config
# Set DATABASE_URL in production environment
# Set JWT secrets in production
```

### Frontend Deployment (Vercel/Netlify)

```bash
# Deploy to Vercel (recommended for Next.js)
vercel deploy

# Or build and deploy elsewhere
bun run build
```

## 📊 Features Breakdown

### Phase 1: MVP ✅ COMPLETE

- [x] User authentication (register/login/logout)
- [x] Transaction CRUD with filtering & pagination
- [x] Budget creation & tracking
- [x] Category management
- [x] Dashboard with KPIs and charts
- [x] Settings page

### Phase 2: Enhancement

- [ ] Email notifications for budget alerts
- [ ] Recurring transactions
- [ ] Receipt attachment system
- [ ] Multiple currencies support
- [ ] Monthly/yearly reports

### Phase 3: Advanced

- [ ] Budget forecasting
- [ ] Spending patterns analytics
- [ ] Goal tracking
- [ ] Money transfer between accounts
- [ ] Mobile app (React Native)

## 🐛 Troubleshooting

### Backend Issues

**"Cannot find module 'prisma'"**

```bash
bun install
```

**"Connection refused" to database**

```bash
# Start PostgreSQL
docker-compose up -d

# Or verify DATABASE_URL in .env
```

**Migration errors**

```bash
# Reset and re-migrate (development only!)
bun run db:reset
```

### Frontend Issues

**"Failed to fetch" errors**

- Verify backend running on port 3000
- Check NEXT_PUBLIC_API_URL in .env.local
- Clear browser cache/localStorage

**Auth token not persisting**

- Check localStorage is not disabled
- Verify NEXT_PUBLIC_API_URL is correct

**Components not styling**

- Run `bun run build` to generate CSS
- Check TailwindCSS is installed

## 📚 Documentation

- [Backend README](./backend/README.md) - Backend setup, API docs, endpoints
- [Frontend README](./frontend/FRONTEND_README.md) - Frontend setup, components, hooks
- [Backend Implementation](./backend/BACKEND_IMPLEMENTATION.md) - Detailed backend docs
- [Frontend Implementation](./frontend/FRONTEND_IMPLEMENTATION.md) - Detailed frontend docs
- [OpenAPI Spec](./backend/openapi.yaml) - API specification
- [Postman Collection](./backend/bruno/FinanceApp.postman_collection.json) - API testing

## 📧 Email Notifications Setup

To enable email notifications, configure Mailtrap in backend:

```env
# .env
MAILTRAP_API_TOKEN="your-token"
MAILTRAP_SENDER_EMAIL="noreply@financeapp.com"
```

## 🔒 Security Best Practices

- ✅ Password hashing with bcrypt
- ✅ JWT token expiration (15 min access, 7 day refresh)
- ✅ HttpOnly cookies for refresh tokens
- ✅ CORS configured for frontend domain
- ✅ Input validation with Zod
- ✅ Rate limiting recommended
- ✅ HTTPS in production required

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is part of the FinanceApp - Personal Finance Dashboard system.

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push branch: `git push origin feature/your-feature`
4. Open pull request

## 📞 Support

For issues or questions:

1. Check the troubleshooting section
2. Review documentation files
3. Check API logs in backend console
4. Review browser console for frontend errors

## 🎯 Next Steps

1. Start backend: `cd backend && bun run dev`
2. Start frontend: `cd frontend && bun run dev`
3. Access http://localhost:3001
4. Register and start using the app
5. Test APIs with Postman collection
6. Deploy to production

---

**Status**: 🟢 Production Ready - Complete backend and frontend implementation with all core features implemented and tested.
