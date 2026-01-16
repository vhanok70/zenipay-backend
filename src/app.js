const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/transactions", require("./routes/transactions"));
app.use("/wallet", require("./routes/wallet"));
// Health check
app.get("/", (req, res) => {
  res.json({ status: "Zenipay backend running" });
});

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("DB error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Zenipay backend running on port ${PORT}`);
});
