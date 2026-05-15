# WalletWatch - Personal Expense Tracker

WalletWatch is a comprehensive full stack web application designed to help users manage their personal finances effectively. It provides a platform to track incomes, monitor expenses and gain insights into spending habits through a user-friendly dashboard and AI powered analysis.

## Core Features

- **User Authentication**: Secure login and registration system using Firebase Authentication.
- **Dynamic Dashboard**: Realtime overview of total balance, total income and total expenses.
- **Income Management**: Add, view and track various sources of income.
- **Expense Tracking**: Categorize and monitor daily expenses to stay within budget.
- **Interactive Visualizations**: Graphical representation of financial data using Recharts.
- **Budgeting**: Set and manage monthly or category-based budgets.
- **AI Insights**: Integrated AI functionality to provide personalized financial advice and summaries.
- **Responsive Design**: Fully optimized for various devices using Tailwind CSS and Material UI.

## Technology Stack

### Frontend
- **Library**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, DaisyUI, Material UI (MUI)
- **State Management**: React Hooks, Context API
- **Routing**: React Router 7
- **Forms**: React Hook Form with Zod validation
- **Animations**: GSAP, Framer Motion
- **Charts**: Recharts
- **Toast**: Sonner
- **Authentication**: Firebase

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **JWT**: Firebase Admin SDK

## Project Structure

### Root Directory
- **backend/**: Contains server-side logic and database models.
- **frontend/**: Contains the React application and UI components.
- **README.md**: Project documentation.

### Backend Structure
- **src/config/**: Database and environment configurations.
- **src/controllers/**: Business logic for various modules.
- **src/models/**: Mongoose schemas for User, Income, Expense, Budget, etc.
- **src/routes/**: API endpoint definitions.
- **src/services/**: External service integrations (e.g., AI, Firebase).
- **src/middlewares/**: Custom Express middlewares.

### Frontend Structure
- **src/components/**: Reusable UI components.
- **src/layouts/**: Page layouts (Root, Dashboard).
- **src/pages/**: Main application views (Home, Login, Dashboard, etc.).
- **src/providers/**: Context providers (Auth).
- **src/routes/**: Routing configuration.
- **src/utils/**: Helper functions and constants.

## Installation and Setup

### Prerequisites
- Node.js (Latest LTS recommended)
- MongoDB account (Atlas or Local)
- Firebase Project (for Authentication)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd a_k_m_samioul_islam
```

### Step 2: Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file and add the following:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   OPENROUTER_API_KEY=your_openrouter_apikey
   OPENROUTER_MODEL=openrouter_model
   FB_ADMIN_KEY=firebase_admin_sdk_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Step 3: Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env.local file and add the necessary Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_SERVER=server_link
   VITE_IMGBB_API_KEY=your_imgbb_apikey
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

- Register a new account or log in with existing credentials.
- Navigate to the Dashboard to see your financial overview.
- Use the Incomes and Expenses pages to record your transactions.
- Check the Profile page to manage your user details.
- Access AI insights for advanced financial summaries.


## Developed by

**A. K. M Samioul Islam**  
Email: [akmsamioulislam51@gmail.com](mailto:akmsamioulislam51@gmail.com)  
GitHub: [Samioul51](https://github.com/Samioul51)