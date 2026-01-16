const express = require("express");
const jwt = require("jsonwebtoken");
const Transaction = require("../models/Transaction");
const Ledger = require("../models/Ledger");

const router = express.Router();

// JWT middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// CREATE TRANSACTION
router.post("/send", auth, async (req, res) => {
  const { toMobile, amount } = req.body;
  if (!toMobile || !amount) return res.status(400).json({ message: "Invalid data" });

  const txId = "TXN" + Date.now() + Math.floor(Math.random() * 1000);

  const tx = await Transaction.create({
    txId,
    from: req.user.mobile,
    to: toMobile,
    amount,
    status: "SUCCESS"
  });

  await Ledger.create({ mobile: req.user.mobile, txId, debit: amount });
  await Ledger.create({ mobile: toMobile, txId, credit: amount });

  res.json({ message: "Transaction success", txId });
});

// TRANSACTION HISTORY
router.get("/history", auth, async (req, res) => {
  const txs = await Transaction.find({ from: req.user.mobile });
  res.json(txs);
});

module.exports = router;
