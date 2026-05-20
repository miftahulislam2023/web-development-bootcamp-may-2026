# 💰 Expense Tracker

A modern, full-stack personal finance management application built with **Next.js**, **React**, and **MongoDB**. This application allows users to securely track their expenses, visualize financial data, and manage their budget with a beautiful and responsive user interface.

## ✨ Features

- **🔒 Secure Authentication:**
  - Traditional Email & Password login (encrypted with `bcryptjs`).
  - NextAuth integration for seamless and secure session management.
  - Password Reset / Forgot Password functionality via email (`nodemailer`).
- **📊 Interactive Dashboard:**
  - Visual analytics using `recharts` to track income and expenses over time.
  - Summary cards displaying total balance, recent transactions, and monthly insights.
- **💸 Transaction Management:**
  - Add, edit, and categorize expenses easily.
  - Data validation powered by `zod` and `react-hook-form`.
- **🎨 Beautiful UI & UX:**
  - Fully responsive design built with **Tailwind CSS**.
  - Smooth micro-animations and page transitions using `framer-motion`.
  - Modern icon set provided by `lucide-react`.
  - Light and Dark mode support using `next-themes`.
- **📱 Responsive Design:** Optimized for mobile, tablet, and desktop views.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes (Serverless Functions)
- **Database:** MongoDB (via Mongoose)
- **Authentication:** NextAuth.js
- **Form Management:** React Hook Form + Zod
- **Data Visualization:** Recharts
- **Email Service:** Nodemailer (Tested with Mailtrap)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed along with a MongoDB database (e.g., [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)).

### 1. Clone the repository

```bash
git clone https://github.com/your-username/expense-tracker.git
cd expense-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following configuration:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_string

# Email Service (Nodemailer / Mailtrap)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

---

## 📁 Project Structure

```plaintext
├── src/
│   ├── app/             # Next.js App Router (Pages & API Routes)
│   ├── components/      # Reusable React components (UI, Forms, Charts)
│   ├── lib/             # Utility functions and Database connection logic
│   └── models/          # Mongoose Database Models (User, Transaction, etc.)
├── public/              # Static assets (images, icons)
├── .env.local           # Environment variables (not tracked by Git)
└── package.json         # Project dependencies and scripts
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/expense-tracker/issues).

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📝 License

This project is licensed under the MIT License.
