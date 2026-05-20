# 💰 Premium Expense Tracker with Gemini AI Chatbot

A modern, full-stack personal finance and budget management system engineered with **Next.js 16 (App Router)**, **React 19**, and **MongoDB**. This application features an ultra-premium, responsive UI/UX built around a cohesive purple/indigo identity, a smart **Gemini-powered AI Advisor**, interactive analytics, and professional PDF/Excel reporting capabilities.

---

## 🎨 Design System & Aesthetic Upgrade
The application has been transformed to present a luxury, high-tech financial product aesthetic:
* **Premium Typography**: Integrates the **`Plus Jakarta Sans`** font globally via Next.js Font Optimization to elevate readibility and modern visual flair.
* **Cohesive 3-Color Guideline**: Avoids generic zinc/gray panels. Strictly adheres to a curated 3-color palette utilizing premium purple tones (`#f4f3ff` Light Canvas, `#0f0920` Space-Indigo Dark Canvas, `#805af8` Interactive Primaries).
* **Smooth Micro-Animations**: Interactive elements, modal transitions, and navigation menus are brought to life with tap-scaling and ease-in-out effects using **`framer-motion`**.
* **Unified Dark Theme**: The entire portal dynamically transitions between light and dark modes with complete visual consistency and custom popover styling.

---

## ✨ Key Features

### 1. 📊 Interactive Analytics & Dashboard
* **Dynamic Recharts Charts**: Instantly tracks total income vs expenses using modern curved lines and customized categorical pie charts.
* **Dark Mode Axis Fix**: Handled custom Recharts ticks using native CSS variables (`var(--color)`) to ensure labels, months, and currency symbols (৳) are fully visible in high-contrast tones on dark screens.
* **Real-time Overview Cards**: Displays live balances, recent transaction lists, and daily averages with loading skeleton states.

### 2. 🤖 Gemini AI Financial Advisor & Chatbot
* **Vercel AI SDK Integration**: Powered by `@ai-sdk/google` and `@ai-sdk/react` to deliver seamless, real-time message streaming.
* **Smart Assistant Endpoint**: Uses `gemini-flash-latest` (Gemini 1.5 Flash) with an optimized system prompt to serve as a personal financial counselor.
* **Smart Insights Dashboard**: Computes real-time saving rates, evaluates spending behaviors, and lists actionable smart budget alerts automatically.

### 3. 🔒 Secure Authentication & Password Recovery
* **Secure Sessions**: Uses **`NextAuth.js`** for password encryption and secure cookie-based session persistence.
* **Email Recovery Flow**: Integrates **`Nodemailer`** to dispatch secure password reset emails with cryptographically generated, one-hour expiration tokens.
* **Premium Input Architecture**: Uniform form heights (`h-10`) with glowing lavender outline states on focus, error handling via `react-hook-form`, and validation powered by `zod`.

### 4. 📥 Financial Reporting Suite
* **PDF Report Generation**: Exports full transaction logs into a professional, clean PDF table (`jspdf` + `jspdf-autotable`) with correct HSL/hex alignment.
* **Excel Sheet Export**: Downloads transaction archives in standardized `.xlsx` spreadsheet format (`xlsx` SheetJS) instantly.

---

## 🛠️ Tech Stack

* **Core Framework**: Next.js 16 (App Router), React 19
* **Database**: MongoDB Atlas + Mongoose ODM
* **Styling & Theme**: Tailwind CSS v4, Next Themes
* **AI Engine**: Google Generative AI (Gemini 1.5 Flash) via Vercel AI SDK
* **State & Forms**: React Hook Form, Zod Validation
* **Visuals**: Recharts v3, Framer Motion, Lucide Icons
* **Authentication**: NextAuth.js, Nodemailer

---

## 🚀 Local Installation & Setup

Follow these simple steps to set up and run the application locally.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed along with a MongoDB database (local or MongoDB Atlas).

### 1. Clone & Navigate
```bash
git clone https://github.com/MD-Nayeem909/web-development-bootcamp-may-2026.git
cd web-development-bootcamp-may-2026/MD-Nayeem909
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the `MD-Nayeem909` folder and add your credentials:
```env
# Database
MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/expense_tracker

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secure_secret_string

# Gemini API Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Email SMTP Setup (Tested with Mailtrap / Gmail)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
```

### 4. Run Local Development Server
Launch the Next.js Turbo-charged dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🤝 Contributing
Contributions, issues, and suggestions are welcome! Feel free to checkout the main bootcamp repository.

---

## 📝 License
This project is licensed under the MIT License.
