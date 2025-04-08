const mongoose = require("mongoose");
const List = require("../models/List");
const Board = require("../models/Board");
const Task = require("../models/Task"); // Optional: if you want to delete related tasks too

// Create a new list in a board
const createList = async (req, res) => {
  const { boardId, title } = req.body;

  if (!boardId || !title) {
    return res.status(400).json({ message: "Board ID and title are required" });
  }

  try {
    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const newList = new List({ title, board: boardId });
    await newList.save();

    board.lists.push(newList._id);
    await board.save();

    res.status(201).json(newList);
  } catch (err) {
    console.error("Error creating list:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all lists (you can later filter by boardId if needed)
const getLists = async (req, res) => {
  try {
    const lists = await List.find({}).populate("tasks");
    res.status(200).json(lists);
  } catch (err) {
    console.error("Error fetching lists:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a list and remove it from the board
const deleteList = async (req, res) => {
  const { listId } = req.params;

  // Check if valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(listId)) {
    return res.status(400).json({ message: "Invalid list ID" });
  }

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Remove list reference from the board
    await Board.findByIdAndUpdate(list.board, {
      $pull: { lists: list._id },
    });

    // Optionally delete all related tasks too
    await Task.deleteMany({ listId: list._id });

    // Delete the list
    await list.deleteOne();

    res.status(200).json({ message: "List deleted successfully" });
  } catch (err) {
    console.error("Error deleting list:", err);
    res.status(500).json({ message: "Server error while deleting list" });
  }
};

module.exports = {
  createList,
  getLists,
  deleteList,
};
