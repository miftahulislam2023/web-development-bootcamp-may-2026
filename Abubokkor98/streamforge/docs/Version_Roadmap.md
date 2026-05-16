# StreamForge — Version Roadmap

> Single-Host Live Streaming Platform | Status: MVP Review | May 2026

This document provides a comprehensive audit of the current StreamForge codebase against the original project requirements, detailing what is fully implemented in Version 1, what remains incomplete for Version 1, and the planned feature set for Version 2.

---

## 🟢 Version 1 (MVP) — Fully Implemented Features

The following features from the original MVP requirements have been successfully built, integrated, and verified in the codebase:

### Authentication & Account Access
- **User Registration & Login:** Full JWT-based authentication via `users` table.
- **Forgot Password Workflow:** OTP generation, email verification logic, and password reset (`password_reset_otps`).
- **Session Management:** Refresh tokens stored in HttpOnly cookies, 15-minute access tokens, and logout functionality (`refresh_tokens`).
- **Guest Access:** Non-registered users can join a stream using a temporary display name.

### Room & Stream Management
- **Room Creation & Editing:** Hosts can create rooms with a title, description, and thumbnail, generating a unique `roomKey` (`rooms`).
- **Room Status Lifecycle:** Seamless transition between `OFFLINE`, `LIVE`, and `ENDED` states.
- **Host Disconnection Grace Period:** The backend receives LiveKit webhooks (`participant_disconnected`) and starts a 30-second grace period before automatically ending the stream.
- **Host Dashboard:** Overview of all rooms, stream history, and post-stream summaries (duration, peak viewers, message counts) via `stream_sessions`.

### Broadcasting & Media Controls
- **WebRTC Integration:** LiveKit SFU fully integrated for low-latency streaming.
- **Host Controls:** Mute/unmute microphone, toggle camera on/off, and screen sharing (`BroadcastControls.tsx`).
- **Camera-Off Placeholder:** When the camera is disabled, the host's specific avatar (`avatar_url`) is displayed gracefully to viewers instead of a blank screen.

### Viewer Experience
- **Live Watch Page:** Real-time stream viewing with sub-500ms latency.
- **Stream States:** "Waiting for host..." screen for offline rooms, and "Stream has ended" overlay upon completion.

### Real-Time Interactivity (Socket.io)
- **Live Chat:** Real-time messaging, chat history fetching (last 50 messages), and a 300-character limit.
- **Chat Moderation:** Host can delete and pin messages.
- **Chat Rate Limiting & Slow Mode:** Configurable slow-mode delays (10s, 30s, 60s) and guest chat toggling.
- **Reactions:** Emoji reaction bar with floating animations and cooldown rate limiting.
- **Live Metrics:** Real-time viewer count updates across all participants.

---

## 🟡 Version 1 (MVP) — Missing or Incomplete Features

*All Version 1 features have now been successfully implemented.*

---

## 🔵 Version 2 — Future Roadmap

The following features were originally slated for Version 2 or discovered as future enhancements during the audit. They remain pending for the next major release cycle:

### Engagement & Growth
- **Viewer Follow System:** Allow viewers to follow hosts and subscribe to notifications (`follows` table).
- **Push Notifications:** Browser push notifications for when a followed host goes live (`notification_subscriptions`).

### Content Management
- **Stream Scheduling:** Allow hosts to schedule a stream with a planned start time.
- **Stream Recording:** Automatic recording of live streams for VOD (Video on Demand) playback.

### Customization
- **Dark Mode:** *Note: Currently partially implemented.* The `ThemeProvider` with a "d" hotkey toggle exists in the codebase, but a formal UI toggle (e.g., in the Navbar) and full thematic polishing are slated for V2.

---

*Document generated following codebase audit against `StreamForge_Features_Requirements.md` and `StreamForge_User_Journey_Feature_Flow.md`.*
