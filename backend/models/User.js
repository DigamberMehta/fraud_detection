import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const locationSchema = new mongoose.Schema(
  {
    latitude: { type: Number },
    longitude: { type: Number },
    city: { type: String },
    country: { type: String, default: "India" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
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
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      trim: true,
    },

    // --- Wallet / Balance ---
    balance: {
      type: Number,
      default: 0,
      min: [0, "Balance cannot be negative"],
    },
    currency: {
      type: String,
      default: "INR",
    },

    // --- Fraud Detection Baseline Fields ---
    averageTransactionAmount: {
      type: Number,
      default: 0,
    },
    totalTransactions: {
      type: Number,
      default: 0,
    },
    usualTransactionHour: {
      type: Number,
      default: null,
    },
    lastLocation: {
      type: locationSchema,
      default: null,
    },
    lastTransactionAt: {
      type: Date,
      default: null,
    },
    knownDevices: [{ type: String }],
    knownCountries: [{ type: String }],
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lastFailedLoginAt: {
      type: Date,
      default: null,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    accountAgeDays: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

userSchema.pre("save", function (next) {
  if (this.createdAt) {
    const diffMs = Date.now() - new Date(this.createdAt).getTime();
    this.accountAgeDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.recordFailedLogin = async function () {
  this.failedLoginAttempts += 1;
  this.lastFailedLoginAt = new Date();
  if (this.failedLoginAttempts >= 5) this.isLocked = true;
  await this.save();
};

userSchema.methods.resetFailedLogins = async function () {
  this.failedLoginAttempts = 0;
  this.isLocked = false;
  await this.save();
};

export default mongoose.model("User", userSchema);
