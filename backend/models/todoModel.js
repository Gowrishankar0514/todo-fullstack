const pool = require("../config/db");

// Get all todos
const getAllTodos = async () => {
  const result = await pool.query(
    `SELECT id, task, created_at, completed
     FROM todos
     ORDER BY id`,
  );

  return result.rows;
};

// Create todo
const createTodo = async (task) => {
  const result = await pool.query(
    `INSERT INTO todos (task)
     VALUES ($1)
     RETURNING id, task, created_at, completed`,
    [task],
  );

  return result.rows[0];
};

// Update todo
const updateTodo = async (todoId, task, completed) => {
  const fields = [];
  const values = [];

  let parameterIndex = 1;

  if (task !== undefined) {
    fields.push(`task = $${parameterIndex}`);
    values.push(task);
    parameterIndex++;
  }

  if (completed !== undefined) {
    fields.push(`completed = $${parameterIndex}`);
    values.push(Boolean(completed));
    parameterIndex++;
  }

  values.push(todoId);

  const result = await pool.query(
    `UPDATE todos
     SET ${fields.join(", ")}
     WHERE id = $${parameterIndex}
     RETURNING id, task, created_at, completed`,
    values,
  );

  return result.rows[0] || null;
};

// Delete todo
const deleteTodo = async (todoId) => {
  const result = await pool.query(
    `DELETE FROM todos
     WHERE id = $1
     RETURNING id, task, created_at, completed`,
    [todoId],
  );

  return result.rows[0] || null;
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
