import mongoose from "mongoose";

const fraudLogSchema = new mongoose.Schema(
  {
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },

    status: {
      type: String,
      enum: ["flagged", "under_review", "confirmed_fraud", "false_positive", "resolved"],
      default: "flagged",
    },

    riskScore: { type: Number, required: true },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
    },
    riskReasons: [{ type: String }],

    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
    notes: { type: String, trim: true },

    actionTaken: {
      type: String,
      enum: ["none", "blocked", "alerted_user", "account_locked", "manual_review"],
      default: "none",
    },
  },
  { timestamps: true }
);

fraudLogSchema.index({ status: 1 });
fraudLogSchema.index({ userId: 1 });
fraudLogSchema.index({ transactionId: 1 });

export default mongoose.model("FraudLog", fraudLogSchema);
