# 🚀 Nexora Studio — Professional Visual Website Builder

Nexora Studio is a state-of-the-art, full-stack visual development platform inspired by industry leaders like Webflow and Framer. It empowers users to create high-performance, responsive websites using a massive library of **50+ prebuilt components** and a sophisticated **drag-and-drop editor**.

---

## 🔗 Project Links & Demo
- **Live Demo:** [🌐 View Live Link Here](https://nexora-studio-ten.vercel.app/)



## ✨ Key Features

### 🎨 Visual Core
- **Advanced Drag & Drop Engine** — Built with `dnd-kit` for ultra-smooth component placement and reordering.
- **50+ Professional Components** — Including 10+ Heros, 5+ Navbars, Bento Grids, Pricing Tables, and more.
- **Real-time Responsive Preview** — Instant toggle between Desktop, Tablet, and Mobile viewports.
- **Precision Styling Inspector** — Powerful sidebar to control colors, spacing (margin/padding), typography, and alignment.

### 🛠️ Developer & Power User Tools
- **Template Marketplace** — Pick a high-quality template (SaaS, Portfolio, Ecommerce) and start building instantly.
- **Smart Data Persistence** — Automatic saving to PostgreSQL database ensuring your work is never lost.
- **Project Revisions** — Snapshot system to save and restore previous versions of your design.
- **Export & Publish** — Download a production-ready static HTML/CSS bundle or publish to a unique `nexora.app` subdomain.

### 🔐 Infrastructure & Auth
- **Secure Authentication** — Enterprise-grade auth via **Auth.js (NextAuth v5)** including Google OAuth.
- **RBAC (Role Based Access Control)** — Dedicated Admin Panel for managing users, templates, and analytics.

---

## 💻 Tech Stack

- **Framework:** [Next.js 15+ (App Router)](https://nextjs.org/)
- **Language:** JavaScript (ES6+)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Hosted on Neon)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Auth.js](https://authjs.dev/)
- **Emails:** [Nodemailer](https://nodemailer.com/) (Gmail SMTP)
- **File Storage:** [Cloudinary](https://cloudinary.com/)
- **Payments:** [Stripe API](https://stripe.com/)

---

## 📂 Documentation

For deep dives into the technical details, please refer to our internal documentation:

- 📑 **[API Documentation](docs/API.md)** — Detailed endpoint list and usage.
- 📡 **[Postman API Collection](docs/API_COLLECTION.md)** — Ready-to-import API test suite.
- 🖼️ **[Cloudinary Setup](docs/CLOUDINARY.md)** — Asset management and optimization guide.
- ⚙️ **[Environment Variables](docs/ENVIRONMENT.md)** — Full list of required secret keys.
- 🎓 **[Full-Stack Interview Prep](docs/TECHNICAL_INTERVIEW_PREP.md)** — A 250-question guide based on this project's architecture.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/nexora-studio.git
cd nexora-studio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the keys listed in **[docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)**.

### 4. Database Setup
```bash
npx prisma db push
npm run db:seed
```

### 5. Start Development Server
```bash
npm run dev
```

---

## 🗺️ Project Structure

- `app/` — All Next.js routes including the core builder, dashboard, and public pages.
- `features/` — The heart of the application: builder logic, section renderers, and component schemas.
- `actions/` — Server actions for handling database mutations securely.
- `redux/` — Global state management for canvas synchronization and undo/redo logic.
- `components/` — Shared UI components (Shadcn-inspired) and inspector fields.
- `lib/` — Shared libraries for Email, Database, and Token generation.

---

<div align="center">
  <p>Built with ❤️ by <b>Muhammad Milon</b></p>
  <p><i>Nexora Studio — Redefining Visual Development.</i></p>
</div>
