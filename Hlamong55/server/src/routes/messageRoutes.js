const express = require("express");

const {
  getMessages,
  markMessagesAsSeen,
} = require("../controllers/messageController");

const router = express.Router();

router.get("/", getMessages);
router.put("/seen", markMessagesAsSeen);

module.exports = router;
