const express = require("express");
const ProductController = require("../controllers/productController");
const validatorMiddleWare = require("../middlesWares/validatorMiddleWare");
const ProductValidator = require("../utils/validators/productValidators");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    protect,
    restrictTo("admin", "manager"),
    ProductController.uploadImage,
    ProductController.resizeImage,
    ProductValidator.createProductValidator,
    ProductController.createProduct
  )
  .get(ProductController.getAllProducts);
router
  .route("/:id")
  .get(
    //1 rules,
    ProductValidator.getProductValidator,
    validatorMiddleWare,
    ProductController.getProduct
  )
  .patch(
    protect,
    restrictTo("admin", "manager"),
    ProductValidator.updateProductValidator,
    ProductController.updateProduct
  )
  .delete(
    protect,
    restrictTo("admin"),
    ProductValidator.deleteProductValidator,
    ProductController.deleteProduct
  );
module.exports = router;
