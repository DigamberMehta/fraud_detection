import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    latitude: { type: Number },
    longitude: { type: Number },
    city: { type: String },
    country: { type: String },
  },
  { _id: false }
);

const cardDetailsSchema = new mongoose.Schema(
  {
    last4: { type: String, trim: true },
    cardBrand: {
      type: String,
      enum: ["Visa", "Mastercard", "RuPay", "Amex", "Diners", "Other"],
    },
    cardType: { type: String, enum: ["credit", "debit"] },
    bankName: { type: String, trim: true },
    isNewCard: { type: Boolean, default: false },
  },
  { _id: false }
);

const bankTransferDetailsSchema = new mongoose.Schema(
  {
    accountLast4: { type: String, trim: true },
    ifscCode: { type: String, trim: true, uppercase: true },
    bankName: { type: String, trim: true },
    transferType: {
      type: String,
      enum: ["NEFT", "RTGS", "IMPS"],
      default: "IMPS",
    },
  },
  { _id: false }
);

const upiDetailsSchema = new mongoose.Schema(
  {
    upiId: { type: String, trim: true, lowercase: true },
    upiApp: {
      type: String,
      enum: ["GPay", "PhonePe", "Paytm", "BHIM", "AmazonPay", "Other"],
      default: "Other",
    },
    isNewUpiId: { type: Boolean, default: false },
  },
  { _id: false }
);

const paymentMethodSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["card", "bank_transfer", "upi"],
      required: [true, "Payment method type is required"],
    },
    card: { type: cardDetailsSchema, default: null },
    bankTransfer: { type: bankTransferDetailsSchema, default: null },
    upi: { type: upiDetailsSchema, default: null },
  },
  { _id: false }
);

const fraudAnalysisSchema = new mongoose.Schema(
  {
    riskScore: { type: Number, default: 0 },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    fraudProbability: { type: Number, default: 0 },
    signals: {
      distanceScore: { type: Number, default: 0 },
      travelSpeedScore: { type: Number, default: 0 },
      amountSpikeScore: { type: Number, default: 0 },
      aboveAverageScore: { type: Number, default: 0 },
      highAbsoluteAmountScore: { type: Number, default: 0 },
      newDeviceScore: { type: Number, default: 0 },
      vpnScore: { type: Number, default: 0 },
      velocityScore: { type: Number, default: 0 },
      failedLoginScore: { type: Number, default: 0 },
      unusualTimeScore: { type: Number, default: 0 },
      internationalScore: { type: Number, default: 0 },
      newAccountScore: { type: Number, default: 0 },
      merchantRiskScore: { type: Number, default: 0 },
      sharedDeviceScore: { type: Number, default: 0 },
      countryChangeScore: { type: Number, default: 0 },
    },
    riskReasons: [{ type: String }],
    triggeredCombinations: [{ type: String }],
    geminiVerdict: { type: String, default: null },
    geminiConfidence: { type: Number, default: null },
    geminiExplanation: { type: String, default: null },
    recommendedAction: { type: String, default: null },
    source: { type: String, default: "local_only" },
  },
  { _id: false }
);

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    merchantId: { type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
    deviceId: { type: String, required: true },

    amount: { type: Number, required: [true, "Amount is required"], min: [0.01, "Amount must be positive"] },
    currency: { type: String, default: "INR" },
    paymentMethod: { type: paymentMethodSchema, required: [true, "Payment method is required"] },
    paymentChannel: {
      type: String,
      enum: ["mobile_app", "web", "api", "pos", "ussd"],
      default: "mobile_app",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "blocked"],
      default: "pending",
    },

    location: { type: locationSchema, required: true },

    distanceFromLastTxn: { type: Number, default: 0 },
    travelSpeed: { type: Number, default: 0 },
    isInternational: { type: Boolean, default: false },
    isNewLocation: { type: Boolean, default: false },

    amountDeviation: { type: Number, default: 0 },
    isAmountSpike: { type: Boolean, default: false },
    isHighAbsoluteAmount: { type: Boolean, default: false },

    transactionsLast5Min: { type: Number, default: 0 },
    transactionsLastHour: { type: Number, default: 0 },

    isNewDevice: { type: Boolean, default: false },
    isVPN: { type: Boolean, default: false },
    isSharedDevice: { type: Boolean, default: false },

    transactionHour: { type: Number },
    isUnusualTime: { type: Boolean, default: false },
    isNewMerchant: { type: Boolean, default: false },

    failedLoginsBefore: { type: Number, default: 0 },
    notificationsDisabled: { type: Boolean, default: false },
    recentPasswordChange: { type: Boolean, default: false },

    fraudAnalysis: { type: fraudAnalysisSchema, default: () => ({}) },
    isFlagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ isFlagged: 1 });
transactionSchema.index({ "fraudAnalysis.riskLevel": 1 });
transactionSchema.index({ "paymentMethod.type": 1 });

export default mongoose.model("Transaction", transactionSchema);
