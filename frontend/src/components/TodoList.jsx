import { useState } from "react";
import TodoItem from "./TodoItem";
function TodoList({ todos, onToggleTodo, onEditTodo, onDeleteTodo }) {
  const [sortBy, setSortBy] = useState("id");

  const [sortOrder, setSortOrder] = useState("asc");

  const getSortedTodos = (todosToSort) => {
    const sortedTodos = [...todosToSort];

    sortedTodos.sort((a, b) => {
      if (sortBy === "id") {
        2;
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      }

      if (sortBy === "task") {
        return sortOrder === "asc"
          ? a.task.localeCompare(b.task)
          : b.task.localeCompare(a.task);
      }
      if (sortBy === "createdAt") {
        return sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
    return sortedTodos;
  };
  const inProgressTodos = getSortedTodos(
    todos.filter((todo) => todo.completed === false),
  );

  const completedTodos = getSortedTodos(
    todos.filter((todo) => todo.completed === true),
  );

  return (
    <div className="todo-list">
      <div className="sort-controls">
        <label htmlFor="sortBy">Sort By:</label>

        <select
          id="sortBy"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="id">ID</option>
          <option value="task">Task</option>
          <option value="createdAt">Created Date</option>
        </select>
        <button
          className="sort-arrow"
          onClick={() =>
            setSortOrder((currentOrder) =>
              currentOrder === "asc" ? "desc" : "asc",
            )
          }
          title={sortOrder === "asc" ? "Ascending" : "Descending"}
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>

      <section className="todo-section">
        <h2>IN PROGRESS</h2>
        {inProgressTodos.length === 0 ? (
          <p className="empty-message">No tasks in progress...</p>
        ) : (
          inProgressTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggleTodo={onToggleTodo}
              onEditTodo={onEditTodo}
              onDeleteTodo={onDeleteTodo}
            />
          ))
        )}
      </section>
      <section className="todo-section">
        <h2>COMPLETED</h2>
        {completedTodos.length === 0
          ? TodoItem(<p className="empth-msg">No completed tasks...</p>)
          : completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleTodo={onToggleTodo}
                onEditTodo={onEditTodo}
                onDeleteTodo={onDeleteTodo}
              />
            ))}
      </section>
    </div>
  );
}
export default TodoList;
