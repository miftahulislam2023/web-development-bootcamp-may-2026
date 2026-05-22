const router = require("express").Router();
const passport = require("passport");
const {
  register,
  login,
  getMe,
  generateToken,
  verifyEmail,
  resendOtp,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

const isGoogleConfigured = () =>
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== "your_google_client_id";

// Standard auth
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.get("/me", protect, getMe);

// OTP email verification
router.post("/verify-email", authLimiter, verifyEmail);
router.post("/resend-otp", authLimiter, resendOtp);

// Google OAuth
router.get("/google", (req, res, next) => {
  if (!isGoogleConfigured())
    return res.redirect(
      `${process.env.CLIENT_URL}/login?error=google_not_configured`,
    );
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next,
  );
});

router.get("/google/callback", (req, res, next) => {
  if (!isGoogleConfigured())
    return res.redirect(
      `${process.env.CLIENT_URL}/login?error=google_not_configured`,
    );
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
    session: false,
  })(req, res, (err) => {
    if (err) return next(err);
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  });
});

module.exports = router;
