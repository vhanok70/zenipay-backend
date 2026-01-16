const mongoose = require("mongoose");

const LedgerSchema = new mongoose.Schema(
  {
    mobile: { type: String, index: true, required: true },
    txnId: { type: String, index: true, required: true },

    entryType: {
      type: String,
      enum: ["DEBIT", "CREDIT"],
      required: true
    },

    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },

    narration: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ledger", LedgerSchema);
