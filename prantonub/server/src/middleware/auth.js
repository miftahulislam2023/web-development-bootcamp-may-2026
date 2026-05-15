const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // Check Authorization header first (normal API calls)
    const header = req.headers.authorization;
    if (header && header.startsWith("Bearer ")) {
      token = header.split(" ")[1];
    }
    // Fallback: check query param (used for PDF/CSV file downloads)
    else if (req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user)
      return res.status(401).json({ success: false, error: "User not found" });
    if (!user.isActive)
      return res
        .status(401)
        .json({ success: false, error: "Account deactivated" });

    req.user = user;
    next();
  } catch (err) {
    const msg =
      err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({ success: false, error: msg });
  }
};

module.exports = { protect };
