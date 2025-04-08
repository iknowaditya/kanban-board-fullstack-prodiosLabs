const Board = require("../models/Board");
const List = require("../models/List");

// Controller: Create a new board with default lists
exports.createBoard = async (req, res) => {
  const { title } = req.body;

  try {
    // Create a new board and associate it with the authenticated user
    const board = await Board.create({ user: req.user._id, title });

    // Automatically create default lists for the new board
    await List.insertMany([
      { board: board._id, title: "To Do" },
      { board: board._id, title: "In Progress" },
      { board: board._id, title: "Done" },
    ]);

    // Respond with the created board
    res.status(201).json(board);
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: "Failed to create board" });
  }
};

// Controller: Get all boards for the logged-in user
exports.getBoards = async (req, res) => {
  try {
    // Find all boards for the user and populate lists and their tasks
    const boards = await Board.find({ user: req.user._id }).populate({
      path: "lists",
      populate: { path: "tasks" }, // Populate tasks within each list
    });

    // Send all boards back to the client
    res.status(200).json(boards);
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: "Failed to fetch boards" });
  }
};

// Controller: Update board title by board ID
exports.updateBoard = async (req, res) => {
  const { title } = req.body;

  try {
    // Find board by ID and update its title
    const board = await Board.findByIdAndUpdate(req.params.id, { title });

    // Respond with the updated board
    res.status(200).json(board);
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: "Failed to update board" });
  }
};

// Controller: Delete a board by ID
exports.deleteBoard = async (req, res) => {
  try {
    // Find board by ID and delete it
    await Board.findByIdAndDelete(req.params.id);

    // Respond with success message
    res.status(200).json({ message: "Board deleted successfully" });
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: "Failed to delete board" });
  }
};

// Controller: Get a single board by ID with populated lists and tasks
exports.getBoard = async (req, res) => {
  try {
    // Find board by ID and populate its lists and nested tasks
    const board = await Board.findById(req.params.id).populate({
      path: "lists",
      populate: { path: "tasks" }, // Populate tasks for each list
    });

    // Respond with the board data
    res.status(200).json(board);
  } catch (err) {
    // Handle server error
    res.status(500).json({ message: "Failed to fetch board" });
  }
};
