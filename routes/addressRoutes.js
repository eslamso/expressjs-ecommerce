const express = require("express");
const userController = require("../controllers/userController");
// const userValidator = require("../utils/validators/userValidators");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

//router.use("/:categoryId/subcategory", subcategoryRouter);
router.use(protect, restrictTo("user"));
router
  .route("/:id")
  .put(userController.updateAddress)
  .delete(userController.removeAddress);
router
  .route("/")
  .get(userController.getMyAddresses)
  .post(userController.addAddress);
module.exports = router;
