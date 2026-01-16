const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema(
  {
    mobile: { type: String, index: true, required: true },
    otpHash: { type: String, required: true },

    purpose: {
      type: String,
      enum: ["LOGIN", "TRANSACTION"],
      required: true
    },

    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Auto delete expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("Otp", OtpSchema);
