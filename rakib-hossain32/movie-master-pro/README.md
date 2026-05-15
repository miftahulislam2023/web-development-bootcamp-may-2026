# 🎬 Movie Master Pro

![Movie Master Pro Banner](https://movie-master-pro-cf049.web.app/)

**Movie Master Pro** is a full-stack movie portal where users can discover, save, and manage their favorite films. It's built on **React 19** with **Vite**, styled using **Tailwind CSS v4** and **DaisyUI**, and backed by **Firebase** for auth and real-time data. The goal was to keep things fast and user-friendly — lazy loading, smooth animations, and a clean dashboard all come together to make browsing feel effortless.

## 🔗 Live Demo

[**🚀 View Live Site**](https://movie-master-pro-cf049.web.app/)

---

## 📸 Screenshots

> Some quick looks at what the app feels like in practice.

| Home Page | Movie Details | Dashboard |
| :---: | :---: | :---: |
| ![Home](https://placehold.co/280x160?text=Home) | ![Details](https://placehold.co/280x160?text=Movie+Details) | ![Dashboard](https://placehold.co/280x160?text=Dashboard) |

---

## ✨ Key Features

- **🔐 User Authentication**: Secure Login and Registration system using **Firebase Authentication**.
- **🎥 Extensive Movie Library**: Browse "All Movies", "Top Rated", and filtered generic collections.
- **❤️ Favorites & Watchlist**: Users can add movies to their personal **Watchlist** and **My Collection**.
- **⭐ Dynamic Content**: Features like "Featured Collections", "Recently Added", and "Testimonials".
- **🖼️ Optimized Image Loading**: Images load progressively with a smooth blur-up effect using **React Lazy Load Image Component**, which noticeably improves perceived performance.
- **📊 Interactive Dashboard**: User feedback and statistics visualization using **Recharts**.
- **🎨 Modern UI/UX**: Fully responsive and dark-mode ready design using **Tailwind CSS 4** and **DaisyUI 5**.
- **⚡ High Performance**: Fast data fetching and caching with **TanStack Query**.
- **🔔 Real-time Notifications**: Toast notifications for user actions (Add to favorites, Login success, etc.).
- **💎 Premium Features**: Membership page logic and premium content sections.

---

## 🛠️ Technology Stack

### **Frontend**
- **React 19**: The latest version of the core UI library.
- **Vite**: Ultra-fast build tool and development server.
- **React Router v7**: For seamless client-side navigation.
- **TanStack Query (React Query)**: For efficient server state management.
- **Axios**: For making HTTP requests to the backend.

### **Styling & UI**
- **Tailwind CSS v4**: Utility-first CSS framework for rapid UI development.
- **DaisyUI v5**: Component library for Tailwind CSS.
- **Framer Motion**: For complex and fluid animations.
- **Lucide React & React Icons**: For modern and scalable icons.

### **Backend & Services**
- **Firebase Authentication**: Handles user sign-up, login, and session management.
- **Firebase Hosting**: The app is deployed and served via Firebase.
- **Custom REST API**: Built with Node.js and Express, handles movie data, favorites, and user collections.

### **Tools & Utilities**
- **ESLint**: For maintaining code quality across the project.
- **SweetAlert2**: For confirmation dialogs and styled popup alerts.
- **React Toastify**: For lightweight, non-intrusive toast notifications.
- **React Lazy Load Image Component**: Defers off-screen image loading to speed up initial page renders.
- **React Loading Indicators**: Displays smooth spinners and skeletons during async operations.
- **Recharts**: Used in the dashboard to render interactive charts from user/movie data.

---

## 🚀 Run Locally

Follow these steps to set up the project locally on your machine.

### Prerequisites
Make sure you have **Node.js** installed on your system.

### 1. Clone the Repository
```bash
git clone 
cd Movie-Master-Pro
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory and add your Firebase and API keys:

```env
VITE_API_URL=your_api_url_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server
```bash
npm run dev
```
The app will typically run at `http://localhost:5173`.

---

## 📂 Project Structure

```bash
Movie-Master-Pro/
├── src/
│   ├── assets/          # Static assets (images, icons)
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context API (Auth, Theme)
│   ├── firebase/        # Firebase configuration
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Main layout wrappers
│   ├── pages/           # Application pages (Home, Dashboard, etc.)
│   ├── routes/          # Route definitions
│   └── main.jsx         # Entry point
├── public/              # Public static files
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md            # Project documentation
```

---

## 📦 Dependencies

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `react` | ^19.1.1 | Core UI library |
| `react-dom` | ^19.1.1 | DOM rendering |
| `react-router` | ^7.9.5 | Client-side routing |
| `vite` | ^7.1.7 | Build tool & dev server |
| `tailwindcss` | ^4.1.17 | Utility-first CSS framework |
| `@tailwindcss/vite` | ^4.1.17 | Tailwind's official Vite plugin |
| `daisyui` | ^5.4.7 | Pre-built Tailwind components |
| `firebase` | ^12.5.0 | Auth & hosting |
| `@tanstack/react-query` | ^5.90.16 | Server state & data caching |
| `axios` | ^1.13.2 | HTTP client for API calls |
| `framer-motion` | ^12.23.24 | Animations & transitions |
| `recharts` | ^3.6.0 | Chart library for the dashboard |
| `react-lazy-load-image-component` | ^1.6.3 | Lazy loading images for better performance |
| `react-loading-indicators` | ^1.0.1 | Loading spinners & skeletons |
| `react-toastify` | ^11.0.5 | Toast notifications |
| `sweetalert2` | ^11.26.3 | Beautiful confirmation dialogs |
| `lucide-react` | ^0.553.0 | Icon library |
| `react-icons` | ^5.5.0 | Extended icon collection |

---

## 🤝 Contribution

Contributions are welcome! If you'd like to improve this project:

1.  **Fork** the repository.
2.  Create a new branch (`git checkout -b feature-name`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature-name`).
5.  Open a **Pull Request**.

---

## 📞 Contact

For any inquiries or feedback, please contact:

- **Email**: rakibulhasanmd678@gmail.com
- **LinkedIn**: [Rakib Hossain](https://www.linkedin.com/in/rakib-hossain-md/)
- **GitHub**: [Rakib Hossain](https://github.com/rakib-hossain32)