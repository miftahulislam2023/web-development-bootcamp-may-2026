import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  if (!SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  if (!SECRET) {
    throw { status: 500, message: "Server configuration error" };
  }
  return jwt.verify(token, SECRET);
}

export function requireAuth(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw { status: 401, message: "Unauthorized" };
  }
  const token = authHeader.split(" ")[1];
  try {
    return verifyToken(token);
  } catch (e) {
    if (e && typeof e === "object" && e.status === 500) throw e;
    throw { status: 401, message: "Invalid or expired token" };
  }
}
