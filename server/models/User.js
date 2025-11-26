const mongoose = require("mongoose");

// 1) Define the structure (schema) for a User
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,       // name must be provided
      trim: true,           // removes extra spaces
    },
    email: {
      type: String,
      required: true,       // email must be provided
      unique: true,         // no two users with same email
      lowercase: true,      // convert to lowercase before saving
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,       // we must store hashed password
    },
  },
  {
    timestamps: true,       // automatically add createdAt & updatedAt
  }
);

// 2) Create a Model from the schema
const User = mongoose.model("User", userSchema);

// 3) Export the model so we can use it elsewhere
module.exports = User;
