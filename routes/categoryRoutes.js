const express = require("express");
const categoryController = require("../controllers/categoryController");
const validatorMiddleWare = require("../middlesWares/validatorMiddleWare");
const categoryValidator = require("../utils/validators/categoryValidators");
const subcategoryRouter = require("./subCategoryRoutes");
const { protect, restrictTo } = require("../controllers/authController");
const router = express.Router();

router.use("/:categoryId/subcategory", subcategoryRouter);
router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    categoryController.uploadImage,
    categoryController.resizeImage,
    categoryValidator.createCategoryValidator,
    categoryController.createCategory
  )
  .get(categoryController.getAllCategories);
router
  .route("/:id")
  .get(
    //1 rules,
    categoryValidator.getCategoryValidator,
    validatorMiddleWare,
    categoryController.getCategory
  )
  .patch(
    protect,
    restrictTo("admin", "manager"),
    categoryController.uploadImage,
    categoryController.resizeImage,
    categoryValidator.updateCategoryValidator,
    categoryController.updateCategory
  )
  .delete(
    protect,
    restrictTo("admin"),
    categoryValidator.deleteCategoryValidator,
    categoryController.deleteCategory
  );
module.exports = router;
