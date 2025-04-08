const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    list: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
