import React, { useState } from "react";
import "../ToDo.css";
import "bootstrap/dist/css/bootstrap.min.css";

function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [category, setCategory] = useState("");
  const [newSubtask, setNewSubtask] = useState({}); // Store subtasks input for each task

  const addTask = (e) => {
    e.preventDefault();
    if (description.trim() === "") return;

    const newTask = {
      id: Date.now(),
      description,
      dueDate,
      priority,
      category,
      completed: false,
      subtasks: [],
    };

    setTasks([...tasks, newTask]);
    setDescription("");
    setDueDate("");
    setPriority("Low");
    setCategory("");
  };

  const updateTask = (updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const toggleComplete = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const addSubtask = (taskId) => {
    const subtaskDescription = newSubtask[taskId];
    if (!subtaskDescription) return; // Prevent adding empty subtasks

    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedSubtasks = [
          ...task.subtasks,
          { id: Date.now(), description: subtaskDescription, completed: false },
        ];
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });

    setTasks(updatedTasks);
    setNewSubtask({ ...newSubtask, [taskId]: "" }); // Reset input after adding
  };

  const toggleSubtaskComplete = (taskId, subtaskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map((subtask) =>
          subtask.id === subtaskId
            ? { ...subtask, completed: !subtask.completed }
            : subtask
        );
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const filterTasks = () => {
    if (filter === "completed") return tasks.filter((task) => task.completed);
    if (filter === "incomplete") return tasks.filter((task) => !task.completed);
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      return tasks.filter((task) => task.dueDate === today);
    }
    return tasks;
  };

  return (
    <div className="card-container card px-3 justify-content-md-center shadow-lg p-3 bg-body">
      <h2 className="card-title my-3">To-Do List App</h2>

      <form className="form-group my-3" onSubmit={addTask}>
        <div className="row my-3">
          <div className="col col-md-auto">
            <input
              type="text"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control mb-3"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col col-md-auto">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="form-select mb-3"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="form-control"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary my-1">
          Add Task
        </button>
      </form>

      {/* Filter Bar */}
      <div className="filter-bar">
        {" "}
        <button
          className={
            filter === "all"
              ? "buttons active btn btn-primary my-1"
              : "buttons btn btn-outline-primary my-1"
          }
          onClick={() => setFilter("all")}
        >
          All
        </button>{" "}
        <button
          className={
            filter === "today"
              ? "active btn btn-primary"
              : "btn btn-outline-primary"
          }
          onClick={() => setFilter("today")}
        >
          Today
        </button>{" "}
        <button
          className={
            filter === "incomplete"
              ? "active btn btn-primary"
              : "btn btn-outline-primary"
          }
          onClick={() => setFilter("incomplete")}
        >
          Incomplete
        </button>
        <button
          className={
            filter === "completed"
              ? "active btn btn-primary mx-1"
              : "btn btn-outline-primary mx-1"
          }
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>{" "}
      </div>

      {/* Task List */}
      <div className="task-list-container">
        <ul
          className="task-list my-3 pa-auto"
          style={{ listStyleType: "none", margin: 0 }}
        >
          {filterTasks().map((task) => (
            <li
              key={task.id}
              className={
                task.completed
                  ? "li completed my-3 card pa-auto"
                  : "li my-3 card "
              }
            >
              <div className="task-item d-flex flex-row my-3 mx-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  className="form-check-input mx-1"
                />
                <span onClick={() => toggleComplete(task.id)} className="mx-1">
                  {task.description}
                </span>

                <i
                  className="bi bi-trash-fill mx-2"
                  onClick={() => deleteTask(task.id)}
                ></i>
              </div>

              <div className="row my-3 mx-3">
                <div className="col col-md-auto mx-1 p-0">
                  <div className="badge bg-secondary">{task.dueDate}</div>
                </div>
                <div className="col col-md-auto mx-1 p-0">
                  <span
                    className={`badge ${
                      task.priority === "High"
                        ? "bg-danger"
                        : task.priority === "Medium"
                        ? "bg-warning"
                        : "bg-primary"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="col col-md-auto mx-1 p-0">
                  <span className="badge bg-success ">{task.category}</span>
                </div>
              </div>

              {/* Subtasks */}
              <div className="subtask-container d-flex align-items-center row my-3 mx-2">
                <div className="col col-md-auto">
                  <i
                    className="bi bi-plus-lg"
                    onClick={() => addSubtask(task.id)}
                  ></i>
                </div>
                <div className="col col-md">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Add a subtask"
                    value={newSubtask[task.id] || ""}
                    onChange={(e) =>
                      setNewSubtask({
                        ...newSubtask,
                        [task.id]: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <ul className="subtask-list">
                {task.subtasks.map((subtask) => (
                  <li
                    key={subtask.id}
                    className={subtask.completed ? "completed" : ""}
                    onClick={() => toggleSubtaskComplete(task.id, subtask.id)}
                  >
                    {subtask.description}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoApp;
