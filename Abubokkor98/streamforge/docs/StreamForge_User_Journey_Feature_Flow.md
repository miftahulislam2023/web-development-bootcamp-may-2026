# StreamForge — User Journey & Feature Flow

> Single-Host Live Streaming Platform | Version 1.0 | May 2026

---

## Journey 01 — Host Registration & Onboarding

**Actor:** New Host
**Goal:** Create an account and access the dashboard

---

- **Step 01** — User visits the StreamForge homepage and clicks **"Get Started"** or **"Sign Up as Host"**
- **Step 02** — User is navigated to the `/register` page
- **Step 03** — User fills in the registration form: Full Name, Email Address, Password, Confirm Password
- **Step 04** — Client-side validation runs on form submission — checks required fields, email format, password strength (min 8 chars, 1 number, 1 special character), and password match
- **Step 05** — Frontend sends a `POST /api/auth/register` request to the backend API
- **Step 06** — API checks if email already exists in PostgreSQL via Prisma — if duplicate, returns a `409 Conflict` error and shows inline field error to the user
- **Step 07** — Password is hashed using `bcryptjs` and a new User record is created in the database
- **Step 08** — A JWT access token (15-minute TTL) is generated and returned in the response body. A refresh token (7-day TTL) is set as an HttpOnly, Secure, SameSite cookie
- **Step 09** — Access token is stored in memory on the frontend. Refresh token is managed automatically by the browser via the HttpOnly cookie
- **Step 10** — User is redirected to `/dashboard` — the Host Dashboard

---

## Journey 02 — Host Login

**Actor:** Returning Host
**Goal:** Log in and return to the dashboard

---

- **Step 01** — User visits `/login` page
- **Step 02** — User enters Email and Password and clicks **"Login"**
- **Step 03** — Frontend sends `POST /api/auth/login` request
- **Step 04** — API queries the database for the user by email using Prisma
- **Step 05** — If user not found, returns generic `401` error: *"Invalid email or password"* (no specific field hint for security)
- **Step 06** — If user found, `bcryptjs.compare()` validates the password hash
- **Step 07** — On match, a JWT access token (15-minute TTL) is generated and returned in the response body. A refresh token (7-day TTL) is set as an HttpOnly cookie
- **Step 08** — Access token stored in memory; user redirected to `/dashboard`. Refresh token is automatically managed by the browser cookie
- **Step 09** — On subsequent requests, the access token is sent in `Authorization: Bearer <token>` header and validated by middleware. When it expires, the refresh token cookie is used to silently obtain a new access token

---

## Journey 03 — Password Recovery

**Actor:** Host who forgot their password
**Goal:** Regain access to account via OTP

---

- **Step 01** — User clicks **"Forgot Password?"** on the login page
- **Step 02** — User is navigated to `/forgot-password` page
- **Step 03** — User enters their registered email address and clicks **"Send OTP"**
- **Step 04** — Frontend sends `POST /api/auth/forgot-password` with the email
- **Step 05** — API checks if the email exists in the database — if not, returns a neutral response (no account enumeration)
- **Step 06** — A 6-digit OTP is generated, hashed, and saved to the database with a 10-minute expiry
- **Step 07** — OTP is sent to the user's email via an email service (e.g. Resend or Nodemailer)
- **Step 08** — User enters the OTP on the `/verify-otp` page and clicks **"Verify"**
- **Step 09** — Frontend sends `POST /api/auth/verify-otp` — API validates the OTP hash and expiry
- **Step 10** — On success, user is navigated to `/reset-password` page
- **Step 11** — User enters new password and confirms it — frontend validates match and strength
- **Step 12** — Frontend sends `POST /api/auth/reset-password` — API updates the hashed password in DB
- **Step 13** — All existing refresh tokens for the user are invalidated, forcing re-login on all devices
- **Step 14** — User is redirected to `/login` with a success toast notification

---

## Journey 04 — Host Creates a Stream Room

**Actor:** Authenticated Host
**Goal:** Create a room and get a shareable stream URL

---

- **Step 01** — Host is on the `/dashboard` page and clicks **"Create New Room"** button
- **Step 02** — A modal or dedicated `/dashboard/create-room` page opens with a form
- **Step 03** — Host fills in: Stream Title (required), Description (optional), Thumbnail image (optional)
- **Step 04** — Frontend validates that title is not empty and thumbnail is under 2MB if provided
- **Step 05** — Frontend sends `POST /api/rooms` with form data — request includes JWT token for auth
- **Step 06** — API middleware validates the JWT and confirms the user is authenticated
- **Step 07** — A unique `roomKey` (slug) is generated using nanoid or UUID
- **Step 08** — Room record is created in PostgreSQL via Prisma with status `OFFLINE`, linked to the host's user ID
- **Step 09** — API returns the room data including the `roomKey`
- **Step 10** — Frontend displays the shareable viewer URL: `streamforge.app/stream/<roomKey>`
- **Step 11** — Host can copy the URL or share it directly from the dashboard card

---

## Journey 05 — Host Goes Live (Broadcasting)

