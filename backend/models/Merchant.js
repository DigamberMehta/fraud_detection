import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Merchant name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Merchant email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      default: "merchant",
      immutable: true,
    },
    category: {
      type: String,
      required: [true, "Merchant category is required"],
      enum: [
        "E-commerce", "Grocery", "Electronics", "Travel", "Crypto",
        "Gambling", "Gaming", "Healthcare", "Finance", "Utilities",
        "Food & Dining", "Other",
      ],
    },
    country: {
      type: String,
      default: "India",
    },
    websiteUrl: {
      type: String,
      trim: true,
    },
    riskScore: {
      type: Number,
      default: 0.1,
      min: 0,
      max: 1,
    },
    totalFraudReports: {
      type: Number,
      default: 0,
    },
    totalTransactions: {
      type: Number,
      default: 0,
    },
    isCrossBorder: {
      type: Boolean,
      default: false,
    },
    isHighRiskCategory: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

merchantSchema.pre("save", function (next) {
  const highRiskCategories = ["Crypto", "Gambling", "Gaming"];
  this.isHighRiskCategory = highRiskCategories.includes(this.category);
  next();
});

export default mongoose.model("Merchant", merchantSchema);
