const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", boardSchema);