**Actor:** Authenticated Host
**Goal:** Start streaming video and audio to viewers

---

- **Step 01** — Host navigates to `/host/<roomKey>` — the broadcast control page
- **Step 02** — Page loads and sends `GET /api/rooms/<roomKey>` to confirm room exists and host owns it
- **Step 03** — Frontend requests a LiveKit access token by calling `POST /api/livekit/token` with `{ roomKey, identity, isHost: true }`
- **Step 04** — API uses `livekit-server-sdk` to generate a signed JWT token with `canPublish: true` and `canSubscribe: true` permissions
- **Step 05** — Frontend receives the LiveKit token and connects to the LiveKit SFU server via WebSocket: `room.connect(LIVEKIT_URL, token)`
- **Step 06** — Browser prompts user for **camera and microphone permissions**
- **Step 07** — Host sees a live preview of their camera feed in the broadcast preview panel
- **Step 08** — Host clicks **"Go Live"** button
- **Step 09** — `room.localParticipant.enableCameraAndMicrophone()` is called — media tracks published to LiveKit SFU
- **Step 10** — Frontend sends `PATCH /api/rooms/<roomKey>` to update room status to `LIVE` in the database
- **Step 11** — Socket.io emits a `stream-started` event to all clients in the room
- **Step 12** — Host broadcast control bar becomes fully active — mute, camera, screen share, and end stream buttons are enabled
- **Step 13** — Live viewer count, chat panel, and stream duration timer appear on the host view

---

## Journey 06 — Viewer Joins and Watches a Stream

**Actor:** Guest or Registered Viewer
**Goal:** Join a live stream and watch in real time

---

- **Step 01** — Viewer receives or opens the stream URL: `streamforge.app/stream/<roomKey>`
- **Step 02** — Frontend sends `GET /api/rooms/<roomKey>` to fetch room metadata
- **Step 03** — If room status is `OFFLINE`, viewer sees a **"Waiting for host..."** screen with the room title and host name
- **Step 04** — If room status is `LIVE`, viewer is prompted to enter a display name (for guests) or is auto-identified (for registered users)
- **Step 05** — Frontend requests a LiveKit viewer token: `POST /api/livekit/token` with `{ roomKey, identity, isHost: false }`
- **Step 06** — API generates a token with `canPublish: false` and `canSubscribe: true`
- **Step 07** — Frontend connects to LiveKit SFU: `room.connect(LIVEKIT_URL, viewerToken)`
- **Step 08** — `RoomEvent.TrackSubscribed` fires — the host's video track is received and attached to the `<video>` DOM element
- **Step 09** — Audio track is attached and plays automatically (after user gesture if required by browser)
- **Step 10** — Socket.io emits `join-room` event with `{ roomKey, displayName }` — server adds viewer to the room's socket channel
- **Step 11** — Server emits updated `viewer-count` to all participants in the room
- **Step 12** — Viewer sees: live video feed, chat panel with last 50 messages, viewer count, and reaction bar
- **Step 13** — When host ends the stream, viewer receives `stream-ended` Socket.io event and a **"Stream has ended"** overlay appears

---

## Journey 07 — Host Controls During a Live Stream

**Actor:** Broadcasting Host
**Goal:** Manage audio, video, and screen share during stream

---

### Mute / Unmute Microphone

- **Step 01** — Host clicks the **Mute** button in the control bar
- **Step 02** — `room.localParticipant.setMicrophoneEnabled(false)` is called
- **Step 03** — LiveKit stops publishing the audio track — viewers hear silence
- **Step 04** — Mute icon updates on the host control bar
- **Step 05** — Host clicks **Unmute** — `setMicrophoneEnabled(true)` resumes audio

### Toggle Camera Off / On

- **Step 01** — Host clicks the **Camera Off** button
- **Step 02** — `room.localParticipant.setCameraEnabled(false)` is called
- **Step 03** — Video track is unpublished — viewers see a placeholder with host's avatar and name
- **Step 04** — Host clicks **Camera On** — `setCameraEnabled(true)` resumes video

### Screen Share

- **Step 01** — Host clicks the **Share Screen** button
- **Step 02** — Browser's native screen picker dialog opens
- **Step 03** — Host selects a screen, application window, or browser tab
- **Step 04** — `room.localParticipant.setScreenShareEnabled(true)` publishes the screen track
- **Step 05** — Viewers see the screen share in the video area instead of camera feed
- **Step 06** — Host clicks **Stop Sharing** — `setScreenShareEnabled(false)` reverts to camera

---

## Journey 08 — Live Chat

**Actor:** Host and Viewers
**Goal:** Send and receive real-time chat messages

---

- **Step 01** — All participants in the room are connected to Socket.io and have joined the room's channel via `join-room` event
- **Step 02** — Viewer types a message in the chat input and presses **Enter** or clicks **Send**
- **Step 03** — Frontend validates message is not empty and is under 300 characters
- **Step 04** — Rate limiter checks: if user has sent 3 messages in the last 5 seconds, the send is blocked with a warning toast
- **Step 05** — Frontend emits `send-message` event via Socket.io: `{ roomKey, sender, text, timestamp }`
- **Step 06** — Socket.io server receives the event, sanitizes the message text, and broadcasts `new-message` to all clients in the room channel
- **Step 07** — All participants' chat panels update in real time with the new message
- **Step 08** — Message is optionally saved to PostgreSQL via Prisma for chat history

