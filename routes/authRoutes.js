const express = require("express");
const {
  signUp,
  login,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} = require("../controllers/authController");
const {
  signUpValidator,
  loginValidator,
  resetPasswordValidator,
} = require("../utils/validators/authValidators");

const router = express.Router();

router.post("/signUp", signUpValidator, signUp);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/resetPassword/:token", resetPasswordValidator, resetPassword);

module.exports = router;
