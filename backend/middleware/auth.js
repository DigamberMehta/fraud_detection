import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getRedisClient, KEYS } from "../config/redis.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not authorized. No token." });
    }

    const token = authHeader.split(" ")[1];
    const redis = getRedisClient();

    const isBlacklisted = await redis.get(KEYS.blacklist(token)).catch(() => null);
    if (isBlacklisted) {
      return res.status(401).json({ success: false, message: "Token revoked. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = null;
    const cachedUser = await redis.get(KEYS.session(decoded.id)).catch(() => null);

    if (cachedUser) {
      user = JSON.parse(cachedUser);
    } else {
      user = await User.findById(decoded.id).select("-passwordHash").lean();
      if (!user) {
        return res.status(401).json({ success: false, message: "User no longer exists." });
      }
      await redis.setex(KEYS.session(decoded.id), 300, JSON.stringify(user)).catch(() => {});
    }

    if (user.isLocked) {
      return res.status(403).json({ success: false, message: "Account is locked due to suspicious activity." });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired. Please login again." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token." });
    }
    return res.status(401).json({ success: false, message: "Authentication failed." });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Admin access required." });
  }
  next();
};

const merchantOnly = (req, res, next) => {
  if (req.user?.role !== "merchant" && req.user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Merchant access required." });
  }
  next();
};

export { protect, adminOnly, merchantOnly };
