const mongoose = require("mongoose");

const LedgerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  transactionId: { type: String, index: true },
  entryType: { type: String, enum: ["DEBIT", "CREDIT"] },
  amount: Number,
  balanceAfter: Number,
  narration: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Ledger", LedgerSchema);
