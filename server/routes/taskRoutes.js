const express = require("express");
const router = express.Router();
const {
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createTask);
router.put("/:taskId", authMiddleware, updateTask);
router.delete("/:taskId", authMiddleware, deleteTask);

module.exports = router;
