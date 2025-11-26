const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Let server understand JSON body
app.use("/api/auth", authRoutes);


app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});


const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🟢 Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("🔴 Failed to connect MongoDB", err);
  });
