const express = require("express");

const {
  registerUser,
  loginUser,
  getUsers,
  updateProfile,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", getUsers);
router.put("/update-profile", updateProfile);

module.exports = router;