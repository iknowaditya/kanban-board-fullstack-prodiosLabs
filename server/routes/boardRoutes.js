const express = require("express");
const router = express.Router();
const { createBoard, getBoards } = require("../controllers/boardController");
const authMiddleware = require("../middleware/authMiddleware");
const List = require("../models/List"); // Import List model
const Board = require("../models/Board"); // Import Board model

router.post("/", authMiddleware, createBoard);
router.get("/", authMiddleware, getBoards);

router.post("/lists", authMiddleware, async (req, res) => {
  const { boardId, title } = req.body;
  try {
    // Verify the board exists and belongs to the user
    const board = await Board.findOne({ _id: boardId, user: req.user._id });
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    // Create the list
    const list = await List.create({ board: boardId, title });
    await Board.findByIdAndUpdate(boardId, { $push: { lists: list._id } });

    res.status(201).json(list);
  } catch (err) {
    console.error("Create List Error:", err);
    res.status(500).json({ message: "Failed to create list" });
  }
});

module.exports = router;
