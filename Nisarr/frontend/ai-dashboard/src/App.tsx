// Orbit AI Dashboard — standalone micro-frontend
// Communicates with parent Web App via window.postMessage
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// postMessage bridge to parent Web App
const sendToParent = (type: string, payload: any = {}) => {
  window.parent.postMessage({ source: "ai-dashboard", type, payload }, "*")
}

export default function App() {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [parentContext, setParentContext] = useState("")

  // Listen for messages from parent
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.source === "web-app") {
        if (event.data.type === "context") setParentContext(event.data.payload)
        if (event.data.type === "token") localStorage.setItem("lifeos-token", event.data.payload)
      }
    }
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  }, [])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return
    const userMsg = { role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: input }] }),
      })
      const data = await res.json()
      if (data.success && data.content) {
        setMessages(prev => [...prev, { role: "assistant", content: data.content }])
        // Notify parent of any actions
        sendToParent("ai-response", { content: data.content })
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Oops! Something went wrong 🙏" }])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading])

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0a0e1a", color: "#e2e8f0", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)", background: "rgba(15,23,42,0.8)", backdropFilter: "blur(10px)" }}>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600, background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🤖 Orbit AI
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: "12px", opacity: 0.6 }}>Your AI life advisor</p>
      </motion.div>

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", marginTop: "40%", opacity: 0.4 }}>
            <p style={{ fontSize: "48px" }}>🌍</p>
            <p>Ask me anything about your life!</p>
          </motion.div>
        )}
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%",
                padding: "10px 14px", borderRadius: "12px", fontSize: "14px", lineHeight: 1.5,
                background: msg.role === "user" ? "linear-gradient(135deg, #3b82f6, #6366f1)" : "rgba(30,41,59,0.8)",
                border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
              {msg.content}
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ alignSelf: "flex-start", padding: "10px 14px", borderRadius: "12px", background: "rgba(30,41,59,0.8)", fontSize: "14px" }}>
            Thinking...
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.1)", background: "rgba(15,23,42,0.8)", display: "flex", gap: "8px" }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Ask Orbit anything..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(30,41,59,0.6)", color: "#e2e8f0", fontSize: "14px", outline: "none" }} />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendMessage}
          style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", fontWeight: 600, cursor: "pointer" }}>
          Send
        </motion.button>
      </div>
    </div>
  )
}
