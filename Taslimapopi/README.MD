# 💬 ChitChat – Real-Time Chat Application

A modern full-stack real-time chat application built with **React, Node.js, Express, MongoDB, and Socket.io**. It supports instant messaging, authentication, online presence tracking, and cloud-based media handling.

---

## ⚡ Features

### 🔐 Authentication
- JWT-based secure authentication
- Protected routes (frontend + backend)

### ⚡ Real-Time Chat
- Instant messaging using Socket.io
- Low-latency communication

### 🟢 Online Presence
- Live online/offline user status
- Real-time user activity tracking


### 🗂️ Media Support
- Image uploads via Cloudinary

### 🚦 Security
- API rate limiting using Arcjet

---

## 🧠 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- DaisyUI
- Zustand
- Socket.io-client

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.io
- JWT Authentication

### Services
- Cloudinary (Image Storage)
- Arcjet (Security & Rate Limiting)

---

## 🏗️ Project Structure

### Backend
```bash
backend/
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── sockets/
│   └── config/
│
├── server.js
├── package.json
└── .env

### Frontend

frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── store/ (Zustand)
│   ├── lib/
│   └── App.jsx
│
├── index.html
├── package.json


### .env

PORT=3000
MONGO_URI=your_mongo_uri_here


JWT_SECRET=your_jwt_secret


CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

Frontend (.env)
VITE_API_URL=http://localhost:3000
🚀 Installation & Setup

cd chitchat
2️⃣ Backend Setup
cd backend
npm install
npm run dev

Backend runs at:

http://localhost:3000
3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173
⚡ Socket.io Events
Client → Server
sendMessage
typing
stopTyping
Server → Client
newMessage
userOnline
userOffline
typing
stopTyping
🌍 Deployment
Frontend
Vercel / Netlify
Backend
Render / Railway / Sevalla
Production Env Example
CLIENT_URL=https://your-frontend-domain.com
VITE_API_URL=https://your-backend-domain.com
📈 Future Improvements
Group chat system
Message read receipts
Push notifications
End-to-end encryption
Redis scaling for Socket.io
AI chat assistant
👨‍💻 Developer

Built by Taslima popy

⭐ About This Project

This project demonstrates:

Real-time WebSocket architecture
Full-stack MERN development
Secure authentication flow
Cloud integrations
Production-ready deployment setup