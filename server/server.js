const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");


dotenv.config();

const app = express();

// ✅ CORS: only allow your frontend origin
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
    credentials: false, // you're using Bearer token, not cookies
  })
);


// Body parsing
app.use(express.json()); 

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// THIS IS THE ONE THAT MAKES RENDER HAPPY
app.get("/", (req, res) => {
  res.status(200).send("MERN Project Manager API is live!");
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
