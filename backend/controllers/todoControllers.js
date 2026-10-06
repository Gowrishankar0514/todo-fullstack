const {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../models/todoModel");

// GET /api/todos
const getTodos = async (req, res) => {
  try {
    const rows = await getAllTodos();

    const todos = rows.map((row) => ({
      id: row.id,
      task: row.task,
      createdAt: row.created_at,
      completed: row.completed,
    }));

    res.status(200).json(todos);
  } catch (error) {
    console.error("Failed to fetch todos:", error);

    res.status(500).json({
      message: "Failed to fetch todos",
    });
  }
};

// POST /api/todos
const createTodoController = async (req, res) => {
  const { task } = req.body;

  if (!task || task.trim() === "") {
    return res.status(400).json({
      message: "Task is required",
    });
  }

  try {
    const row = await createTodo(task.trim());

    const newTodo = {
      id: row.id,
      task: row.task,
      createdAt: row.created_at,
      completed: row.completed,
    };

    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Failed to create todo:", error);

    res.status(500).json({
      message: "Failed to create todo",
    });
  }
};

// PUT /api/todos/:id
const updateTodoController = async (req, res) => {
  const todoId = Number(req.params.id);

  const { task, completed } = req.body;

  if (Number.isNaN(todoId)) {
    return res.status(400).json({
      message: "Invalid todo ID",
    });
  }

  if (task === undefined && completed === undefined) {
    return res.status(400).json({
      message: "Nothing to update",
    });
  }

  if (task !== undefined && (typeof task !== "string" || task.trim() === "")) {
    return res.status(400).json({
      message: "Task cannot be empty",
    });
  }

  try {
    const row = await updateTodo(
      todoId,
      task !== undefined ? task.trim() : undefined,
      completed,
    );

    if (!row) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    const updatedTodo = {
      id: row.id,
      task: row.task,
      createdAt: row.created_at,
      completed: row.completed,
    };

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("Failed to update todo:", error);

    res.status(500).json({
      message: "Failed to update todo",
    });
  }
};

// DELETE /api/todos/:id
const deleteTodoController = async (req, res) => {
  const todoId = Number(req.params.id);

  if (Number.isNaN(todoId)) {
    return res.status(400).json({
      message: "Invalid todo ID",
    });
  }

  try {
    const row = await deleteTodo(todoId);

    if (!row) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    const deletedTodo = {
      id: row.id,
      task: row.task,
      createdAt: row.created_at,
      completed: row.completed,
    };

    res.status(200).json({
      message: "Todo deleted successfully",
      todo: deletedTodo,
    });
  } catch (error) {
    console.error("Failed to delete todo:", error);

    res.status(500).json({
      message: "Failed to delete todo",
    });
  }
};

module.exports = {
  getTodos,
  createTodo: createTodoController,
  updateTodo: updateTodoController,
  deleteTodo: deleteTodoController,
};
