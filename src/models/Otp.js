const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  mobile: { type: String, index: true },
  otpHash: String,
  purpose: { type: String, enum: ["LOGIN", "TRANSACTION"] },
  expiresAt: Date,
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Otp", OtpSchema);
