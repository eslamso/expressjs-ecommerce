const express = require("express");
const userController = require("../controllers/userController");
// const userValidator = require("../utils/validators/userValidators");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

//router.use("/:categoryId/subcategory", subcategoryRouter);
router.use(protect, restrictTo("user"));
router
  .route("/:id")
  .post(userController.addProductToMyFavorites)
  .delete(userController.removeProductFromMyFavorites);
router.get("/", userController.getMyFavoriteProducts);
module.exports = router;
