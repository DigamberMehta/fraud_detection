import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Merchant from "../models/Merchant.js";
import Device from "../models/Device.js";
import FraudLog from "../models/FraudLog.js";
import { analyzeFraud, computeTransactionFlags } from "../utils/fraudAnalysis.js";
import { analyzeWithGemini } from "../services/geminiService.js";
import { getRedisClient, KEYS } from "../config/redis.js";
import { invalidateCache } from "../middleware/cache.js";

const mergeAnalysis = (localAnalysis, geminiAnalysis) => {
  if (!geminiAnalysis) return { ...localAnalysis, source: "local_only" };

  const blendedScore = Math.round(
    geminiAnalysis.riskScore * 0.6 + localAnalysis.riskScore * 0.4
  );
  const finalScore = Math.max(blendedScore, localAnalysis.riskScore);

  let riskLevel = "low";
  if (finalScore >= 75) riskLevel = "critical";
  else if (finalScore >= 50) riskLevel = "high";
  else if (finalScore >= 25) riskLevel = "medium";

  const mergedSignals = { ...(localAnalysis.signals || {}), ...(geminiAnalysis.topSignals || {}) };

  const riskReasons = [...new Set([...(localAnalysis.riskReasons || []), ...(geminiAnalysis.riskReasons || [])])];
  const triggeredCombinations = [...new Set([...(localAnalysis.triggeredCombinations || []), ...(geminiAnalysis.triggeredCombinations || [])])];

  return {
    riskScore: finalScore,
    riskLevel,
    fraudProbability: parseFloat((finalScore / 100).toFixed(2)),
    signals: mergedSignals,
    riskReasons,
    triggeredCombinations,
    geminiVerdict: geminiAnalysis.verdict || null,
    geminiConfidence: geminiAnalysis.confidence || null,
    geminiExplanation: geminiAnalysis.explanation || null,
    recommendedAction: geminiAnalysis.recommendedAction || null,
    source: geminiAnalysis.source === "gemini_cached" ? "gemini_cached+local" : "gemini+local",
  };
};

