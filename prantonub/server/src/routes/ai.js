// server/src/routes/ai.js

const router = require("express").Router();
const { protect } = require("../middleware/auth");
const { chat } = require("../controllers/aiController");

// POST /api/ai/chat — protected, requires valid JWT
router.post("/chat", protect, chat);

module.exports = router;
