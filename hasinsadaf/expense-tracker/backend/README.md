# FinanceFlow Backend API

A robust and secure REST API backend for personal finance management built with Next.js 16 and Supabase. Provides complete expense tracking, budget management, user authentication, and profile management capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Security](#security)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)

## 📊 Overview

FinanceFlow Backend is the server-side application that powers the FinanceFlow personal finance management platform. It provides RESTful APIs for:

- **Authentication**: Secure user registration and login with JWT tokens
- **Expense Management**: Create, read, update, and delete expense records
- **Budget Management**: Set and track monthly spending limits per category
- **Category Management**: Manage expense categories with color coding
- **User Profiles**: Manage user profile information and settings
- **Data Persistence**: All data stored securely in Supabase PostgreSQL database

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.6 | Server framework & API routes |
| Node.js | 18+ | Runtime environment |
| Supabase | 2.56.1 | PostgreSQL database & authentication |
| JWT | 9.0.3 | Token-based authentication |
| Bcryptjs | 3.0.3 | Password hashing |
| ESLint | 9 | Code quality & linting |

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For version control
- **Supabase Account**: Free tier available at [supabase.com](https://supabase.com)

Verify installations:
```bash
node --version    # Should be v18.0.0+
npm --version     # Should be v9.0.0+
git --version
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd expense-tracker/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the backend directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Configuration
JWT_SECRET=a_random_32_character_string_here

# Frontend Configuration (for CORS)
FRONTEND_URL=http://localhost:3000
```

**How to get Supabase credentials:**
1. Go to [app.supabase.com](https://app.supabase.com)
2. Create a new project
3. Copy the `URL` and `Service Role Key` from Project Settings > API
4. Generate a strong JWT secret:
   ```bash
   openssl rand -hex 32
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role API key | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT token signing | ✅ Yes |
| `FRONTEND_URL` | Frontend URL for CORS headers | ✅ Yes |

### Database Setup

The database schema is automatically managed by Supabase. Required tables:

- **profiles**: User profile information
- **categories**: Expense categories
- **expenses**: Individual expense records
- **budgets**: Monthly budget limits per category

## 🎯 Running the Application

### Development Mode

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Production Build

```bash
npm run build
npm start
```

### Linting

Check code quality:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint -- --fix
```

## 📚 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (201):**
```json
{
  "id": "user-id",
  "email": "john@example.com",
  "token": "eyJhbGc..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

#### Change Password
```http
POST /auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "oldPassword": "CurrentPassword123!",
  "newPassword": "NewPassword123!"
}
```

### Profile Endpoints

#### Get User Profile
```http
GET /profile
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2026-05-16T10:00:00Z"
}
```

#### Update Profile
```http
PUT /profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Jane Doe"
}
```

### Category Endpoints

#### Get All Categories
```http
GET /categories
Authorization: Bearer {token}
```

#### Create Category
```http
POST /categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Food",
  "color": "#FF6B6B"
}
```

### Expense Endpoints

#### Get All Expenses
```http
GET /expenses
Authorization: Bearer {token}
```

**Query Parameters:**
- `month` (optional): Filter by month (YYYY-MM format)
- `category_id` (optional): Filter by category

#### Create Expense
```http
POST /expenses
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Grocery shopping",
  "amount": 150.50,
  "category_id": "category-uuid",
  "date": "2026-05-16"
}
```

#### Update Expense
```http
PUT /expenses/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Updated description",
  "amount": 200.00,
  "date": "2026-05-16"
}
```

#### Delete Expense
```http
DELETE /expenses/{id}
Authorization: Bearer {token}
```

### Budget Endpoints

#### Get All Budgets
```http
GET /budgets
Authorization: Bearer {token}
```

**Response includes category details:**
```json
[
  {
    "id": "budget-id",
    "category_id": "cat-id",
    "monthly_limit": 500.00,
    "month": "2026-05",
    "categories": {
      "id": "cat-id",
      "name": "Food",
      "color": "#FF6B6B"
    }
  }
]
```

#### Set/Update Budget
```http
POST /budgets
Authorization: Bearer {token}
Content-Type: application/json

