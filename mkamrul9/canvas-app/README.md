<div align="center">

# 🎨 Kidraw

**The infinite visual workspace for modern engineering teams.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-1B222D?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

<p align="center">
	<a href="#-features">Features</a> •
	<a href="#-live-demo">Live Demo</a> •
	<a href="#-tech-stack">Tech Stack</a> •
	<a href="#-getting-started">Getting Started</a> •
	<a href="#-architecture--engineering">Architecture</a>
</p>

</div>

---

## 🚀 Overview

Kidraw is a production-grade, infinite canvas SaaS application designed for full-stack developers, system architects, and product managers. Whether you are mapping out the real-time websocket infrastructure for collaborative apps like KanbanSync or wireframing the complex Stripe payment flow logic for platforms like Funding Panda, Kidraw provides a blazing-fast, visual environment to engineer your ideas without constraints.

## 🔗 Live Demo

Experience the live application here: [https://kidraw-canvas.vercel.app/](https://kidraw-canvas.vercel.app/)

---

## ✨ Features

- **♾️ Infinite Panning & Zoom:** Navigate a boundless workspace with smooth `Ctrl/Cmd + Scroll` zoom mechanics, paired with an interactive inverse-kinematic Minimap HUD.
- **📐 Smart Geometry & Vector Engine:** Utilize freehand pens with tension-smoothing, text stamping, and a robust library of geometric shapes.
- **🎯 Ray-Casting Lasso Selection:** Select multiple complex objects instantly using an advanced freehand lasso tool powered by point-in-polygon ray-casting mathematics.
- **🪄 Presentation Tools:** Guide team focus during pitch meetings with a dynamic laser pointer that features a fading coordinate tail.
- **🖼️ Native Multi-Format Export Engine:** Export your architectural diagrams to high-resolution PNG, JPEG, or scalable SVG. The custom export compiler natively renders CSS background grids and dot patterns directly into the final image blob.
- **🔐 Authentication & Cloud Sync:** Secure OAuth integration (GitHub & Google) via Auth.js. Workspaces are saved in real-time to a serverless PostgreSQL database using Prisma ORM.
- **🤝 Collaborative Foundation:** Role-based sharing system (Viewer, Commenter, Editor) and real-time sticky-note commenting functionality.
- **🌙 Midnight Aurora Glassmorphism:** A premium, fully responsive UI built with Tailwind CSS, featuring frosted glass components, dynamic ambient lighting, and omni-routing navigation.

---

## 🛠️ Tech Stack

### Frontend Architecture

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Canvas Engine:** HTML5 Canvas, [Konva.js](https://konvajs.org/), React-Konva
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/), Radix UI primitives, Lucide Icons

### Backend & Infrastructure

- **Database:** [NeonDB](https://neon.tech/) (Serverless PostgreSQL)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Auth.js)
- **Deployment:** [Vercel](https://vercel.com)

---

## 💻 Getting Started

Follow these instructions to set up Kidraw locally on your machine.

### Prerequisites

- Node.js 18+ installed
- A NeonDB (or any PostgreSQL) database connection string
- OAuth credentials from GitHub and Google Developer Consoles

### 1. Clone the Repository

```bash
git clone https://github.com/mkamrul9/canvas-app.git
cd canvas-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and populate it with your specific keys:

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Next Auth Configuration
NEXTAUTH_SECRET="generate_a_random_secure_string_here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GITHUB_ID="your_github_oauth_client_id"
GITHUB_SECRET="your_github_oauth_client_secret"
GOOGLE_CLIENT_ID="your_google_oauth_client_id"
GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"
```

### 4. Initialize the Database

Push the Prisma schema to your database and generate the Prisma Client:

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 to view the application.

---

## 🏗️ Architecture & Engineering Highlights

**Off-Screen Canvas Compilation:** To bypass the limitations of HTML5 canvas omitting CSS backgrounds during export, Kidraw utilizes an off-screen compilation strategy. The engine intercepts the download event, mathematically draws the background grids (`ctx.moveTo`) onto a hidden layer, overlays the Konva data URL, and compiles a merged image blob in milliseconds.

**Destructive Eraser Layering:** The eraser tool avoids destroying the background pattern by utilizing `globalCompositeOperation="destination-out"`, allowing users to naturally erase shape pixels on the foreground while keeping the background intact.

**Performance Optimization:** Rather than rendering thousands of heavy grid lines via React-Konva, the infinite background relies on highly optimized Tailwind CSS radial-gradient backgrounds that sync via React state to the `camera.x` and `camera.y` coordinates.

---

## 👨‍💻 Author

Md. Kamrul Islam

GitHub: @mkamrul9

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
