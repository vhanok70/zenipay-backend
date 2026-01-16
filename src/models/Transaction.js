const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true, index: true },
  referenceNo: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["UPI", "BANK", "WALLET"] },
  amount: Number,
  status: { type: String, enum: ["INITIATED", "OTP_PENDING", "SUCCESS", "FAILED"] },
  idempotencyKey: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
