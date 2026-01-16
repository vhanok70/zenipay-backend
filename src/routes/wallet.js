const express = require("express");
const auth = require("../middleware/auth");
const Ledger = require("../models/Ledger");

const router = express.Router();

router.get("/balance", auth, async (req, res) => {
  const credits = await Ledger.aggregate([
    { $match: { mobile: req.user.mobile } },
    {
      $group: {
        _id: null,
        credit: { $sum: "$credit" },
        debit: { $sum: "$debit" }
      }
    }
  ]);

  const credit = credits[0]?.credit || 0;
  const debit = credits[0]?.debit || 0;

  res.json({ balance: credit - debit });
});

module.exports = router;
