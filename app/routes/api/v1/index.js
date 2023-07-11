const app = require('express').Router();
module.exports = (function () {
  // ---------------------------- Auth Ctrl ------------------------------
  // const authCtrl = require("./../../../controller/api/v1/authController");
  const authRoute = require("./auth");
  const todoRoute = require("./todo");

  // -------------------------------- API -------------------------------

  app.use("/auth", authRoute);
  app.use("/todo", todoRoute);

  return app;
})();