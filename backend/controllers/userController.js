import User from "../models/User.js";
import { getRedisClient, KEYS } from "../config/redis.js";
import { invalidateCache } from "../middleware/cache.js";

// GET /api/users — Admin only
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: { users } });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/:id — Admin only
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/:id/lock — Admin only
export const lockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isLocked: true }, { new: true }).select("-passwordHash");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const redis = getRedisClient();
    await redis.del(KEYS.session(req.params.id)).catch(() => {});
    await redis.del(KEYS.userProfile(req.params.id)).catch(() => {});

    res.status(200).json({ success: true, message: "User account locked.", data: { user } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/:id/unlock — Admin only
export const unlockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isLocked: false, failedLoginAttempts: 0 },
      { new: true }
    ).select("-passwordHash");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const redis = getRedisClient();
    await redis.del(KEYS.session(req.params.id)).catch(() => {});
    await redis.del(KEYS.userProfile(req.params.id)).catch(() => {});

    res.status(200).json({ success: true, message: "User account unlocked.", data: { user } });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/me/profile
export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/:id/balance — Admin only
export const updateBalance = async (req, res, next) => {
  try {
    const { amount, operation } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Amount must be a positive number." });
    }
    if (!["credit", "debit"].includes(operation)) {
      return res.status(400).json({ success: false, message: "operation must be 'credit' or 'debit'." });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    if (operation === "debit" && user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "User has insufficient balance for this debit.",
        data: { availableBalance: user.balance },
      });
    }

    const delta = operation === "credit" ? amount : -amount;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { balance: delta } },
      { new: true }
    ).select("-passwordHash");

    const redis = getRedisClient();
    await redis.del(KEYS.session(req.params.id)).catch(() => {});
    await redis.del(KEYS.userProfile(req.params.id)).catch(() => {});

    res.status(200).json({
      success: true,
      message: `Balance ${operation}ed by ₹${amount}.`,
      data: { balance: updated.balance, user: updated },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/users/me/profile
export const updateMyProfile = async (req, res, next) => {
  try {
    const allowed = ["name", "phone", "notificationsEnabled"];
    const updates = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (req.body.password) {
      return res.status(400).json({ success: false, message: "Use /change-password to update password." });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-passwordHash");

    const redis = getRedisClient();
    await redis.del(KEYS.session(req.user._id.toString())).catch(() => {});
    await redis.del(KEYS.userProfile(req.user._id.toString())).catch(() => {});

    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    next(err);
  }
};
