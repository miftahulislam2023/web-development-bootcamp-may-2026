const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  validateEmail,
  validatePassword,
  validateName,
  sanitizeString,
  sanitizeEmail,
} = require("../utils/validators");
const { AppError, asyncHandler } = require("../middleware/errorHandler");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required", 400);
  }
  if (!validateName(name)) {
    throw new AppError("Name must be between 2-100 characters", 400);
  }
  if (!validateEmail(email)) {
    throw new AppError("Invalid email format", 400);
  }
  if (!validatePassword(password)) {
    throw new AppError("Password must be at least 6 characters", 400);
  }

  const sanitizedEmail = sanitizeEmail(email);
  const sanitizedName = sanitizeString(name);

  // Check if email already exists
  const existingUser = await User.findOne({ email: sanitizedEmail });
  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  // Hash password and create user
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: sanitizedName,
    email: sanitizedEmail,
    passwordHash,
  });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: sanitize(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    throw new AppError("Email and password are required", 400);
  }
  if (!validateEmail(email)) {
    throw new AppError("Invalid email format", 400);
  }

  const sanitizedEmail = sanitizeEmail(email);
  const user = await User.findOne({ email: sanitizedEmail });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  // Check if user signed up with Google
  if (user.passwordHash === "google-oauth") {
    throw new AppError("Please sign in with Google instead", 400);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  // Check if account is active
  if (!user.isActive) {
    throw new AppError("Account has been deactivated", 403);
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: sanitize(user),
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: sanitize(req.user) });
});

const sanitize = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  avatar: u.avatar,
  currency: u.currency,
  monthlyBudget: u.monthlyBudget,
  theme: u.theme,
  googleId: u.googleId,
});

module.exports = { register, login, getMe, generateToken, sanitize };
