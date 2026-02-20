import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
      unique: true,
    },
    browser: { type: String, trim: true },
    os: { type: String, trim: true },
    deviceType: {
      type: String,
      enum: ["mobile", "tablet", "desktop", "unknown"],
      default: "unknown",
    },
    userAgent: { type: String, trim: true },
    ipAddress: { type: String, trim: true },
    isVPN: { type: Boolean, default: false },
    isProxy: { type: Boolean, default: false },
    isTor: { type: Boolean, default: false },
    isp: { type: String, trim: true },
    country: { type: String, trim: true },
    linkedUserIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isSharedDevice: { type: Boolean, default: false },
    lastUsedAt: { type: Date, default: Date.now },
    isTrusted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

deviceSchema.pre("save", function (next) {
  this.isSharedDevice = this.linkedUserIds.length > 1;
  next();
});

export default mongoose.model("Device", deviceSchema);
