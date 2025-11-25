// 1) Bring in (import) the tools we need
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// 2) Load variables from .env file (if any)
dotenv.config();

// 3) Create the express app
const app = express();

// 4) Middlewares - like helpers that run before your main logic
app.use(cors());            // Allow requests from frontend
app.use(express.json());   // Let server understand JSON body

// 5) Simple test route - to check server is alive
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// 6) Decide which port to use
const PORT = process.env.PORT || 5000;

// 7) Start the server (start listening)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
