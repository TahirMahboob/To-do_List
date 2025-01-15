import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Load tasks from local storage on initial render
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) setTasks(savedTasks);
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddOrUpdateTask = () => {
    if (task.trim() === "") {
      toast.error("Task cannot be empty!");
      return;
    }

    if (editIndex !== null) {
      // Update task
      const updatedTasks = tasks.map((t, index) =>
        index === editIndex
          ? { ...t, name: task, dueDate, category, priority }
          : t
      );
      setTasks(updatedTasks);
      toast.success("Task updated successfully!");
      setEditIndex(null);
    } else {
      // Add new task
      setTasks([
        ...tasks,
        { name: task, completed: false, dueDate, category, priority },
      ]);
      toast.success("Task added successfully!");
    }

    // Clear inputs
    setTask("");
    setDueDate("");
    setCategory("");
    setPriority("");
  };

  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updatedTasks);
  };

  const handleEditTask = (index) => {
    const taskToEdit = tasks[index];
    setTask(taskToEdit.name);
    setDueDate(taskToEdit.dueDate);
    setCategory(taskToEdit.category);
    setPriority(taskToEdit.priority);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    toast.error("Task deleted!");
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "" || t.category === filter)
  );

  const completedTasks = tasks.filter((t) => t.completed).length;
  const progress = tasks.length ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="container mt-5">
      <h1 className="text-center">Enhanced To-Do List</h1>

      {/* Progress Bar */}
      <div className="progress mb-3">
        <div
          className="progress-bar"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {Math.round(progress)}%
        </div>
      </div>

      {/* Task Form */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Enter task name"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="date"
          className="form-control mb-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select
          className="form-select mb-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Shopping">Shopping</option>
        </select>
        <select
          className="form-select mb-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="">Set Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button className="btn btn-primary" onClick={handleAddOrUpdateTask}>
          {editIndex !== null ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Search and Filter */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        className="form-select mb-3"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">Filter by Category</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Shopping">Shopping</option>
      </select>

      {/* Task List */}
      <ul className="list-group">
        {filteredTasks.map((t, index) => (
          <li
            key={index}
            className={`list-group-item d-flex justify-content-between align-items-center ${t.completed ? "list-group-item-success" : ""
              }`}
          >
            <div>
              <span
                style={{
                  textDecoration: t.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
                onClick={() => toggleTaskCompletion(index)}
              >
                {t.name}
              </span>
              {t.dueDate && (
                <span className="text-muted ms-2">(Due: {t.dueDate})</span>
              )}
              {t.category && (
                <span className="badge bg-info text-dark ms-2">
                  {t.category}
                </span>
              )}
              {t.priority && (
                <span
                  className={`badge ms-2 ${t.priority === "High"
                      ? "bg-danger"
                      : t.priority === "Medium"
                        ? "bg-warning"
                        : "bg-success"
                    }`}
                >
                  {t.priority}
                </span>
              )}
            </div>
            <div>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => handleEditTask(index)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeleteTask(index)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && <p className="text-center mt-3">No tasks added yet!</p>}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default App;