### Host Pins a Message

- **Step 09** — Host hovers over any message and clicks the **Pin** icon
- **Step 10** — Frontend emits `pin-message` event with the message ID
- **Step 11** — Server broadcasts `message-pinned` event to all clients
- **Step 12** — Pinned message appears at the top of the chat panel with a pin indicator for all viewers

### Host Deletes a Message

- **Step 13** — Host clicks the **Delete** icon on any message
- **Step 14** — Frontend emits `delete-message` event with the message ID
- **Step 15** — Server broadcasts `message-deleted` event — all clients remove the message from their chat panel

---

## Journey 09 — Emoji Reactions

**Actor:** Viewer
**Goal:** Send a visual emoji reaction during the stream

---

- **Step 01** — Viewer sees the reaction bar below the video player with 5 emoji buttons: 🔥 ❤️ 👏 😂 😮
- **Step 02** — Viewer clicks an emoji button
- **Step 03** — Client-side rate limiter checks: max 1 reaction per 2 seconds per user — if too fast, click is silently ignored
- **Step 04** — Frontend emits `send-reaction` Socket.io event: `{ roomKey, emoji, sender }`
- **Step 05** — Server broadcasts `new-reaction` event to all clients in the room
- **Step 06** — All clients receive the event and trigger a floating animation on the video overlay — the emoji rises from the bottom and fades out over 2–3 seconds
- **Step 07** — Multiple viewers' reactions stack visually with randomised horizontal positions

---

## Journey 10 — Host Ends the Stream

**Actor:** Broadcasting Host
**Goal:** Cleanly end the live stream and see post-stream summary

---

- **Step 01** — Host clicks the **"End Stream"** button in the control bar
- **Step 02** — A confirmation dialog appears: *"Are you sure you want to end the stream?"* with Cancel and Confirm buttons
- **Step 03** — Host clicks **Confirm**
- **Step 04** — `room.disconnect()` is called on the LiveKit client — media tracks are unpublished
- **Step 05** — Frontend sends `PATCH /api/rooms/<roomKey>` to update room status to `ENDED` and save `streamEndedAt` timestamp
- **Step 06** — Socket.io server emits `stream-ended` event to all clients in the room channel
- **Step 07** — All viewers see the **"Stream has ended"** overlay on the video player
- **Step 08** — Viewer count drops to zero and chat input is disabled for viewers
- **Step 09** — Host is navigated to the **Post-Stream Summary** page
- **Step 10** — Summary displays: Total Duration, Peak Viewer Count, Total Chat Messages, Stream Title, and Date
- **Step 11** — Summary data is saved to the Room record in PostgreSQL for future access from the dashboard

---

## Journey 11 — Guest Viewer Joins Without Registration

**Actor:** Guest (unauthenticated) Viewer
**Goal:** Watch a live stream without creating an account

---

- **Step 01** — Guest opens the stream URL shared by the host
- **Step 02** — Frontend detects no JWT token in storage — user is treated as a guest
- **Step 03** — Guest sees a **"Join as Guest"** prompt asking for a display name (nickname)
- **Step 04** — Guest enters a display name and clicks **"Watch Now"**
- **Step 05** — Frontend generates a temporary guest identity string: `guest_<nanoid>`
- **Step 06** — LiveKit viewer token is requested from the API with the guest identity
- **Step 07** — Guest connects to the stream and Socket.io room channel with the display name
- **Step 08** — Guest can watch the video and read the chat
- **Step 09** — If host has disabled guest chat, the guest's chat input is hidden with a note: *"Login to chat"*
- **Step 10** — On page refresh or close, guest session is lost — guest must re-enter display name to rejoin

---

## Journey 12 — Host Dashboard Overview

**Actor:** Authenticated Host
**Goal:** View and manage all stream rooms from a central dashboard

---

- **Step 01** — Host logs in and lands on `/dashboard`
- **Step 02** — Frontend sends `GET /api/rooms/mine` with the JWT token
- **Step 03** — API returns a list of all rooms belonging to the logged-in host
- **Step 04** — Rooms are displayed as cards showing: Title, Status badge (Offline / Live / Ended), Created date, and quick action buttons
- **Step 05** — Host clicks **"Go Live"** on an Offline room card — navigates to `/host/<roomKey>`
- **Step 06** — Host clicks **"Copy Link"** on any room card — stream URL is copied to clipboard with a toast confirmation
- **Step 07** — Host clicks **"Edit"** — opens room edit form to update title, description, or thumbnail
- **Step 08** — Host clicks **"View Summary"** on an Ended room — navigates to the post-stream summary page for that session
- **Step 09** — Host clicks **"Delete"** on an Offline room — confirmation dialog appears before permanent deletion
