# Express "Trust Proxy" Guide

This document explains the technical necessity and security implications of the `app.set('trust proxy', 1)` setting in Express applications, particularly when deploying to cloud platforms like Render, AWS, or Vercel.

## 1. The Proxy Architecture
When you deploy your application to a modern cloud hosting platform (like Render), your Express Node.js server is not directly exposed to the public internet. Instead, it sits safely behind a **Load Balancer** (also known as a Reverse Proxy).

### How Traffic Flows:
`User (HTTPS)` ➡️ `Load Balancer` ➡️ `Express App (HTTP)`

1. **HTTPS Termination:** The load balancer handles the heavy lifting of the SSL/HTTPS certificate. Once it decrypts the traffic, it forwards the request to your internal Express app using a fast, internal HTTP connection.
2. **IP Obfuscation:** Because the load balancer is the machine making the direct network connection to Express, Express thinks the incoming connection is coming from the IP address of the load balancer itself, not the actual user.

---

## 2. The Default Behavior (Without Trust Proxy)
By default, Express is highly secure and paranoid. It ignores any routing headers (`X-Forwarded-*`) because those headers can be easily spoofed by malicious actors.

If `trust proxy` is disabled, Express assumes:
1. **The Request is HTTP:** This breaks any logic relying on secure connections (`req.secure === true`). Consequently, Secure cookies (like those required for `SameSite=None` in Cross-Origin setups) will fail to set, completely breaking authentication.
2. **The Client IP is the Proxy's IP:** If you use a rate limiter, Express sees *every single request* as coming from the exact same IP address (the load balancer). Your rate limiter will quickly block everyone on the internet because it thinks one single person is spamming the server!

---

## 3. Enabling `trust proxy`
When you tell Express to trust the proxy, it starts reading and respecting the `X-Forwarded-*` HTTP headers injected by the trusted load balancer.

It fixes three major behaviors in Express:
1. **`req.ip` is fixed:** Express parses the `X-Forwarded-For` header. It now knows the actual IP address of the user. Rate limiters can now accurately ban individual abusive users without blocking innocent ones.
2. **`req.secure` is fixed:** Express reads the `X-Forwarded-Proto` header. Even though Express receives the traffic over HTTP, the header says `https`. Express correctly sets `req.secure = true`, which allows Secure Cookies to be successfully passed to the frontend.
3. **`req.hostname` is fixed:** Express reads the `X-Forwarded-Host` header to know the original domain name requested by the client, rather than the internal networking IP of the container.

---

## 4. The Critical Difference: `1` vs `true`
When configuring `trust proxy`, you must pass a value. The difference between `true` and `1` dictates how Express handles the `X-Forwarded-For` chain.

### The "Envelope" Analogy
Imagine your Express server is in a room with no windows. A messenger (the Render Load Balancer) hands you an envelope. To know who originally sent the envelope, the messenger writes a list of everyone who handled it on the outside. This is the `X-Forwarded-For` header.

A normal envelope:
`X-Forwarded-For: [User's Real IP]`

A hacked envelope (where a hacker wrote a fake IP *before* handing it to the messenger):
`X-Forwarded-For: [Fake IP], [Hacker's Real IP]`

### Scenario A: `app.set('trust proxy', true)` ❌ (Dangerous)
Setting the value to `true` tells Express to trust the **entire chain** of IPs, scanning from left-to-right. 
When Express reads `[Fake IP], [Hacker's Real IP]`, it looks at the first item (`Fake IP`) and assumes it is the true origin.

**The Exploit:** A hacker can bypass your rate-limiters entirely. They can spam your API millions of times by constantly changing the `Fake IP` header. Your rate-limiter will never block them because it thinks millions of different people are visiting.

### Scenario B: `app.set('trust proxy', 1)` ✅ (Secure)
Setting the value to `1` tells Express: *"Only trust the IP address provided by the 1 proxy sitting immediately in front of me."*

Instead of reading left-to-right, Express reads the list **backwards** (from right-to-left). It hops back exactly `1` step from the end of the list, because the last IP added is *always* the one added by your trusted hosting provider (Render).

When Express reads `[Fake IP], [Hacker's Real IP]`, it hops back 1 step and lands on `Hacker's Real IP`. It completely ignores the `Fake IP` that the hacker tried to inject.

**The Result:** Express catches the hacker's true identity. Your rate-limiter sees that this specific IP is sending too many requests and successfully blocks them, ignoring the spoofed IP.

---

## 5. Summary & Best Practices
Always use `app.set('trust proxy', 1)` when deploying to a single-load-balancer cloud provider (Render, Vercel, Heroku, AWS ELB). 

* Use `1` if you are behind a single load balancer.
* Use `2` if you are behind Cloudflare *and* a cloud provider load balancer (2 hops).
* **Never use `true`** unless you fully control the entire network routing layer and are certain headers cannot be spoofed.
