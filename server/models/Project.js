const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",      // reference to User model
      required: true,
    },
    // Later: members, status, etc.
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
