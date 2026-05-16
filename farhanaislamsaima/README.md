<div align="center">

<img src="./client/public/echoline-logo.svg" width="100" alt="EchoLine logo" />

# EchoLine

### Real-Time Chat Application - Modular Monolith Architecture

<br/>

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=111)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Azure](https://img.shields.io/badge/Azure_Container_Apps-Backend-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white)

</div>

---

## 📖 Project Overview

**EchoLine** is a full-stack real-time chat application built with **React**, **Express**, **Socket.IO**, **PostgreSQL**, and **Prisma ORM**. The backend is organized as a **modular monolith**, giving the project a microservice-like domain structure without the extra deployment complexity of multiple services.

The app includes **JWT authentication**, Google login, real-time private and group messaging, image uploads through **Cloudinary**, caching with **Redis**, and push notifications using **Firebase Cloud Messaging**. The backend can be deployed to **Azure Container Apps**, while the frontend can run locally or be deployed to **Vercel**.

---

## ✨ Key Features

<table width="100%" align="center">
  <tr>
    <th width="30%" align="left">Feature</th>
    <th align="left">Description</th>
  </tr>
  <tr>
    <td><b>JWT Authentication</b></td>
    <td>Protected REST APIs and Socket.IO connections using signed access tokens</td>
  </tr>
  <tr>
    <td><b>Google Login</b></td>
    <td>Google Identity Services login with backend token verification</td>
  </tr>
  <tr>
    <td><b>Real-time Messaging</b></td>
    <td>Socket.IO-powered private and group chat with live message delivery</td>
  </tr>
  <tr>
    <td><b>Typing Indicators</b></td>
    <td>Realtime typing and stop-typing events inside conversations</td>
  </tr>
  <tr>
    <td><b>Image Uploads</b></td>
    <td>Chat images uploaded to Cloudinary and stored as message URLs</td>
  </tr>
  <tr>
    <td><b>Push Notifications</b></td>
    <td>Firebase Cloud Messaging token registration and notification delivery</td>
  </tr>
  <tr>
    <td><b>PostgreSQL Database</b></td>
    <td>Users, conversations, memberships, messages, and notification tokens stored with Prisma ORM</td>
  </tr>
  <tr>
    <td><b>Redis Caching</b></td>
    <td>Redis-backed cache with in-memory fallback for development resilience</td>
  </tr>
  <tr>
    <td><b>Rate Limiting</b></td>
    <td>Global API rate limits plus stricter authentication route limits</td>
  </tr>
  <tr>
    <td><b>Docker Deployment</b></td>
    <td>Dockerized backend, local Docker Compose, and Azure Container Apps deployment script</td>
  </tr>
</table>

---

## 🏗️ System Architecture

```mermaid
flowchart LR
  Browser[User Browser] --> Vite[Vite React Frontend]
  Vite -->|REST API + JWT| API[Express API]
  Vite <-->|Socket.IO + JWT| Socket[Socket.IO Server]
  API --> Prisma[Prisma ORM]
  Socket --> Prisma
  Prisma --> Postgres[(PostgreSQL)]
  API --> Redis[(Redis Cache)]
  API --> Cloudinary[Cloudinary]
  API --> Firebase[Firebase Cloud Messaging]
```

### Backend Module Layout

```mermaid
flowchart TB
  App[server/src/app.js] --> Auth[auth]
  App --> Users[users]
  App --> Conversations[conversations]
  App --> Messages[messages]
  App --> Uploads[uploads]
  App --> Notifications[notifications]
  App --> Shared[shared/db, cache, jwt, middleware]
  Realtime[realtime] --> Messages
  Shared --> Prisma[(Prisma + PostgreSQL)]
  Shared --> Redis[(Redis)]
```

---

## 🛠️ Tech Stack

### Frontend

<table width="100%" align="center">
  <tr>
    <td align="center" width="33%"><img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=111" /></td>
    <td align="center" width="33%"><img src="https://img.shields.io/badge/Vite-5.4.1-646CFF?style=for-the-badge&logo=vite&logoColor=white" /></td>
    <td align="center" width="33%"><img src="https://img.shields.io/badge/Axios-1.16.0-5A29E4?style=for-the-badge&logo=axios&logoColor=white" /></td>
  </tr>
  <tr>
    <td align="center"><img src="https://img.shields.io/badge/Socket.IO_Client-4.7.2-010101?style=for-the-badge&logo=socket.io&logoColor=white" /></td>
    <td align="center"><img src="https://img.shields.io/badge/Tailwind_CSS-4.3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" /></td>
    <td align="center"><img src="https://img.shields.io/badge/Firebase-12.6.0-FFCA28?style=for-the-badge&logo=firebase&logoColor=111" /></td>
  </tr>
</table>

### Backend

<table width="100%" align="center">
  <tr>
    <td align="center" width="25%"><img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white" /></td>
    <td align="center" width="25%"><img src="https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white" /></td>
    <td align="center" width="25%"><img src="https://img.shields.io/badge/Socket.IO-4.7.2-010101?style=for-the-badge&logo=socket.io&logoColor=white" /></td>
    <td align="center" width="25%"><img src="https://img.shields.io/badge/JWT-9.0.2-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" /></td>
  </tr>
  <tr>
    <td align="center"><img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" /></td>
    <td align="center"><img src="https://img.shields.io/badge/Prisma-7-2D3748?style=for-the-badge&logo=prisma&logoColor=white" /></td>
    <td align="center"><img src="https://img.shields.io/badge/Redis-4.7.0-DC382D?style=for-the-badge&logo=redis&logoColor=white" /></td>
    <td align="center"><img src="https://img.shields.io/badge/Cloudinary-2.8.0-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" /></td>
  </tr>
</table>

### Infrastructure

<table width="100%" align="center">
  <tr>
    <td align="center" width="25%"><img src="https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white" /></td>
    <td align="center" width="25%"><img src="https://img.shields.io/badge/Azure_Container_Apps-Backend-0078D4?style=for-the-badge&logo=microsoftazure&logoColor=white" /></td>
    <td align="center" width="25%"><img src="https://img.shields.io/badge/Vercel-Frontend-000000?style=for-the-badge&logo=vercel&logoColor=white" /></td>
    <td align="center" width="25%"><img src="https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" /></td>
  </tr>
</table>

---

## 📁 Project Structure

```text
farhanaislamsaima/
├── client/
│   ├── public/
│   │   ├── echoline-logo.svg
│   │   ├── favicon.svg
│   │   └── firebase-messaging-sw.js
│   ├── scripts/
│   │   └── generate-firebase-sw.mjs
│   └── src/
│       ├── api/
│       │   └── apiClient.js
│       ├── components/
│       │   ├── AuthPage.jsx
│       │   ├── ChatHeader.jsx
│       │   ├── ChatPage.jsx
│       │   ├── ConversationPanel.jsx
│       │   ├── MessageForm.jsx
│       │   └── MessageList.jsx
│       ├── utils/
│       │   ├── notifications.js
│       │   └── storage.js
│       ├── App.jsx
│       └── main.jsx
├── server/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── conversations/
│   │   │   ├── messages/
│   │   │   ├── notifications/
│   │   │   ├── realtime/
│   │   │   ├── uploads/
│   │   │   └── users/
│   │   ├── shared/
│   │   │   ├── auth.middleware.js
│   │   │   ├── cache.js
│   │   │   ├── db.js
│   │   │   ├── firebase.js
│   │   │   └── jwt.js
│   │   └── app.js
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── deploy-azure.ps1
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🧩 Database Models

The Prisma schema lives in:

```text
server/prisma/schema.prisma
```

```mermaid
erDiagram
  USER ||--o{ CONVERSATION_MEMBER : joins
  USER ||--o{ MESSAGE : sends
  USER ||--o{ NOTIFICATION_TOKEN : owns
  USER ||--o{ CONVERSATION : creates
  CONVERSATION ||--o{ CONVERSATION_MEMBER : has
  CONVERSATION ||--o{ MESSAGE : contains

  USER {
    string id
    string name
    string email
    string password
    string authProvider
    string googleId
  }

  CONVERSATION {
    string id
    string name
    string type
    string createdById
  }

  CONVERSATION_MEMBER {
    string id
    string conversationId
    string userId
  }

  MESSAGE {
    string id
    string user
    string senderId
    string conversationId
    string text
    string imageUrl
  }

  NOTIFICATION_TOKEN {
    string id
    string userId
    string token
  }
```

---

## 📡 API Endpoints

Base URL:

```text
http://localhost:4000/api
```

Production example:

```text
https://<your-azure-container-app-url>/api
```

### Authentication

<table width="100%">
  <tr>
    <th align="center">Method</th>
    <th align="left">Endpoint</th>
    <th align="left">Description</th>
    <th align="center">Auth</th>
  </tr>
  <tr>
    <td align="center"><code>POST</code></td>
    <td><code>/auth/register</code></td>
    <td>Create a new email/password account</td>
    <td align="center">No</td>
  </tr>
  <tr>
    <td align="center"><code>POST</code></td>
    <td><code>/auth/login</code></td>
    <td>Login with email and password</td>
    <td align="center">No</td>
  </tr>
  <tr>
    <td align="center"><code>POST</code></td>
    <td><code>/auth/google</code></td>
    <td>Login or register using a Google credential token</td>
    <td align="center">No</td>
  </tr>
</table>

### Users

<table width="100%">
  <tr>
    <th align="center">Method</th>
    <th align="left">Endpoint</th>
    <th align="left">Description</th>
    <th align="center">Auth</th>
  </tr>
  <tr>
    <td align="center"><code>GET</code></td>
    <td><code>/users</code></td>
    <td>Get all users for chat discovery</td>
    <td align="center">JWT</td>
  </tr>
  <tr>
    <td align="center"><code>GET</code></td>
    <td><code>/conversations/users</code></td>
    <td>Compatibility route for fetching users from the conversations module</td>
    <td align="center">JWT</td>
  </tr>
</table>

### Conversations

<table width="100%">
  <tr>
    <th align="center">Method</th>
    <th align="left">Endpoint</th>
    <th align="left">Description</th>
    <th align="center">Auth</th>
  </tr>
  <tr>
    <td align="center"><code>GET</code></td>
    <td><code>/conversations?userId=&lt;id&gt;</code></td>
    <td>Get conversations for the current user</td>
    <td align="center">JWT</td>
  </tr>
  <tr>
    <td align="center"><code>POST</code></td>
    <td><code>/conversations</code></td>
    <td>Create a direct or group conversation</td>
    <td align="center">JWT</td>
  </tr>
  <tr>
    <td align="center"><code>PATCH</code></td>
    <td><code>/conversations/:id/leave</code></td>
    <td>Leave a group conversation</td>
    <td align="center">JWT</td>
  </tr>
</table>

### Messages

<table width="100%">
  <tr>
    <th align="center">Method</th>
    <th align="left">Endpoint</th>
    <th align="left">Description</th>
    <th align="center">Auth</th>
  </tr>
  <tr>
    <td align="center"><code>GET</code></td>
    <td><code>/messages?conversationId=&lt;id&gt;</code></td>
    <td>Get messages for a conversation</td>
    <td align="center">JWT</td>
  </tr>
  <tr>
    <td align="center"><code>POST</code></td>
    <td><code>/messages</code></td>
    <td>Create a message through REST API</td>
    <td align="center">JWT</td>
  </tr>
</table>

### Uploads And Notifications

<table width="100%">
  <tr>
    <th align="center">Method</th>
    <th align="left">Endpoint</th>
    <th align="left">Description</th>
    <th align="center">Auth</th>
  </tr>
  <tr>
    <td align="center"><code>POST</code></td>
    <td><code>/uploads/image</code></td>
    <td>Upload an image to Cloudinary using multipart field <code>image</code></td>
    <td align="center">JWT</td>
  </tr>
  <tr>
    <td align="center"><code>POST</code></td>
    <td><code>/notifications/token</code></td>
    <td>Register a browser Firebase notification token for the logged-in user</td>
    <td align="center">JWT</td>
  </tr>
</table>

### Health Check

<table width="100%">
  <tr>
    <th align="center">Method</th>
    <th align="left">Endpoint</th>
    <th align="left">Description</th>
  </tr>
  <tr>
    <td align="center"><code>GET</code></td>
    <td><code>/</code></td>
    <td>Returns <code>Chat server is running</code></td>
  </tr>
</table>

---

## 🔌 Socket.IO Events

<table width="100%">
  <tr>
    <th align="left">Event</th>
    <th align="left">Direction</th>
    <th align="left">Description</th>
  </tr>
  <tr>
    <td><code>joinConversation</code></td>
    <td>Client to Server</td>
    <td>Join a conversation room</td>
  </tr>
  <tr>
    <td><code>leaveConversation</code></td>
    <td>Client to Server</td>
    <td>Leave a conversation room</td>
  </tr>
  <tr>
    <td><code>sendMessage</code></td>
    <td>Client to Server</td>
    <td>Create a message and broadcast it to the conversation room</td>
  </tr>
  <tr>
    <td><code>receiveMessage</code></td>
    <td>Server to Client</td>
    <td>Receive a newly created message in realtime</td>
  </tr>
  <tr>
    <td><code>typing</code></td>
    <td>Client to Server to Clients</td>
    <td>Show typing indicator to other users in the conversation</td>
  </tr>
  <tr>
    <td><code>stopTyping</code></td>
    <td>Client to Server to Clients</td>
    <td>Clear typing indicator</td>
  </tr>
</table>

Socket connections require a JWT token in the Socket.IO auth payload.

---

## 🚀 Installation & Local Setup

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- Git
- Cloudinary account for image uploads
- Firebase project for browser notifications
- Google OAuth client ID for Google login

### 1. Clone And Install

```bash
git clone https://github.com/<your-username>/web-development-bootcamp-may-2026.git
cd web-development-bootcamp-may-2026/farhanaislamsaima
npm install
```

### 2. Configure Environment

Create a root `.env` file for Docker/deployment values and create local service env files as needed.

Server example:

```env
DATABASE_URL=postgresql://chatuser:chatpassword@localhost:5433/chatdb
REDIS_URL=redis://localhost:6379
JWT_SECRET=replace-with-a-long-random-secret
PORT=4000
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_FOLDER=echoline/chat-images

FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-admin-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nreplace-with-private-key\n-----END PRIVATE KEY-----\n"
```

Client example:

```env
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

VITE_FIREBASE_API_KEY=your-firebase-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-web-app-id
VITE_FIREBASE_VAPID_KEY=your-web-push-vapid-key
```

### 3. Start With Docker

```bash
docker compose up --build
```

Local URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:4000
Postgres: localhost:5433
Redis:    localhost:6379
```

### 4. Start Without Docker

Start PostgreSQL and Redis first, then run:

```bash
npm run db:push --workspace server
npm run dev
```

Or run each side separately:

```bash
npm run dev --workspace server
npm run dev --workspace client
```

---

## 🧪 Backend Testing

The backend includes a lightweight test setup using Node.js built-in test runner, so no extra testing framework is required.

Current tests cover:

- JWT token signing and verification
- Invalid JWT rejection
- Auth middleware behavior for missing, valid, and invalid tokens
- Express health check route
- CORS preflight behavior for allowed frontend origins

Run backend tests from the project folder:

```powershell
cd E:\chatapp-bootcamp\web-development-bootcamp-may-2026\farhanaislamsaima
npm test --workspace server
```

If Windows/npm shows a local permission error, run the test files directly:

```powershell
cd E:\chatapp-bootcamp\web-development-bootcamp-may-2026\farhanaislamsaima\server
node --test .\test\app.test.js .\test\auth.middleware.test.js .\test\jwt.test.js
```

Expected successful result:

```text
# tests 7
# pass 7
# fail 0
```

---

## 🌍 Deployment

### Frontend On Vercel

Recommended settings:

```text
Framework Preset: Vite
Root Directory: farhanaislamsaima/client
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Required Vercel environment variables:

```text
VITE_API_URL=https://<your-azure-backend-url>/api
VITE_SOCKET_URL=https://<your-azure-backend-url>
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
VITE_FIREBASE_API_KEY=<your-firebase-web-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
VITE_FIREBASE_PROJECT_ID=<your-firebase-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_FIREBASE_APP_ID=<your-firebase-app-id>
VITE_FIREBASE_VAPID_KEY=<your-vapid-key>
```

Also add your Vercel domain to:

- Azure backend `CLIENT_URL`
- Google OAuth Authorized JavaScript origins
- Firebase Web Push/browser configuration as needed

### Backend On Azure Container Apps

This project includes a one-script Azure deployment:

```powershell
.\deploy-azure.ps1 -ResourceGroup chatapp-rg
```

The script:

1. Builds the backend Docker image
2. Pushes it to Docker Hub
3. Creates or reuses an Azure Container Apps environment
4. Deploys internal PostgreSQL and Redis container apps
5. Deploys the external backend container app
6. Prints the backend URL and frontend environment variables

> The containerized PostgreSQL and Redis setup is convenient for demos and bootcamp deployment. For production, use managed PostgreSQL and managed Redis with backups, scaling, and monitoring.

Required deployment variables in the project root `.env`:

```env
DOCKERHUB_USERNAME=your-dockerhub-username
AZURE_POSTGRES_PASSWORD=replace-with-strong-password
CLIENT_URL=https://your-vercel-domain.vercel.app

JWT_SECRET=replace-with-long-random-secret
GOOGLE_CLIENT_ID=your-google-client-id

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
CLOUDINARY_UPLOAD_FOLDER=echoline/chat-images

FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nreplace-with-private-key\n-----END PRIVATE KEY-----\n"
```

---

## ⚙️ GitHub Actions CI/CD

The backend deployment workflow lives in the parent repository:

```text
.github/workflows/farhana-backend-deploy.yml
```

The workflow builds the backend Docker image, pushes it to Docker Hub, and updates the Azure Container App image.

Required GitHub secrets:

```text
DOCKERHUB_TOKEN
AZURE_CREDENTIALS
```

Azure credentials should come from a service principal that has access to the Azure subscription and resource group.

---

## 🔒 Security Notes

- Never commit `.env` files.
- Rotate any secret that has been pasted into chat, logs, or Git history.
- Use a long random `JWT_SECRET`.
- Use GitHub secrets, Vercel environment variables, and Azure Container App environment variables for production secrets.
- Keep `CLIENT_URL` strict in production so CORS only allows trusted frontend origins.
- Store Firebase Admin credentials only on the backend.
- Use Cloudinary upload restrictions and folder organization for media safety.
- For production-grade auth, consider refresh tokens or secure HTTP-only cookies.

---

## ⚠️ Known Limitations

- The backend is a modular monolith, not separately deployed microservices.
- Socket.IO is not yet configured with a Redis adapter for multiple backend replicas.
- Containerized PostgreSQL on Azure Container Apps is best for demo usage, not long-term production data storage.
- Firebase notifications require browser permission and may not display while the current browser tab is focused.
- Redis has an in-memory fallback, but production should use a stable Redis service.

---

## 🧭 Future Improvements

- Message edit and delete
- Message reactions
- Read receipts
- Online/offline presence
- Profile avatar upload
- Group admin roles
- Redis Socket.IO adapter for horizontal scaling
- Managed PostgreSQL and managed Redis for production
- Automated tests for API, Prisma services, and realtime events
- Better notification UX for foreground messages

---

<div align="center">

## Built By Farhana Islam Saima

Real-time chat, PostgreSQL, Prisma, Redis, Cloudinary, Firebase, Docker, Azure, and Vercel.

</div>
