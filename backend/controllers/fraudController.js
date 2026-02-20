import FraudLog from "../models/FraudLog.js";
import Transaction from "../models/Transaction.js";
import { invalidateCache } from "../middleware/cache.js";

// GET /api/fraud — Admin
export const getAllFraudLogs = async (req, res, next) => {
  try {
    const { status, riskLevel, limit = 50, page = 1 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (riskLevel) filter.riskLevel = riskLevel;

    const [logs, total] = await Promise.all([
      FraudLog.find(filter)
        .populate("userId", "name email")
        .populate("merchantId", "name category")
        .populate("transactionId", "amount currency createdAt")
        .populate("reviewedBy", "name email")
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit)),
      FraudLog.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, total, count: logs.length, data: { logs } });
  } catch (err) {
    next(err);
  }
};

// GET /api/fraud/:id — Admin
export const getFraudLogById = async (req, res, next) => {
  try {
    const log = await FraudLog.findById(req.params.id)
      .populate("userId", "name email phone averageTransactionAmount accountAgeDays")
      .populate("merchantId", "name category riskScore totalFraudReports")
      .populate("transactionId")
      .populate("reviewedBy", "name email");

    if (!log) return res.status(404).json({ success: false, message: "Fraud log not found." });
    res.status(200).json({ success: true, data: { log } });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/fraud/:id/review — Admin
export const reviewFraudLog = async (req, res, next) => {
  try {
    const { status, notes, actionTaken } = req.body;

    const validStatuses = ["under_review", "confirmed_fraud", "false_positive", "resolved"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const log = await FraudLog.findByIdAndUpdate(
      req.params.id,
      {
        status,
        notes,
        actionTaken: actionTaken || "manual_review",
        reviewedBy: req.user._id,
        reviewedAt: new Date(),
      },
      { new: true }
    ).populate("userId", "name email").populate("transactionId", "amount");

    if (!log) return res.status(404).json({ success: false, message: "Fraud log not found." });

    if (status === "confirmed_fraud") {
      await Transaction.findByIdAndUpdate(log.transactionId, { status: "blocked" });
    }

    await invalidateCache("stats:*");

    res.status(200).json({ success: true, data: { log } });
  } catch (err) {
    next(err);
  }
};

// GET /api/fraud/stats — Admin
export const getFraudStats = async (req, res, next) => {
  try {
    const [total, flagged, confirmed, falsePositive, underReview, byRiskLevel] = await Promise.all([
      FraudLog.countDocuments(),
      FraudLog.countDocuments({ status: "flagged" }),
      FraudLog.countDocuments({ status: "confirmed_fraud" }),
      FraudLog.countDocuments({ status: "false_positive" }),
      FraudLog.countDocuments({ status: "under_review" }),
      FraudLog.aggregate([{ $group: { _id: "$riskLevel", count: { $sum: 1 } } }]),
    ]);

    res.status(200).json({
      success: true,
      data: { total, flagged, confirmed, falsePositive, underReview, byRiskLevel },
    });
  } catch (err) {
    next(err);
  }
};
