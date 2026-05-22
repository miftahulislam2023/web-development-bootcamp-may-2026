# Fylestash

> A secure, minimalist file stashing system.

**Fylestash** is a high-performance, monochrome-themed file hosting service designed for users who value simplicity and security. Built with a robust split-stack architecture, it provides a seamless experience for uploading, managing, and sharing files with high-contrast precision.

**[Live Demo Here](https://fylestash.vercel.app/)**

---

## Features

- **Secure Authentication** using **JWT** and **Bcryptjs**. Password rest feature implemented using **Resend** API.
- **Uploads:** File uploads integrated with **Uploadthing**, supporting various file types.
- **Search:** Case-insensitive global search.
- **Public/Private Sharing:** Generate unique shareable links for files.
- **Monochrome UI:** Minimalist, high-contrast interface built with **Shadcn UI** and **Tailwind CSS**.

---

## Tech Stack

### Frontend

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Icons:** Lucide React

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (NeonDB)
- **ORM:** Prisma
- **Authentication:** JWT (JsonWebToken) & Bcryptjs
- **Communication:** Resend (Email Service)

> [!NOTE]
> Please note that **Resend** is currently configured in **Sandbox Mode** (free version). Emails (like password recovery) will only be sent to the admin email address configured in the environment variables.

---

## Setup & Installation

### Prerequisites

- Node.js (v18+)
- npm
- PostgreSQL instance (or NeonDB account)
- Uploadthing account
- Resend account

### 1. Clone the Repository

```bash
git clone https://github.com/mehedihasankanon/web-development-bootcamp-may-2026.git
cd mehedihasankanon
```

### 2. Install Dependencies

Install dependencies for both the root, frontend, and backend:

```bash
# From the root directory
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 3. Environment Variables

Create a `.env` file in the `backend` directory and add the variables specified in the `.env.example` file.
Do the same for the frontend `.env.local` file.

### 4. Database Initialization

Push the schema to your database:

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 5. Run the Application

You can run both servers concurrently from the root:
```bash

# From the root
npm run dev:all
```

---
