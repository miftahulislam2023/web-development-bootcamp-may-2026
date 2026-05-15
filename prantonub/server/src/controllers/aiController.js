// server/src/controllers/aiController.js

const Transaction = require("../models/Transaction");
const { askAI } = require("../utils/aiService");

/**
 * POST /api/ai/chat
 * Accepts user message + chat history, returns Groq AI response
 * Protected by JWT middleware — only logged-in user's data is used
 */
const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Validate input
    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ success: false, error: "Message is required" });
    }

    if (message.trim().length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Message cannot be empty" });
    }

    if (message.length > 1000) {
      return res
        .status(400)
        .json({ success: false, error: "Message too long (max 1000 chars)" });
    }

    // ✅ Check Groq API key (replaced Gemini check)
    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({
        success: false,
        error:
          "AI service not configured. Please add GROQ_API_KEY to server/.env",
      });
    }

    // Fetch ONLY this user's transactions (user-scoped — secure)
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(200)
      .lean();

    // Sanitize message — strip HTML tags to prevent injection
    const sanitizedMessage = message.replace(/<[^>]*>/g, "").trim();

    // ✅ Call Groq with financial context
    const aiResponse = await askAI(transactions, history, sanitizedMessage);

    res.json({ success: true, response: aiResponse });
  } catch (err) {
    console.error("AI Chat Error:", err.message);

    // ✅ Handle Groq-specific errors
    if (
      err.message?.includes("401") ||
      err.message?.includes("invalid_api_key")
    ) {
      return res.status(503).json({
        success: false,
        error:
          "Invalid Groq API key. Please check your GROQ_API_KEY in server/.env",
      });
    }

    if (err.message?.includes("429") || err.message?.includes("rate_limit")) {
      return res.status(429).json({
        success: false,
        error: "Too many requests. Please wait a moment and try again.",
      });
    }

    if (
      err.message?.includes("503") ||
      err.message?.includes("service_unavailable")
    ) {
      return res.status(503).json({
        success: false,
        error: "Groq service temporarily unavailable. Please try again.",
      });
    }

    res.status(500).json({
      success: false,
      error: "AI service temporarily unavailable. Please try again.",
    });
  }
};

module.exports = { chat };
