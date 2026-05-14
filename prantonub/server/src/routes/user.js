const router = require("express").Router();

const { protect } = require("../middleware/auth");

const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");

const User = require("../models/User");

// Protect all routes
router.use(protect);

// Existing routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/password", changePassword);
router.delete("/account", deleteAccount);

// NEW ROUTE → GET ALL USERS
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
