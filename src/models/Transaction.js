const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    txnId: { type: String, unique: true, index: true },

    from: { type: String, index: true }, // sender mobile
    to: { type: String, index: true },   // receiver mobile

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["INITIATED", "SUCCESS", "FAILED"],
      default: "SUCCESS"
    },

    type: {
      type: String,
      enum: ["P2P", "BANK", "UPI"],
      default: "P2P"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
