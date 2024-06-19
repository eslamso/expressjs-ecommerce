const express = require("express");
const ProductController = require("../controllers/productController");
const validatorMiddleWare = require("../middlesWares/validatorMiddleWare");
const ProductValidator = require("../utils/validators/productValidators");
const router = express.Router();

router
  .route("/")
  .post(
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
    ProductValidator.updateProductValidator,
    ProductController.updateProduct
  )
  .delete(
    ProductValidator.deleteProductValidator,
    ProductController.deleteProduct
  );
module.exports = router;
