import { useState } from "react";
function TodoItem({ todo, onToggleTodo, onEditTodo, onDeleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState(todo.task);
  const [error, setError] = useState("");
  const createdDate = new Date(todo.createdAt);

  const date = createdDate.toLocaleDateString("en-GB");

  const time = createdDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const handleToggle = async () => {
    try {
      await onToggleTodo(todo.id, !todo.completed);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = () => {
    setEditTask(todo.task);
    setIsEditing(true);
    setError("");
  };

  const handleCancelEdit = () => {
    setEditTask(todo.task);
    setIsEditing(false);
    setError("");
  };

  const handleSaveEdit = async () => {
    if (editTask.trim === "") {
      setError("Task cannot be empty");
      return;
    }
    try {
      await onEditTodo(todo.id, editTask);

      setIsEditing(false);
      setError("");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    try {
      await onDeleteTodo(todo.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="todo-card">
      <div className="todo-top">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />

        <span className="todo-id">#{todo.id}</span>
      </div>

      {isEditing ? (
        <input
          className="edit-input"
          type="text"
          value={editTask}
          onChange={(event) => setEditTask(event.target.value)}
        />
      ) : (
        <h3>{todo.task}</h3>
      )}

      <p>Date: {date}</p>

      <p>Time: {time}</p>

      {error && <p className="edit-error">{error}</p>}

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button onClick={handleSaveEdit}>Save</button>

            <button onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <button onClick={handleEditClick}>Edit</button>

            <button onClick={handleDelete}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}

export default TodoItem;
