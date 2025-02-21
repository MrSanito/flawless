"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();
  const [task, setTask] = useState(""); // Input field state
  const [tasks, setTasks] = useState([]); // List of tasks

  // Fetch user-specific tasks when the user logs in
  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  async function fetchTasks() {
    try {
      const { data } = await axios.get(`/api/tasks?userId=${user.id}`);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  async function addTask() {
    if (task.trim() === "") return;
    try {
      const { data } = await axios.post("/api/tasks", {
        text: task,
        userId: user.id,
      });
      setTasks([...tasks, data]);
      setTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  }

  async function toggleComplete(id) {
    try {
      const { data } = await axios.put("/api/tasks", { id });
      setTasks(tasks.map((task) => (task._id === id ? data : task)));
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  async function deleteTask(id) {
    try {
      await axios.delete("/api/tasks", { data: { id } });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
        <h1 className="text-2xl font-bold text-indigo-600 mb-4">To-Do List</h1>

        {!user ? (
          <p className="text-gray-600">Please sign in to manage tasks.</p>
        ) : (
          <>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter your task..."
            />

            <button
              onClick={addTask}
              className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition"
            >
              Add Task
            </button>

            <ul className="mt-4 space-y-2">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className={`flex justify-between items-center p-3 border rounded-md ${
                    task.completed ? "bg-green-200" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`flex-1 text-left ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-black"
                    }`}
                  >
                    {task.text}
                  </span>

                  <button
                    onClick={() => toggleComplete(task._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                  >
                    ✅
                  </button>

                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
