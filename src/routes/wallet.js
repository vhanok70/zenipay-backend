const express = require("express");
const auth = require("../middleware/auth");
const Ledger = require("../models/Ledger");

const router = express.Router();

router.get("/balance", auth, async (req, res) => {
  const mobile = req.user.mobile;

  const credits = await Ledger.aggregate([
    { $match: { mobile } },
    {
      $group: {
        _id: null,
        credit: { $sum: "$credit" },
        debit: { $sum: "$debit" }
      }
    }
  ]);

  const balance =
    credits.length === 0
      ? 0
      : (credits[0].credit || 0) - (credits[0].debit || 0);

  res.json({ balance });
});

module.exports = router;
