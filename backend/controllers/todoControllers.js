const fs = require("fs");
const path = require("path");

//GET Method
const getTodos = (req, res) => {
  const filePath = path.join(__dirname, "../data/todos.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to read todos",
      });
    }
    const todos = JSON.parse(data);

    res.status(200).json(todos);
  });
};

//POST Method
const createTodo = (req, res) => {
  const { task } = req.body;

  //Valid task
  if (!task || task.trim() === "") {
    return res.status(400).json({ message: "Task is required" });
  }
  const filePath = path.join(__dirname, "../data/todos.json");

  //read existing todos

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to read todos",
      });
    }
    const todos = JSON.parse(data);

    //generate new ID
    const newId =
      todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;

    //Create newTodo
    const newTodo = {
      id: newId,
      task: task.trim(),
      createdAt: new Date().toISOString(),
      completed: false,
    };

    //Add new todo to array
    todos.push(newTodo);

    //Save updated array to JSON file
    fs.writeFile(
      filePath,
      JSON.stringify(todos, null, 2),
      "utf8",
      (writeErr) => {
        if (writeErr) {
          return res.send(500).json({
            message: "FAiled to save todo",
          });
        }
        //send created todo back
        res.status(201).json(newTodo);
      },
    );
  });
};

//PUT Method
const updateTodo = (req, res) => {
  const todoId = Number(req.params.id);
  const { task, completed } = req.body;

  const filePath = path.join(__dirname, "../data/todos.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.send(500).json({ message: "Failed to read todos" });
    }

    const todos = JSON.parse(data);

    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex === -1) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }
    if (task !== undefined) {
      if (typeof task !== "string" || task.trim() == "") {
        return res.status(400).json({
          message: "Task cannot be empty",
        });
      }
      todos[todoIndex].task = task.trim();
    }

    if (completed !== undefined) {
      todos[todoIndex].completed = Boolean(completed);
    }

    fs.writeFile(
      filePath,
      JSON.stringify(todos, null, 2),
      "utf8",
      (writeErr) => {
        if (writeErr) {
          return res.status(500).json({
            message: "Failed to update todo",
          });
        }
        res.status(200).json(todos[todoIndex]);
      },
    );
  });
};

//delete Todo
const deleteTodo = (req, res) => {
  const todoId = Number(req.params.id);

  const filePath = path.join(__dirname, "../data/todos.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to read todos",
      });
    }
    const todos = JSON.parse(data);

    const todoIndex = todos.findIndex((todo) => todo.id === todoId);

    if (todoIndex === -1) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }
    const deletedTodo = todos[todoIndex];

    todos.splice(todoIndex, 1);

    fs.writeFile(
      filePath,
      JSON.stringify(todos, null, 2),
      "utf8",
      (writeErr) => {
        if (writeErr) {
          return res.status(500).json({
            message: "Failed to delete todo",
          });
        }

        res.status(200).json({
          message: "Todo delete successfully",
          todo: deletedTodo,
        });
      },
    );
  });
};

module.exports = {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
