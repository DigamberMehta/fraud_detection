import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Merchant from "../models/Merchant.js";
import { getRedisClient, KEYS } from "../config/redis.js";

const signToken = (id, role) => {
  const jti = randomUUID();
  const token = jwt.sign({ id, role, jti }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return { token, jti };
};

const sendToken = async (user, statusCode, res) => {
  const { token } = signToken(user._id, user.role);
  const redis = getRedisClient();

  await redis
    .setex(KEYS.session(user._id), 7 * 24 * 3600, JSON.stringify(user.toObject ? user.toObject() : user))
    .catch(() => {});

  res.status(statusCode).json({ success: true, token, data: { user } });
};

// POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: password,
      role: role === "admin" ? "admin" : "user",
      phone,
    });

    user.passwordHash = undefined;
    await sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }
    if (user.isLocked) {
      return res.status(403).json({ success: false, message: "Account locked. Contact support." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.recordFailedLogin();
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
        remainingAttempts: Math.max(0, 5 - user.failedLoginAttempts - 1),
      });
    }

    await user.resetFailedLogins();
    user.passwordHash = undefined;
    await sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
export const logout = async (req, res, next) => {
  try {
    const token = req.token;
    const redis = getRedisClient();

    const decoded = jwt.decode(token);
    const ttl = decoded?.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 7 * 24 * 3600;

    await redis.setex(KEYS.blacklist(token), Math.max(ttl, 1), "revoked");
    await redis.del(KEYS.session(req.user._id)).catch(() => {});

    res.status(200).json({ success: true, message: "Logged out successfully." });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/merchant/register
export const merchantRegister = async (req, res, next) => {
  try {
    const { name, email, password, category, country, websiteUrl } = req.body;

    if (!name || !email || !password || !category) {
      return res.status(400).json({ success: false, message: "Name, email, password, and category are required." });
    }

    const existing = await Merchant.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Merchant email already registered." });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const merchant = await Merchant.create({ name, email, passwordHash, category, country, websiteUrl });
    merchant.passwordHash = undefined;
    res.status(201).json({ success: true, data: { merchant } });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const redis = getRedisClient();
    const cacheKey = KEYS.userProfile(req.user._id);

    const cached = await redis.get(cacheKey).catch(() => null);
    if (cached) {
      return res.status(200).json({ success: true, data: { user: JSON.parse(cached) } });
    }

    const user = await User.findById(req.user._id);
    await redis.setex(cacheKey, 300, JSON.stringify(user)).catch(() => {});
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/change-password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both current and new password are required." });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "New password must be at least 8 characters." });
    }

    const user = await User.findById(req.user._id).select("+passwordHash");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect." });
    }

    user.passwordHash = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    const redis = getRedisClient();
    await redis.del(KEYS.session(req.user._id)).catch(() => {});
    await redis.del(KEYS.userProfile(req.user._id)).catch(() => {});

    user.passwordHash = undefined;
    await sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
