const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("./models/User");

dotenv.config();

const app = express();

app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Let server understand JSON body

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// TEMPORARY: test route to create a user
app.get("/api/test-create-user", async (req, res) => {
  try {
    const user = await User.create({
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      passwordHash: "fakehash123", // later we will use real hash
    });

    res.json({ message: "User created", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
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
