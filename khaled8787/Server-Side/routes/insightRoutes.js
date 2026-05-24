const express = require("express");
const router = express.Router();
const Mood = require("../models/Mood");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const data = await Mood.find({ userId: req.user.id });

    if (data.length === 0) {
      return res.json({ message: "No mood data yet" });
    }

    const sad = data.filter(d => d.mood === "sad");
    const happy = data.filter(d => d.mood === "happy");

    const total = data.length;

    const sadPercent = (sad.length / total) * 100;

    let insight = "";

    if (sadPercent > 40) {
      insight = "⚠️ You spend more when you are sad.";
    } else if (sadPercent > 20) {
      insight = "🙂 Slight emotional spending pattern detected.";
    } else {
      insight = "🔥 Your spending behavior is balanced.";
    }

    res.json({ insight });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;