const express = require("express");
const crypto = require("crypto");
const auth = require("../middleware/auth");
const Transaction = require("../models/Transaction");
const Ledger = require("../models/Ledger");

const router = express.Router();

/**
 * SEND MONEY
 * Protected route (JWT)
 */
router.post("/send", auth, async (req, res) => {
  try {
    const { toMobile, amount } = req.body;

    if (!toMobile || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const txnId =
      "ZP" +
      Date.now() +
      crypto.randomBytes(3).toString("hex").toUpperCase();

    const txn = await Transaction.create({
      txnId,
      from: req.user.mobile,
      to: toMobile,
      amount,
      status: "SUCCESS"
    });

    // Debit sender
    await Ledger.create({
      mobile: req.user.mobile,
      txnId,
      debit: amount
    });

    // Credit receiver
    await Ledger.create({
      mobile: toMobile,
      txnId,
      credit: amount
    });

    res.json({
      message: "Transaction successful",
      txnId,
      amount,
      to: toMobile
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Transaction failed" });
  }
});

/**
 * TRANSACTION HISTORY
 * Protected route (JWT)
 */
router.get("/history", auth, async (req, res) => {
  try {
    const txns = await Transaction.find({
      $or: [{ from: req.user.mobile }, { to: req.user.mobile }]
    }).sort({ createdAt: -1 });

    res.json(txns);
  } catch (err) {
    res.status(500).json({ message: "Unable to fetch history" });
  }
});

module.exports = router;
