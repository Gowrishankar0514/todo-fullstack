import { useState } from "react";

function TodoForm({ onTodoAdded }) {
  const [task, setTask] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (task.trim() === "") {
      setError("Task cannot be empty");
      return;
    }
    try {
      await onTodoAdded(task);
      setTask("");
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter the task"
        value={task}
        onChange={(event) => setTask(event.target.value)}
      />

      <button type="submit">Add task</button>
      {error && <p>{error}</p>}
    </form>
  );
}

export default TodoForm;
