# 💰 Cashnivo - MERN Stack Personal Finance Tracker

<div align="center">

**A modern, full-stack MERN application for comprehensive personal finance management**

![MERN Stack](https://img.shields.io/badge/MERN-Stack-00D9FF?style=for-the-badge&logo=mongodb&logoColor=white)

[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2.1-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.2.5-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.13.0-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.3.0-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<div align="center">
<a href="https://expensetracker-2ab95.web.app/" target="_blank">

![Live Demo](https://img.shields.io/badge/CASHNIVO-LIVE%20DEMO-6366F1?style=for-the-badge&logo=firefox-browser&logoColor=white&labelColor=111827)

</a>
</div>

</a>
</div>

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Security Features](#security-features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🎯 Overview

**Cashnivo** is a full-stack **MERN (MongoDB, Express.js, React, Node.js)** personal finance management application that empowers users to take control of their financial health. Built with modern JavaScript technologies throughout the entire stack, it delivers a seamless, unified development experience with a robust RESTful API backend and an intuitive React frontend.

### Why MERN Stack?

- **JavaScript Everywhere**: Single language (JavaScript) across frontend, backend, and database queries
- **High Performance**: Non-blocking I/O with Node.js and efficient React rendering
- **Scalable Architecture**: MongoDB's flexible schema and Express.js middleware system
- **Rich Ecosystem**: Access to npm's vast package ecosystem
- **Modern Development**: Latest ES6+ features, async/await, and modern tooling

### Why Cashnivo?

- **Complete MERN Solution**: Full-stack application showcasing MERN best practices
- **Real-time Insights**: Instant visualization of spending patterns, income trends, and savings rate
- **Secure & Scalable**: Firebase authentication with MongoDB Atlas for reliable data persistence
- **Fully Customizable**: Create unlimited custom categories tailored to your lifestyle
- **Cloud-Native**: Deployed on Vercel (backend) and Firebase Hosting (frontend) for global accessibility
- **Mobile-First Design**: Responsive interface that works flawlessly across all devices

### What Makes It Different?

Unlike simple expense trackers, Cashnivo provides:
- **Full MERN Stack Implementation**: Demonstrates professional MERN development patterns
- Comprehensive transaction management with full CRUD operations
- Intelligent category system with both default and custom options
- Real-time financial analytics and dashboard insights
- Secure multi-user support with isolated data per user
- Professional-grade RESTful API with proper error handling and validation

---

## 🏗️ Architecture

Cashnivo follows the **MERN stack architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND - REACT (R)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │   React 19 + Vite (Build Tool)                         │ │
│  │   - Component-Based UI                                 │ │
│  │   - React Router for Navigation                        │ │
│  │   - Firebase Authentication                            │ │
│  │   - Axios for HTTP Requests                            │ │
│  │   - TailwindCSS + DaisyUI Styling                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕ REST API (HTTPS)
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND - EXPRESS + NODE (EN)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │   Express.js 5 on Node.js                              │ │
│  │   - RESTful API Endpoints                              │ │
│  │   - Business Logic & Validation                        │ │
│  │   - CORS & Security Middleware                         │ │
│  │   - MongoDB Driver Integration                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕ MongoDB Driver
┌─────────────────────────────────────────────────────────────┐
│                   DATABASE - MONGODB (M)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │   MongoDB Atlas (Cloud NoSQL Database)                 │ │
│  │   - Users Collection                                   │ │
│  │   - Transactions Collection                            │ │
│  │   - Categories Collection                              │ │
│  │   - Flexible JSON-like Documents                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### MERN Stack Components

| Layer | Technology | Purpose |
|-------|------------|---------|
| **M** | MongoDB Atlas | NoSQL database for flexible data storage |
| **E** | Express.js 5.2.1 | Web application framework for Node.js |
| **R** | React 19.2.5 | Frontend UI library with component architecture |
| **N** | Node.js | JavaScript runtime for server-side execution |

### Data Flow

1. **User Authentication**: Firebase handles user registration, login, and session management
2. **API Requests**: React frontend sends HTTP requests via Axios to Express.js backend
3. **Data Processing**: Express.js validates, processes, and executes MongoDB operations
4. **Response Delivery**: JSON data returns to React frontend for rendering
5. **Real-time Updates**: UI updates immediately reflect database changes

---

## ✨ Key Features

### 🎨 Frontend Features

#### Dashboard & Analytics
- **Financial Overview Cards**: Current balance, total income, expenses, and savings rate
- **Visual Charts**: Income vs. expense comparison with interactive progress bars
- **Recent Activity**: Quick view of latest transactions
- **Quick Actions**: Fast navigation to common tasks

#### Transaction Management
- **Add Transactions**: Record income and expenses with detailed information
- **Edit & Delete**: Full CRUD operations on all transactions
- **Smart Filtering**: Filter by type (income/expense) or view all
- **Search & Sort**: Find specific transactions quickly
- **Detailed History**: Comprehensive transaction list with pagination

#### Category System
- **Custom Categories**: Create unlimited categories for income and expenses
- **Default Categories**: Pre-configured categories to get started immediately
- **Type-Specific**: Separate management for income and expense categories
- **Edit & Remove**: Full control over custom categories

#### User Experience
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Toast Notifications**: Real-time feedback for all user actions
- **Loading States**: Smooth loading indicators for async operations
- **Error Handling**: Graceful error messages and fallbacks
- **Dark Mode Ready**: Built with DaisyUI themes for easy customization

### 🔧 Backend Features

#### API Capabilities
- **RESTful Design**: Standard HTTP methods with predictable endpoints
- **User Management**: Complete registration, authentication, and profile updates
- **Transaction CRUD**: Full create, read, update, delete operations
- **Category Management**: System and custom category handling
- **Statistics Endpoint**: Aggregate data for dashboard insights
- **Query Filtering**: Filter by user email, transaction type, and more

#### Technical Features
- **CORS Enabled**: Configured for cross-origin requests from frontend
- **Environment Variables**: Secure credential management
- **MongoDB Integration**: Efficient database operations with connection pooling
- **Error Handling**: Comprehensive error responses with proper HTTP status codes
- **Input Validation**: Server-side validation for data integrity
- **Cloud Deployment**: Optimized for Vercel serverless functions

---

## 🛠️ Technology Stack

### MERN Stack Core

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **M** - Database | MongoDB Atlas | Cloud | NoSQL database with flexible JSON-like documents |
| **E** - Backend | Express.js | 5.2.1 | Fast, minimalist web framework for Node.js |
| **R** - Frontend | React | 19.2.5 | Component-based UI library with virtual DOM |
| **N** - Runtime | Node.js | Latest | JavaScript runtime built on Chrome's V8 engine |

### Frontend Technologies (React Ecosystem)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vite** | 8.0.10 | Lightning-fast build tool and dev server |
| **React Router** | 7.15.0 | Client-side routing and navigation |
| **TailwindCSS** | 4.3.0 | Utility-first CSS framework |
| **DaisyUI** | 5.5.19 | Component library for Tailwind |
| **Axios** | 1.16.0 | Promise-based HTTP client |
| **Recharts** | 3.8.1 | Composable charting library for React |
| **Lucide React** | 1.14.0 | Beautiful, consistent icon library |
| **React Toastify** | 11.1.0 | Toast notifications for React |
| **SweetAlert2** | 11.26.24 | Beautiful, responsive alert modals |
| **React Icons** | 5.6.0 | Popular icon library collection |
| **FontAwesome** | 7.2.0 | Comprehensive icon set |

### Backend Technologies (Node.js Ecosystem)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Express.js** | 5.2.1 | Web application framework |
| **MongoDB Driver** | Latest | Official MongoDB driver for Node.js |
| **dotenv** | Latest | Environment variable management |
| **cors** | Latest | Cross-origin resource sharing middleware |

### Additional Services

| Service | Purpose |
|---------|---------|
| **Firebase Authentication** | User authentication and authorization |
| **MongoDB Atlas** | Cloud-hosted MongoDB database |
| **Vercel** | Backend API deployment (serverless) |
| **Firebase Hosting** | Frontend static site hosting |

### Development Tools

- **ESLint** - Code linting and quality assurance
- **Git** - Version control system
- **npm** - Node package manager
- **Vite Plugin React** - React Fast Refresh support
- **VS Code** - Recommended IDE

---

## 📁 Project Structure

```
cashnivo-fullstack/
│
├── Expense Backend/              # Backend API Server
│   ├── node_modules/            # Backend dependencies
│   ├── .env                     # Environment variables (not in repo)
│   ├── .gitignore              # Git ignore rules
│   ├── index.js                # Main server file
│   ├── package.json            # Backend dependencies
│   ├── package-lock.json       # Dependency lock file
│   ├── vercel.json             # Vercel deployment config
│   └── README.md               # Backend documentation
│
└── ExpenseTracker/              # Frontend React Application
    ├── dist/                    # Production build output
    ├── node_modules/            # Frontend dependencies
    ├── public/                  # Static assets
    │   ├── icons.svg
    │   └── logo.png
    ├── src/
    │   ├── assets/              # Image assets
    │   ├── Components/          # Reusable components
    │   │   ├── Aside/          # Sidebar navigation
    │   │   ├── DashboardLayout/ # Dashboard wrapper
    │   │   ├── Footer/         # Footer component
    │   │   └── Navbar/         # Navigation bar
    │   ├── Dashboard/           # Dashboard pages
    │   │   ├── DashboardHome/  # Main dashboard
    │   │   ├── AddTransaction.jsx
    │   │   └── Transactions/   # Transaction list
    │   ├── Pages/               # Public pages
    │   │   ├── Home/           # Landing page components
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Categories.jsx
    │   │   ├── Profile.jsx
    │   │   └── ...
    │   ├── Provider/            # Context providers
    │   │   └── AuthProvider.jsx
    │   ├── firebase/            # Firebase configuration
    │   ├── routes/              # Route definitions
    │   ├── App.jsx              # Main app component
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── .env.local               # Frontend environment variables
    ├── .firebaserc              # Firebase project config
    ├── firebase.json            # Firebase hosting config
    ├── index.html               # HTML entry point
    ├── package.json             # Frontend dependencies
    ├── vite.config.js           # Vite configuration
    └── README.md                # Frontend documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** for version control
- **MongoDB Atlas Account** (free tier available)
- **Firebase Account** (free tier available)

### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd "Expense Backend"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `Expense Backend` directory:
   ```env
   PORT=5000
   DB_USER=your_mongodb_username
   DB_PASS=your_mongodb_password
   ```

4. **Set up MongoDB Atlas**
   - Create a MongoDB Atlas account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster (free tier available)
   - Create a database user with read/write permissions
   - Whitelist your IP address or allow access from anywhere (0.0.0.0/0)
   - Get your connection credentials (username and password)

5. **Start the backend server**
   ```bash
   npm start
   ```
   
   The API will be available at `http://localhost:5000`

6. **Verify the backend is running**
   ```bash
   curl http://localhost:5000
   ```
   You should see a welcome message.

### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd ExpenseTracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or use an existing one
   - Enable Authentication (Email/Password and Google Sign-In)
   - Get your Firebase configuration from Project Settings

4. **Configure environment variables**
   
   Create a `.env.local` file in the `ExpenseTracker` directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

5. **Update API endpoint (if running locally)**
   
   If you're running the backend locally, update the API base URL in your frontend code to point to `http://localhost:5000` instead of the production URL.

6. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

7. **Build for production**
   ```bash
   npm run build
   ```

### Quick Start (Both Services)

To run both backend and frontend simultaneously:

```bash
# Terminal 1 - Backend
cd "Expense Backend"
npm install
npm start

# Terminal 2 - Frontend
cd ExpenseTracker
npm install
npm run dev
```

---

## 📡 API Documentation

### Base URL

- **Production**: `https://cashnivo.vercel.app`
- **Local Development**: `http://localhost:5000`

### Authentication

The API uses email-based user identification. Include the user's email in query parameters or request body as needed.

### Endpoints

#### Health Check

```http
GET /
```

Returns API status and welcome message.

---

#### Users

**Create User**
```http
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "displayName": "John Doe",
  "photoURL": "https://example.com/photo.jpg"
}
```

**Get All Users**
```http
GET /users
```

**Get User by Email**
```http
GET /users/role/:email
```

**Update User Profile**
```http
PUT /users/:email
Content-Type: application/json

{
  "displayName": "Jane Doe",
  "photoURL": "https://example.com/new-photo.jpg"
}
```

---

#### Categories

**Create Category**
```http
POST /categories
Content-Type: application/json

{
  "name": "Groceries",
  "type": "expense",
  "email": "user@example.com",
  "isDefault": false
}
```

**Get Categories**
```http
GET /categories?email=user@example.com&type=expense
```

Query Parameters:
- `email` (required): User's email address
- `type` (optional): Filter by `income` or `expense`

**Delete Category**
```http
DELETE /categories/:id
```

Note: System default categories cannot be deleted.

---

#### Transactions

**Create Transaction**
```http
POST /transactions
Content-Type: application/json

{
  "email": "user@example.com",
  "amount": 50.00,
  "category": "Food",
  "type": "expense",
  "date": "2026-05-16",
  "description": "Lunch at restaurant"
}
```

**Get Transactions**
```http
GET /transactions?email=user@example.com&type=expense
```

Query Parameters:
- `email` (required): User's email address
- `type` (optional): Filter by `income` or `expense`

**Get Single Transaction**
```http
GET /transactions/:id
```

**Update Transaction**
```http
PUT /transactions/:id
Content-Type: application/json

{
  "amount": 55.00,
  "category": "Food",
  "description": "Updated description"
}
```

**Delete Transaction**
```http
DELETE /transactions/:id
```

---

#### Statistics

**Get Aggregate Statistics**
```http
GET /stats
```

Returns:
```json
{
  "userCount": 150,
  "transactionCount": 3420,
  "categoryCount": 45
}
```

---

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,           // Unique user email
  displayName: String,     // User's display name
  photoURL: String,        // Profile photo URL
  createdAt: Date         // Auto-generated timestamp
}
```

#### Categories Collection
```javascript
{
  _id: ObjectId,
  name: String,           // Category name
  type: String,           // 'expense' or 'income'
  isDefault: Boolean,     // System category flag
  email: String,          // User email (null for defaults)
  createdAt: Date        // Auto-generated timestamp
}
```

**Default Expense Categories**: Food, Groceries, Transport, Bills, Shopping, Health, Entertainment, Education, Housing, Other

**Default Income Categories**: Salary, Freelance, Business, Investments, Rental Income, Bonus, Commission, Interest, Gift, Other

#### Transactions Collection
```javascript
{
  _id: ObjectId,
  email: String,          // User email
  amount: Number,         // Transaction amount
  category: String,       // Category name
  type: String,           // 'expense' or 'income'
  date: Date,            // Transaction date
  description: String,    // Optional description
  createdAt: Date        // Auto-generated timestamp
}
```

---

## 🌐 Deployment

### Backend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend directory**
   ```bash
   cd "Expense Backend"
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   ```

4. **Set environment variables in Vercel Dashboard**
   - Go to your project settings on Vercel
   - Add `DB_USER` and `DB_PASS` environment variables
   - Redeploy if necessary

5. **Verify deployment**
   - Visit your Vercel URL
   - Test the API endpoints

### Frontend Deployment (Firebase Hosting)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Navigate to frontend directory**
   ```bash
   cd ExpenseTracker
   ```

3. **Login to Firebase**
   ```bash
   firebase login
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

6. **Access your deployed application**
   - Your app will be available at the Firebase hosting URL
   - Example: `https://your-project.web.app`

### Alternative Deployment Options

#### Backend Alternatives
- **Railway**: Connect GitHub repo for automatic deployments
- **Render**: Free tier with automatic HTTPS
- **Heroku**: Classic PaaS with easy setup
- **AWS Lambda**: Serverless with API Gateway

#### Frontend Alternatives
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop or Git-based deployment
- **GitHub Pages**: Free hosting for static sites
- **Cloudflare Pages**: Fast global CDN deployment

---

## 🔒 Security Features

### Backend Security

- **Environment Variables**: Sensitive credentials stored securely outside codebase
- **MongoDB Connection**: Secure connection with Server API v1
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Server-side validation for all endpoints
- **System Category Protection**: Default categories cannot be deleted
- **Error Handling**: Secure error messages without exposing system details

### Frontend Security

- **Firebase Authentication**: Industry-standard authentication service
- **Protected Routes**: Dashboard accessible only to authenticated users
- **Secure Token Storage**: Firebase handles token management
- **HTTPS Only**: All production traffic encrypted
- **Environment Variables**: API keys and secrets in environment files
- **XSS Protection**: React's built-in XSS prevention

### Best Practices

- Never commit `.env` or `.env.local` files to version control
- Use strong passwords for MongoDB and Firebase
- Enable two-factor authentication on cloud accounts
- Regularly update dependencies for security patches
- Monitor API usage for unusual patterns
- Implement rate limiting for production APIs

---

## 🤝 Contributing

Contributions are welcome and greatly appreciated! Here's how you can contribute:

### How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button at the top right of the repository page

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/cashnivo.git
   cd cashnivo
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style and conventions
   - Add comments for complex logic

5. **Test Your Changes**
   - Test both backend and frontend thoroughly
   - Ensure no existing functionality is broken

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m 'Add some AmazingFeature'
   ```

7. **Push to Your Fork**
   ```bash
   git push origin feature/AmazingFeature
   ```

8. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your feature branch
   - Provide a clear description of your changes

### Contribution Guidelines

- **Code Style**: Follow existing code conventions and formatting
- **Commit Messages**: Write clear, descriptive commit messages
- **Documentation**: Update README and comments for new features
- **Testing**: Ensure all features work as expected
- **Pull Requests**: Keep PRs focused on a single feature or fix
- **Issues**: Check existing issues before creating new ones

### Areas for Contribution

- 🐛 Bug fixes and error handling improvements
- ✨ New features and enhancements
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🧪 Test coverage improvements
- 🌐 Internationalization (i18n)
- ♿ Accessibility improvements
- 🔧 MERN stack best practices implementation

---

## 📄 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

### ISC License Summary

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

---

## 📧 Contact

**Project Maintainer**: Siratim Mustakim Chowdhury

- 📧 **Email**: [chowdhurysiratimmustakim@gmail.com](mailto:chowdhurysiratimmustakim@gmail.com)
- 🐙 **GitHub**: [@SiratimMChy](https://github.com/SiratimMChy)
- 💼 **LinkedIn**: [Siratim Mustakim Chowdhury](https://www.linkedin.com/in/siratim-mustakim-chowdhury/)

### Support

For questions, issues, or feature requests:

1. **Check Existing Issues**: Browse the [Issues](https://github.com/SiratimMChy/cashnivo/issues) page
2. **Create New Issue**: Open a new issue with detailed information
3. **Email Support**: Contact via email for urgent matters
4. **Discussions**: Join discussions for general questions

---

## 🙏 Acknowledgments

### Technologies & Libraries

- [MongoDB](https://www.mongodb.com/) - NoSQL database
- [Express.js](https://expressjs.com/) - Web application framework
- [React](https://react.dev/) - UI library for building interfaces
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Firebase](https://firebase.google.com/) - Authentication and hosting
- [Vite](https://vitejs.dev/) - Build tool and dev server
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [DaisyUI](https://daisyui.com/) - Component library
- [Recharts](https://recharts.org/) - Charting library
- [Lucide Icons](https://lucide.dev/) - Icon library
- [Axios](https://axios-http.com/) - HTTP client

### Inspiration & Resources

- [MDN Web Docs](https://developer.mozilla.org/) - Web development documentation
- [Stack Overflow](https://stackoverflow.com/) - Developer community
- [GitHub](https://github.com/) - Code hosting and collaboration
- [Vercel](https://vercel.com/) - Deployment platform
- [MongoDB University](https://university.mongodb.com/) - Database learning resources

### Special Thanks

- To all contributors who help improve this project
- The open-source community for amazing tools and libraries
- Users who provide valuable feedback and suggestions

---

## 📊 Project Statistics

- **Stack**: MERN (MongoDB, Express.js, React, Node.js)
- **Total Lines of Code**: 10,000+
- **React Components**: 25+
- **API Endpoints**: 15+
- **MongoDB Collections**: 3
- **Supported Devices**: Desktop, Tablet, Mobile
- **Deployment Platforms**: 2 (Vercel + Firebase)
- **Authentication Methods**: 2 (Email/Password + Google OAuth)

---

### Version History

- **v1.0.0** (Current) - Initial MERN stack release
  - Complete MERN stack implementation
  - User authentication with Firebase
  - Transaction CRUD operations
  - Category management system
  - Dashboard with analytics
  - Responsive design with TailwindCSS
  - RESTful API with Express.js
  - MongoDB Atlas integration

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

**Built with ❤️ using the MERN Stack by Siratim Mustakim Chowdhury**

**MongoDB • Express.js • React • Node.js**

[View Demo](https://expensetracker-2ab95.web.app/)

</div>