// POST /api/transactions
export const createTransaction = async (req, res, next) => {
  try {
    const { merchantId, deviceId, amount, currency, paymentMethod, paymentChannel, location, isInternational } = req.body;

    const validTypes = ["card", "bank_transfer", "upi"];
    if (!paymentMethod || !validTypes.includes(paymentMethod.type)) {
      return res.status(400).json({ success: false, message: `paymentMethod.type must be one of: ${validTypes.join(", ")}` });
    }
    if (paymentMethod.type === "card" && !paymentMethod.card?.last4) {
      return res.status(400).json({ success: false, message: "Card details (last4) are required for card payments." });
    }
    if (paymentMethod.type === "upi" && !paymentMethod.upi?.upiId) {
      return res.status(400).json({ success: false, message: "UPI ID is required for UPI payments." });
    }
    if (paymentMethod.type === "bank_transfer" && (!paymentMethod.bankTransfer?.ifscCode || !paymentMethod.bankTransfer?.accountLast4)) {
      return res.status(400).json({ success: false, message: "IFSC code and account last 4 digits are required for bank transfers." });
    }

    const userId = req.user._id;

    const [user, merchant, device, lastTxn] = await Promise.all([
      User.findById(userId),
      Merchant.findById(merchantId),
      Device.findOne({ deviceId }),
      Transaction.findOne({ userId }).sort({ createdAt: -1 }),
    ]);

    if (!merchant) return res.status(404).json({ success: false, message: "Merchant not found." });
    if (!merchant.isActive) return res.status(400).json({ success: false, message: "Merchant is inactive." });

    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance.",
        data: { availableBalance: user.balance, required: amount },
      });
    }

    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentTxnCount = await Transaction.countDocuments({ userId, createdAt: { $gte: fiveMinAgo } });

    const txnData = { amount, currency, deviceId, location, isInternational, paymentMethod, paymentChannel };

    const flags = computeTransactionFlags({ txnData, user, device, recentTxnCount, lastTxn });
    const localAnalysis = analyzeFraud({ txnData, user, device, merchant, recentTxnCount, lastTxn });
    const geminiAnalysis = await analyzeWithGemini({ txnData, user, device, merchant, recentTxnCount, lastTxn, flags });
    const fraudAnalysis = mergeAnalysis(localAnalysis, geminiAnalysis);

    const isFlagged = fraudAnalysis.riskScore >= 50;

    let status = "completed";
    if (fraudAnalysis.riskScore >= 75) status = "blocked";
    else if (fraudAnalysis.recommendedAction === "block_and_alert") status = "blocked";
    else if (fraudAnalysis.recommendedAction === "block_and_lock_account") status = "blocked";
    else if (fraudAnalysis.riskScore >= 50 && fraudAnalysis.geminiVerdict === "block") status = "blocked";

    const transaction = await Transaction.create({
      userId,
      merchantId,
      deviceId,
      amount,
      currency: currency || "INR",
      paymentMethod,
      paymentChannel: paymentChannel || "mobile_app",
      status,
      location,
      isInternational: isInternational || false,
      isNewMerchant: !(await Transaction.exists({ userId, merchantId })),
      ...flags,
      fraudAnalysis,
      isFlagged,
    });

    if (isFlagged) {
      let actionTaken = "alerted_user";
      if (status === "blocked") actionTaken = "blocked";
      if (fraudAnalysis.recommendedAction === "block_and_lock_account") actionTaken = "account_locked";

      await FraudLog.create({
        transactionId: transaction._id,
        userId,
        merchantId,
        riskScore: fraudAnalysis.riskScore,
        riskLevel: fraudAnalysis.riskLevel,
        riskReasons: fraudAnalysis.riskReasons,
        actionTaken,
      });

      // Only auto-lock at CRITICAL risk (≥80) to prevent false positives
      if (fraudAnalysis.riskScore >= 80 && fraudAnalysis.recommendedAction === "block_and_lock_account") {
        await User.findByIdAndUpdate(userId, { isLocked: true });
        const redis = getRedisClient();
        await redis.del(KEYS.session(userId.toString())).catch(() => {});
      }
    }

    const newTotal = user.totalTransactions + 1;
    const newAvg = (user.averageTransactionAmount * user.totalTransactions + amount) / newTotal;
    const balanceUpdate = status !== "blocked" ? { $inc: { balance: -amount } } : {};

    await User.findByIdAndUpdate(userId, {
      ...balanceUpdate,
      lastLocation: location,
      lastTransactionAt: new Date(),
      totalTransactions: newTotal,
      averageTransactionAmount: Math.round(newAvg),
      usualTransactionHour: flags.transactionHour,
      $addToSet: { knownDevices: deviceId, knownCountries: location?.country },
    });

    const redis = getRedisClient();
    await redis.del(KEYS.session(userId.toString())).catch(() => {});
    await redis.del(KEYS.userProfile(userId.toString())).catch(() => {});

    const merchantUpdate = { $inc: { totalTransactions: 1 } };
    if (isFlagged) merchantUpdate.$inc.totalFraudReports = 1;
    await Merchant.findByIdAndUpdate(merchantId, merchantUpdate);

    await invalidateCache("stats:*");

    res.status(201).json({
      success: true,
      data: {
        transaction,
        alert: isFlagged
          ? {
              message: `Transaction flagged — Risk Level: ${fraudAnalysis.riskLevel.toUpperCase()}`,
              reasons: fraudAnalysis.riskReasons,
              aiExplanation: fraudAnalysis.geminiExplanation || null,
            }
          : null,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/transactions/my
export const getMyTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .populate("merchantId", "name category")
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json({ success: true, count: transactions.length, data: { transactions } });
  } catch (err) {
    next(err);
  }
};

// GET /api/transactions/all — Admin only
export const getAllTransactions = async (req, res, next) => {
  try {
    const { flagged, riskLevel, paymentMethod, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (flagged === "true") filter.isFlagged = true;
    if (riskLevel) filter["fraudAnalysis.riskLevel"] = riskLevel;
    if (paymentMethod) filter["paymentMethod.type"] = paymentMethod;

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .populate("userId", "name email")
        .populate("merchantId", "name category")
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit)),
      Transaction.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, total, count: transactions.length, data: { transactions } });
  } catch (err) {
    next(err);
  }
};

// GET /api/transactions/:id
export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("userId", "name email")
      .populate("merchantId", "name category country");

    if (!transaction) return res.status(404).json({ success: false, message: "Transaction not found." });

    if (req.user.role !== "admin" && transaction.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    res.status(200).json({ success: true, data: { transaction } });
  } catch (err) {
    next(err);
  }
};

// GET /api/transactions/stats — Admin
export const getStats = async (req, res, next) => {
  try {
    const [total, flagged, critical, high, blocked, byPaymentMethod] = await Promise.all([
      Transaction.countDocuments(),
      Transaction.countDocuments({ isFlagged: true }),
      Transaction.countDocuments({ "fraudAnalysis.riskLevel": "critical" }),
      Transaction.countDocuments({ "fraudAnalysis.riskLevel": "high" }),
      Transaction.countDocuments({ status: "blocked" }),
      Transaction.aggregate([
        { $group: { _id: "$paymentMethod.type", count: { $sum: 1 }, flagged: { $sum: { $cond: ["$isFlagged", 1, 0] } } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total, flagged, critical, high, blocked,
        flaggedRate: total > 0 ? ((flagged / total) * 100).toFixed(2) + "%" : "0%",
        byPaymentMethod,
      },
    });
  } catch (err) {
    next(err);
  }
};
