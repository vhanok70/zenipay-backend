const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    mobile: { type: String, unique: true, index: true, required: true },
    name: String,
    email: String,

    kycStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING"
    },

    walletBalance: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
