const mongoose = require("mongoose");
const Task = require("../models/Task");
const List = require("../models/List");

// Create a task
exports.createTask = async (req, res) => {
  const { listId, title, description, dueDate, priority } = req.body;

  if (!listId || !title) {
    return res.status(400).json({ message: "List ID and title are required" });
  }

  try {
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const task = new Task({
      list: listId,
      title,
      description,
      dueDate,
      priority,
    });

    await task.save();
    list.tasks.push(task._id);
    await list.save();

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// Update a task (can also change list)
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, dueDate, priority, listId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid Task ID" });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // If list has changed, update both lists
    if (listId && listId !== String(task.list)) {
      await List.findByIdAndUpdate(task.list, { $pull: { tasks: task._id } });
      await List.findByIdAndUpdate(listId, { $push: { tasks: task._id } });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.list = listId || task.list;

    await task.save();
    res.status(200).json(task);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ message: "Invalid Task ID" });
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    await List.findByIdAndUpdate(task.list, { $pull: { tasks: task._id } });
    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
