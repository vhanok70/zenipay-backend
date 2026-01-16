const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Otp = require("../models/Otp");

const router = express.Router();

// helper
function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

// SEND OTP
router.post("/send-otp", async (req, res) => {
  const { mobile, purpose = "LOGIN" } = req.body;
  if (!mobile) return res.status(400).json({ message: "Mobile required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = hashOtp(otp);

  await Otp.deleteMany({ mobile, purpose });
  await Otp.create({
    mobile,
    otpHash,
    purpose,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  // TODO: integrate SMS gateway here
  console.log("OTP (dev only):", otp);

  res.json({ message: "OTP sent" });
});

// VERIFY OTP → ISSUE JWT
router.post("/verify-otp", async (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) return res.status(400).json({ message: "Invalid request" });

  const record = await Otp.findOne({ mobile, purpose: "LOGIN" });
  if (!record || record.expiresAt < new Date())
    return res.status(400).json({ message: "OTP expired" });

  if (hashOtp(otp) !== record.otpHash)
    return res.status(400).json({ message: "Wrong OTP" });

  let user = await User.findOne({ mobile });
  if (!user) user = await User.create({ mobile });

  await Otp.deleteMany({ mobile, purpose: "LOGIN" });

  const token = jwt.sign(
    { userId: user._id, mobile: user.mobile },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user });
});

module.exports = router;
