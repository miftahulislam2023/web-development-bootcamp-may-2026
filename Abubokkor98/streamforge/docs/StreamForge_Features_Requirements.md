# StreamForge — Application Features & Requirement Listing

> Single-Host Live Streaming Platform | Version 1.0 | May 2026

---

## Authentication & Account Access

1. User registration with name, email, and password — all registered users can both watch and broadcast
2. User login with JWT-based authentication
3. Forgot password with OTP verification and password reset
4. Guest viewer access — join stream without registration using a display name (limited chat, no dashboard)
5. Logout and session expiry handling (access token: 15 minutes, refresh token: 7 days via HttpOnly cookie with automatic rotation)
6. Protected routes — dashboard and broadcast page require authentication

---

## Room & Stream Management

1. Host can create a stream room with title, description, and optional thumbnail
2. System generates a unique shareable URL for each room
3. Room status management — Offline, Live, and Ended states
4. Host can go live from the browser using camera and microphone
5. Host can end the stream at any time with a confirmation dialog
6. Viewer joining an offline room sees a "Waiting for host..." screen
7. System detects unexpected host disconnection with a 30-second grace period
8. Room metadata displayed on stream page — title, host name, stream status
9. Host can schedule a stream with a planned start time (v2)

---

## Broadcasting & Media Controls

1. Host streams video and audio via WebRTC through the LiveKit SFU server
2. Host can mute and unmute microphone during a live stream
3. Host can toggle camera on and off without ending the stream
4. Camera-off state shows a placeholder avatar to viewers
5. Host can share screen in place of or alongside camera feed
6. Screen share supports full screen, application window, or browser tab
7. Host can stop screen sharing and revert to camera at any time
8. Audio-only streaming supported when host disables video
9. Stream quality adapts automatically based on viewer network bandwidth (adaptive bitrate)

---

## Viewer Experience

1. Viewers watch the live stream with sub-500ms latency in the browser
2. No plugin or app installation required — works in all modern browsers
3. Video player includes volume control, fullscreen button, and mute toggle
4. Viewers see a "Stream has ended" overlay when host ends the broadcast
5. Stream page shows room title, host name, live badge, and viewer count
6. Viewer joining mid-stream immediately sees the live feed
7. Auto-reconnect logic if viewer's WebRTC connection drops

---

## Live Chat

1. Real-time chat panel visible to all participants in the room
2. Messages display sender name, timestamp, and message text
3. Chat history shows last 50 messages to newly joined viewers
4. Messages capped at 300 characters per message
5. Chat rate limiting — maximum 3 messages per 5 seconds per user
6. Host can enable Slow Mode — configurable delay of 10s, 30s, or 60s
7. Host can delete any viewer message from the chat
8. Host can pin a message to the top of the chat panel
9. Only one message can be pinned at a time; host can unpin at any time
10. Input sanitization on all chat messages to prevent XSS attacks

---

## Viewer Engagement

1. Emoji reaction bar with 5 reactions — 🔥 ❤️ 👏 😂 😮
2. Reactions appear as floating animations on the video overlay
3. Multiple viewers' reactions render simultaneously
4. Each reaction animation fades out after 2–3 seconds
5. Reaction rate limiting — maximum 1 reaction per 2 seconds per user
6. Live viewer count displayed prominently on the stream page
7. Viewer count updates in real time as participants join and leave
8. Host sees live viewer count on the broadcast control panel

---

## Host Dashboard

1. Dashboard displays all rooms created by the host with current status
2. Host can create, edit, and delete stream rooms from the dashboard
3. Host can update room title, description, and thumbnail before going live
4. Shareable stream URL displayed and copyable from the dashboard
5. Post-stream summary shows total duration, peak viewer count, and total chat messages
6. Stream history list with past sessions and their summary data
7. One-click "Go Live" button to start broadcasting from an existing room

---

## Notifications

1. In-app toast notification when a stream the viewer follows goes live
2. Browser push notification support (opt-in with permission)
3. Toast notification for system events — host ended stream, connection issues
4. Visual indicator on the stream page when host reconnects after a brief disconnection

---

## Security & Performance

1. All WebRTC media streams are end-to-end encrypted via LiveKit
2. HTTPS enforced in all production environments
3. Access tokens expire after 15 minutes; refresh tokens (HttpOnly cookie) expire after 7 days with automatic rotation on each refresh
4. TURN server credentials rotated per session for additional security
5. Rate limiting on REST API endpoints to prevent abuse
6. End-to-end stream latency target is under 500ms under normal conditions
7. Chat message delivery target is under 200ms
8. Page load time target is under 3 seconds on a broadband connection

---

## Tech Stack Reference

| Layer | Technology |
|---|---|
| Frontend + API Routes | Next.js (latest) |
| Styling | Tailwind CSS + shadcn/ui |
| ORM | Prisma |
| Database | PostgreSQL (Neon.tech — free tier) |
| Media Server | LiveKit (self-hosted on Fly.io — free tier) |
| Real-time Events | Node.js + Socket.io (separate server) |
| Authentication | JWT (jsonwebtoken + bcryptjs) |
| STUN Server | Google STUN (free) |
| TURN Server | Metered.ca (free tier) |
| Frontend Hosting | Vercel (free tier) |
| Backend Hosting | Railway.app (free tier) |

---

## MVP vs Future Releases

| Feature | Version |
|---|---|
| Host video/audio streaming | MVP v1 |
| Viewer watch page | MVP v1 |
| Live chat | MVP v1 |
| Viewer count | MVP v1 |
| JWT Authentication | MVP v1 |
| Host controls — mute, camera, screen share, end | MVP v1 |
| Emoji reactions | MVP v1 |
| Host dashboard | MVP v1 |
| Post-stream summary | MVP v1 |
| Stream recording | v2 |
| Browser push notifications | v2 |
| Stream scheduling | v2 |
| Dark mode | v2 |
| Viewer follow / notification subscription | v2 |
