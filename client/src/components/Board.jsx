import { useState, useEffect } from "react";
import axios from "axios";
import List from "./List";
import Loader from "./Loader";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { useSensors, useSensor, PointerSensor } from "@dnd-kit/core";
import { Plus } from "lucide-react";

// Get API base URL from .env file
const API_BASE = import.meta.env.VITE_API_BASE_URL;

function Board() {
  // State for storing board data
  const [boards, setBoards] = useState([]);

  // State to track loading status
  const [loading, setLoading] = useState(true);

  // Get stored access token
  const token = localStorage.getItem("accessToken");

  // Setup drag-and-drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // Fetch all boards from the backend
  const fetchBoards = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/boards`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // If no boards found, create a default one
      if (data.length === 0) {
        const { data: newBoard } = await axios.post(
          `${API_BASE}/boards`,
          { title: "My First Board" },
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setBoards([newBoard]);
      } else {
        setBoards(data);
      }
    } catch (err) {
      console.error("Error fetching boards:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch boards when component mounts
  useEffect(() => {
    if (token) fetchBoards();
  }, [token]);

  // Handle drag end event to reorder/move tasks
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const board = boards[0];

    const activeListId = active.data.current?.listId;
    const overListId = over.data.current?.listId;

    const activeList = board.lists.find((l) => l._id === activeListId);
    const overList = board.lists.find((l) => l._id === overListId);
    if (!activeList || !overList) return;

    const activeIndex = activeList.tasks.findIndex((t) => t._id === active.id);
    const overIndex = overList.tasks.findIndex((t) => t._id === over.id);

    const updatedBoards = [...boards];

    // Same list: reordering tasks
    if (activeListId === overListId) {
      activeList.tasks = arrayMove(activeList.tasks, activeIndex, overIndex);
    } else {
      // Different list: move task across lists
      const [movedTask] = activeList.tasks.splice(activeIndex, 1);
      overList.tasks.splice(overIndex, 0, movedTask);

      // Update task's listId in the backend
      try {
        await axios.put(
          `${API_BASE}/tasks/${movedTask._id}`,
          { listId: overListId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        console.error("Error moving task:", err);
      }
    }

    // Update board state
    setBoards(updatedBoards);
  };

  // Handle adding a new list to the board
  const addList = async () => {
    const title = prompt("Enter list title:");
    if (!title) return;

    try {
      const { data } = await axios.post(
        `${API_BASE}/boards/lists`,
        {
          boardId: boards[0]._id,
          title,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update board state with the new list
      setBoards((prev) =>
        prev.map((board) =>
          board._id === boards[0]._id
            ? { ...board, lists: [...board.lists, data] }
            : board
        )
      );
    } catch (err) {
      console.error("Error adding list:", err);
      alert("Failed to add list");
    }
  };

  // Show loader while fetching data
  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-6 min-h-screen bg-gray-100">
      {/* Header: Title + Add List Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">
          Your Kanban Board
        </h1>
        <button
          onClick={addList}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={18} /> Add List
        </button>
      </div>

      {/* If no boards exist */}
      {boards.length === 0 ? (
        <div className="text-center text-gray-500">No boards found.</div>
      ) : (
        // Drag-and-drop context
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {/* Render each list with its tasks */}
            {boards[0]?.lists?.map((list) => (
              <SortableContext
                key={list._id}
                items={list.tasks.map((t) => t._id)}
              >
                <List
                  list={list}
                  boardId={boards[0]._id}
                  setBoards={setBoards}
                />
              </SortableContext>
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}

export default Board;
