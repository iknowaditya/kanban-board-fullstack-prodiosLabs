import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";

// Get the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Task({ task, listId, setTasks }) {
  const [isLoading, setIsLoading] = useState(false);

  // DnD-kit setup for sortable tasks
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task._id,
      data: { taskId: task._id, listId },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Delete task handler
  const handleDelete = async () => {
    if (!confirm("Delete this task?")) return;

    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${task._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // Remove deleted task from state
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
      toast.success("Task deleted");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Failed to delete task");
    } finally {
      setIsLoading(false);
    }
  };

  // Set color based on priority
  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-400",
    low: "bg-green-500",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 mb-2 bg-white rounded-lg shadow-sm border-l-4 ${
        task.priority === "high"
          ? "border-red-500"
          : task.priority === "medium"
          ? "border-yellow-500"
          : "border-green-500"
      } hover:shadow-md transition`}
    >
      {/* Task Header: Title + Priority */}
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-800 flex-1">{task.title}</h3>
        <span
          className={`text-xs font-semibold text-white px-2 py-0.5 rounded ${
            priorityColors[task.priority || "low"]
          }`}
        >
          {task.priority || "low"}
        </span>
      </div>

      {/* Optional description */}
      {task.description && (
        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
      )}

      {/* Optional due date */}
      {task.dueDate && (
        <p className="text-xs text-gray-500 mt-1">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      {/* Actions: Only Delete Button */}
      <div className="flex gap-2 mt-2 justify-end">
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800"
          disabled={isLoading}
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default Task;
