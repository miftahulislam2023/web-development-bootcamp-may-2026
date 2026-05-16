# 🚀 Nexora Studio — API Collection (Postman Style)

This document provides a detailed reference for Nexora Studio's API architecture, including REST endpoints and internal Server Actions.

---

## 🔐 Authentication Endpoints

### [POST] `/api/auth/callback/credentials`
Log in using email and password. (Handled by Auth.js)

**Headers:**
```yaml
Content-Type: application/json
```

**Body:**
```json
{
  "email": "user@example.com",
  "password": "your-password",
  "redirect": false
}
```

**Response (200 OK):**
```json
{
  "url": "http://localhost:3000/dashboard"
}
```

---

### [ACTION] `registerUser`
Registers a new user account.

**Arguments:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Verification email sent. Please check your inbox."
}
```

**Error Response (400):**
```json
{
  "error": "Email already in use"
}
```

---

## 🏗️ Project Management

### [ACTION] `createProject`
Initializes a new visual project.

**Arguments:**
```json
{
  "name": "My New Website",
  "templateId": "tmpl_123" // Optional
}
```

**Success Response:**
```json
{
  "id": "proj_abc123",
  "slug": "my-new-website",
  "status": "draft"
}
```

---

### [ACTION] `updateProjectCanvas`
Saves the visual state of the builder.

**Arguments:**
```json
{
  "projectId": "proj_abc123",
  "canvasData": [
    {
      "id": "section_1",
      "type": "hero-basic",
      "props": { "title": "Welcome Home" }
    }
  ]
}
```

**Success Response:**
```json
{
  "success": true,
  "updatedAt": "2024-05-16T03:17:49Z"
}
```

---

## 🛒 Marketplace & Payments

### [ACTION] `createTemplatePurchase`
Initiates a Stripe Checkout session for a premium template.

**Arguments:**
```json
{
  "templateId": "tmpl_premium_01"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_abc123...",
  "url": "https://checkout.stripe.com/pay/..."
}
```

---

### [POST] `/api/webhooks/stripe`
Asynchronous payment confirmation.

**Headers:**
```yaml
stripe-signature: t=...,v1=...,v0=...
```

**Body (Stripe Event):**
```json
{
  "id": "evt_123",
  "type": "checkout.session.completed",
  "data": {
    "object": {
      "id": "cs_test_...",
      "metadata": { "userId": "user_123", "templateId": "tmpl_456" }
    }
  }
}
```

**Response:**
```json
{ "received": true }
```

---

## 🛡️ Admin API

### [ACTION] `toggleUserBlock`
Instantly restricts or restores user access.

**Arguments:**
```json
{
  "userId": "user_987",
  "isBlocked": true
}
```

**Response:**
```json
{
  "success": true,
  "blockedAt": "2024-05-16T03:17:49Z"
}
```

---

## 🏥 System

### [GET] `/api/health`
Check if the application and database are responsive.

**Response (200 OK):**
```json
{
  "ok": true,
  "service": "nexora-studio",
  "timestamp": "2024-05-16T03:17:49Z"
}
```

---

## 💡 Pro Tips for Postman
1.  **Auth State:** Since Auth.js uses `httpOnly` cookies for sessions, you'll need to manually copy the `authjs.session-token` from your browser to Postman's cookie jar to test protected Actions.
2.  **Redirects:** Auth.js handles redirects automatically. Ensure Postman's "Follow Redirects" setting is enabled.
3.  **Local Testing:** Use `ngrok` or `stripe-cli` to test the Stripe Webhook locally.
