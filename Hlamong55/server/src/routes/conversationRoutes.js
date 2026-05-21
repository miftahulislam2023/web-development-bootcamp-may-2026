const express = require("express");

const { getConversations } = require("../controllers/cnvsnController");

const router = express.Router();

router.get("/", getConversations);

module.exports = router;