{
  "category_id": "category-uuid",
  "monthly_limit": 500.00,
  "month": "2026-05"
}
```

*Note: Automatically updates existing budget if it exists for the same category and month.*

#### Update Budget Limit
```http
PUT /budgets/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "monthly_limit": 600.00
}
```

#### Delete Budget
```http
DELETE /budgets/{id}
Authorization: Bearer {token}
```

### Health Check Endpoint

#### API Health
```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-05-16T10:00:00Z"
}
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/              # Authentication routes
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── change-password/
│   │   │   ├── budgets/           # Budget management
│   │   │   │   └── [id]/
│   │   │   ├── categories/        # Category management
│   │   │   ├── expenses/          # Expense management
│   │   │   │   └── [id]/
│   │   │   ├── profile/           # User profile
│   │   │   ├── health/            # Health checks
│   │   │   └── [...all]/          # Proxy for undefined routes
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── lib/
│   │   ├── auth.js                # JWT & authentication utilities
│   │   ├── supabase.js            # Supabase client initialization
│   │   ├── httpError.js           # Error handling utilities
│   │   ├── validate.js            # Input validation
│   │   └── corsOrigins.js         # CORS configuration
│   └── proxy.js
├── next.config.mjs
├── package.json
└── .env.local
```

## 🔐 Authentication

### JWT Token Flow

1. **Token Generation**: JWT created during login/registration
2. **Token Storage**: Stored securely on client (cookie + localStorage)
3. **Token Usage**: Sent in `Authorization: Bearer {token}` header
4. **Token Verification**: Validated on each protected endpoint

### Token Structure
```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "id": "user-id", "email": "user@example.com" }
Signature: HMACSHA256(secret)
```

### Protected Routes

All routes except `/auth/register` and `/auth/login` require a valid JWT token in the `Authorization` header.

Example:
```bash
curl -H "Authorization: Bearer eyJhbGc..." http://localhost:3001/api/expenses
```

## ⚠️ Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Successful GET/PUT/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

### Error Response Format
```json
{
  "message": "User already exists with this email",
  "status": 400
}
```

## 🛡️ Security

### Best Practices Implemented

✅ **Password Security**
- Bcryptjs hashing with salt rounds
- Never stored in plaintext
- Validated on every login

✅ **JWT Security**
- Short expiration times (typically 7 days)
- Signed with strong secret
- Validated on protected routes

✅ **CORS Protection**
- Whitelist allowed origins
- Prevents unauthorized cross-origin requests
- Configurable via `FRONTEND_URL`

✅ **Input Validation**
- All inputs validated before database operations
- Prevents SQL injection
- Type checking for all parameters

✅ **Authentication Checks**
- Every protected endpoint verifies user identity
- Users can only access their own data
- Row-level security in database

### Security Headers

Recommended headers (implement in production):
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

## 🚢 Deployment

### Deployment Options

#### Option 1: Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel
```

Set environment variables in Vercel dashboard.

#### Option 2: Traditional VPS

```bash
# Build
npm run build

# Start with process manager (PM2)
npm install -g pm2
pm2 start "npm start" --name "financeflow-backend"
pm2 save
pm2 startup
```

#### Option 3: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package* ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
EXPOSE 3001
```

Build and run:
```bash
docker build -t financeflow-backend .
docker run -p 3001:3001 --env-file .env.local financeflow-backend
```

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging & monitoring
- [ ] Set appropriate CORS origins
- [ ] Enable rate limiting
- [ ] Set up health checks
- [ ] Use environment-specific configurations

## 👥 Contributing

### Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** and test locally
   ```bash
   npm run dev
   ```

3. **Run linter**
   ```bash
   npm run lint -- --fix
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add budget alerts feature"
   ```

5. **Push and create pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Use camelCase for variables and functions
- Use descriptive names
- Add comments for complex logic
- Follow ESLint rules
- Maximum line length: 100 characters

## 🔧 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port
npm run dev -- -p 3002
```

#### 2. Database Connection Error
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check Supabase project is active
- Test connection:
  ```bash
  curl https://your-supabase-url/rest/v1/
  ```

#### 3. Authentication Failing
- Ensure JWT_SECRET is set correctly
- Check token format in request header
- Verify token hasn't expired

#### 4. CORS Errors
- Check `FRONTEND_URL` matches your frontend origin
- Verify frontend is making requests with correct headers
- Check browser console for exact error

### Logs and Debugging

Enable verbose logging:
```bash
NODE_DEBUG=* npm run dev
```

Check Supabase logs:
1. Go to Supabase Dashboard
2. Navigate to Logs
3. Filter by request

---

**Last Updated**: May 16, 2026
**Version**: 1.0.0
**Status**: Production Ready
