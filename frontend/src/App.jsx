import { useState, useEffect } from "react";
import "./App.css";

import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/todos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        return response.json();
      })
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to load todos");
        setLoading(false);
      });
  }, []);

  const handleAddTodo = async (task) => {
    const response = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: task,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to add todo");
    }
    const newTodo = await response.json();

    setTodos((currentTodos) => [...currentTodos, newTodo]);
    return newTodo;
  };

  const handleToggleTodo = async (id, completed) => {
    const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        completed: completed,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(errorData.message || "Failed to update todo");
    }

    const updatedTodo = await response.json();

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo,
      ),
    );
  };
  const handleEditTodo = async (id, task) => {
    const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        task: task,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      throw new Error(errorData.message || "Failed to update todo");
    }

    const updatedTodo = await response.json();

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo,
      ),
    );
  };

  const handleDeleteTodo = async (id) => {
    const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const erroeData = await response.json().catch(() => ({}));

      throw new Error(errorData.message || "Failed to delete todo");
    }
    await response.json();

    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="app">
      <h1>TO DO LIST</h1>
      <TodoForm onTodoAdded={handleAddTodo} />

      {loading && <p>Loading todos...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <TodoList
          todos={todos}
          onToggleTodo={handleToggleTodo}
          onEditTodo={handleEditTodo}
          onDeleteTodo={handleDeleteTodo}
        />
      )}
    </div>
  );
}

export default App;
