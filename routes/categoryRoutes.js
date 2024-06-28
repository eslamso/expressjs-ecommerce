const express = require("express");
const categoryController = require("../controllers/categoryController");
const validatorMiddleWare = require("../middlesWares/validatorMiddleWare");
const categoryValidator = require("../utils/validators/categoryValidators");
const subcategoryRouter = require("./subCategoryRoutes");
const router = express.Router();

router.use("/:categoryId/subcategory", subcategoryRouter);
router
  .route("/")
  .post(
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
    categoryController.uploadImage,
    categoryController.resizeImage,
    categoryValidator.updateCategoryValidator,
    categoryController.updateCategory
  )
  .delete(
    categoryValidator.deleteCategoryValidator,
    categoryController.deleteCategory
  );
module.exports = router;
