import { useState } from "react";
import Task from "./Task";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function List({ list, boardId, setBoards }) {
  const [isAdding, setIsAdding] = useState(false);
  const token = localStorage.getItem("accessToken");

  const addTask = async () => {
    const title = prompt("Enter task title:");
    if (!title) return;

    setIsAdding(true);
    const tempId = `temp-${Date.now()}`;

    // Optimistic UI update
    setBoards((prev) =>
      prev.map((board) =>
        board._id === boardId
          ? {
              ...board,
              lists: board.lists.map((l) =>
                l._id === list._id
                  ? { ...l, tasks: [...l.tasks, { _id: tempId, title }] }
                  : l
              ),
            }
          : board
      )
    );

    try {
      const { data } = await axios.post(
        `${API_BASE}/tasks`,
        { listId: list._id, title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Replace temp task with server response
      setBoards((prev) =>
        prev.map((board) =>
          board._id === boardId
            ? {
                ...board,
                lists: board.lists.map((l) =>
                  l._id === list._id
                    ? {
                        ...l,
                        tasks: l.tasks.map((t) =>
                          t._id === tempId ? data : t
                        ),
                      }
                    : l
                ),
              }
            : board
        )
      );
    } catch (err) {
      toast.error("Failed to add task.");
      // Rollback
      setBoards((prev) =>
        prev.map((board) =>
          board._id === boardId
            ? {
                ...board,
                lists: board.lists.map((l) =>
                  l._id === list._id
                    ? {
                        ...l,
                        tasks: l.tasks.filter((t) => t._id !== tempId),
                      }
                    : l
                ),
              }
            : board
        )
      );
    } finally {
      setIsAdding(false);
    }
  };

  const deleteList = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this list?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_BASE}/lists/${list._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBoards((prev) =>
        prev.map((board) =>
          board._id === boardId
            ? {
                ...board,
                lists: board.lists.filter((l) => l._id !== list._id),
              }
            : board
        )
      );

      toast.success("List deleted!");
    } catch (err) {
      toast.error("Failed to delete list.");
      console.error("Delete list error:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-72 flex-shrink-0">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">{list.title}</h2>
        <button
          onClick={deleteList}
          className="text-red-500 hover:text-red-700"
        >
          <FiTrash2 />
        </button>
      </div>

      <SortableContext
        items={list.tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {list.tasks.map((task) => (
            <Task
              key={task._id}
              task={task}
              listId={list._id}
              setTasks={(newTasks) =>
                setBoards((prev) =>
                  prev.map((board) =>
                    board._id === boardId
                      ? {
                          ...board,
                          lists: board.lists.map((l) =>
                            l._id === list._id
                              ? { ...l, tasks: newTasks(l.tasks) }
                              : l
                          ),
                        }
                      : board
                  )
                )
              }
            />
          ))}
        </div>
      </SortableContext>

      <button
        onClick={addTask}
        disabled={isAdding}
        className={`mt-3 w-full flex items-center justify-center gap-2 p-2 rounded-lg transition ${
          isAdding
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
        }`}
      >
        <FiPlus />
        {isAdding ? "Adding..." : "Add Task"}
      </button>
    </div>
  );
}

export default List;
