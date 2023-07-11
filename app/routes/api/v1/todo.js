// Define Common Files
const app = require('express').Router();
const { verifyAccessToken, apiValidation } = require('../../../../config/common');
const { signupValidation, loginValidation, forgetpasswordValidation, resetpasswordValidation, createTodoValidation } = require('../../../../config/Validation');

// Define Export Module
module.exports = (function () {
  // ---------------------------- Auth Ctrl ------------------------------
  const todoCtrl = require("../../../controller/api/v1/todoController");

  // -------------------------------- API -------------------------------
  app.get("/", verifyAccessToken, todoCtrl.todoList);
  app.get("/:id", verifyAccessToken, todoCtrl.getTodoById);
  app.post("/", verifyAccessToken, createTodoValidation, apiValidation, todoCtrl.createTodo);
  app.put("/:id", verifyAccessToken, createTodoValidation, apiValidation, todoCtrl.updateTodo);
  app.delete("/:id", verifyAccessToken, todoCtrl.deleteTodo);
  app.patch("/:id", verifyAccessToken, todoCtrl.todoMarkCompleted);
  return app;
})();
