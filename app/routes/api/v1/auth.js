// Define Common Files
const app = require('express').Router();
const { verifyAuthenticationToken, verifyAccessToken, apiValidation ,findModule} = require('../../../../config/common');
const { signupValidation, forgetpasswordValidation, resetpasswordValidation } = require('../../../../config/Validation');

// Define Export Module
module.exports = (function () {
  // ---------------------------- Auth Ctrl ------------------------------
  const authCtrl = require("./../../../controller/api/v1/authController");

  // -------------------------------- API -------------------------------
  app.get("/check", (req, res) => {
    res.json({ message: "Welcome to ESIQUOTE application." });
  });
  app.post("/signup", verifyAuthenticationToken, verifyAccessToken,findModule('registerUser'), signupValidation, apiValidation, authCtrl.signup);
  app.post("/login", verifyAuthenticationToken, authCtrl.login);
  app.post("/forgot-password", verifyAuthenticationToken, forgetpasswordValidation, apiValidation, authCtrl.forgotPassword);
  app.put("/reset-password/:token", verifyAuthenticationToken, resetpasswordValidation, apiValidation, authCtrl.resetPassword);
  return app;
})();
