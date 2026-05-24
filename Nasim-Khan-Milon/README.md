# ChatApp - Real Time Chat Application

A modern real-time chat application built with Microservices Architecture using Next.js, Node.js, Socket.IO, RabbitMQ, Redis, Prisma, and MongoDB.

---

## Live Demo

### Live Demo
https://youtu.be/whe5O-LfLl8

### Frontend
https://web-development-bootcamp-may-2026-chatapp.onrender.com

### Backend Services

#### User Service
https://web-development-bootcamp-may-2026-9q65.onrender.com

#### Chat Service
https://web-development-bootcamp-may-2026-chat2.onrender.com

#### Mail Service
https://web-development-bootcamp-may-2026-mail4.onrender.com

---

# Features

- OTP Email Authentication
- Real-time Messaging
- Real-time Typing Indicator
- Online/Offline User Status
- Seen Message System
- Unseen Message Counter
- Image Messaging
- Cloudinary Image Upload
- Latest Chat Sorting
- Socket.IO Real-time Communication
- RabbitMQ Event Queue
- Redis OTP Storage & Rate Limiting
- Microservices Architecture
- MongoDB Database
- Prisma ORM
- Responsive Modern UI

---

# Tech Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Axios
- Socket.IO Client
- React Hot Toast

## Backend
- Node.js
- Express.js
- TypeScript
- Socket.IO
- Prisma ORM
- MongoDB
- RabbitMQ
- Redis
- Nodemailer
- Cloudinary

---

# Project Structure

```bash
Nasim-Khan-Milon/
│
├── frontend/
│
├── backend/
│   │
│   ├── user/
│   ├── chat/
│   └── mail/
```

---

# Architecture

```bash
Frontend (Next.js)
        │
        ▼
User Service ───── Redis
        │
        ▼
RabbitMQ
        │
        ▼
Mail Service ───── Gmail SMTP

Frontend ───── Socket.IO ───── Chat Service
                            │
                            ▼
                        MongoDB
```

---

# Services Overview

## User Service
Handles:
- OTP Authentication
- JWT Token Generation
- User Management
- Redis Integration
- RabbitMQ Producer

---

## Chat Service
Handles:
- Real-time Messaging
- Socket.IO Events
- Typing Indicators
- Seen Messages
- Chat Management
- Image Upload

---

## Mail Service
Handles:
- RabbitMQ Consumer
- OTP Email Sending
- Gmail SMTP Integration

---

# Environment Variables

## Frontend

```env
NEXT_PUBLIC_USER_SERVICE=your_user_service_url

NEXT_PUBLIC_CHAT_SERVICE=your_chat_service_url

NEXT_PUBLIC_MAIL_SERVICE=your_mail_service_url
```

---

## User Service

```env
MONGO_URI=your_mongodb_uri

PORT=4000

REDIS_URL=your_redis_url

RABBITMQ_URL=your_rabbitmq_url

JWT_SECRET=your_secret
```

---

## Chat Service

```env
PORT=4002

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret

USER_SERVICE=your_user_service_url

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

RABBITMQ_URL=your_rabbitmq_url
```

---

## Mail Service

```env
RABBITMQ_URL=your_rabbitmq_url

EMAIL_USER=your_email

EMAIL_PASS=your_app_password
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Nasim-Khan-Milon/web-development-bootcamp-may-2026.git
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# User Service Setup

```bash
cd backend/user

npm install

npm run dev
```

---

# Chat Service Setup

```bash
cd backend/chat

npm install

npm run dev
```

---

# Mail Service Setup

```bash
cd backend/mail

npm install

npm run dev
```

---

# Deployment

## Frontend
- Render

## Backend Services
- Render

## Database
- MongoDB Atlas

## Redis
- Upstash Redis

## RabbitMQ
- CloudAMQP

## Image Storage
- Cloudinary

---

# Real-time Socket Features

- User Online Status
- Live Messaging
- Typing Indicator
- Stop Typing Event
- Seen Messages
- Real-time Chat Updates

---

# Security Features

- JWT Authentication
- OTP Verification
- Redis Rate Limiting
- Protected Routes
- Environment Variables

---

# Future Improvements

- Group Chat
- Voice Calling
- Video Calling
- Message Reactions
- File Sharing
- Push Notifications
- Docker Support
- Kubernetes Deployment

---

# Author

## MD. Nasim Khan Milon

GitHub:
https://github.com/Nasim-Khan-Milon

