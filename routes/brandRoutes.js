const express = require("express");
const brandController = require("../controllers/brandController");
const validatorMiddleWare = require("../middlesWares/validatorMiddleWare");
const brandValidator = require("../utils/validators/brandValidators");

const router = express.Router();

//router.use("/:categoryId/subcategory", subcategoryRouter);
router
  .route("/")
  .post(brandValidator.createBrandValidator, brandController.createBrand)
  .get(brandController.getAllBrands);
router
  .route("/:id")
  .get(
    //1 rules,
    brandValidator.getBrandValidator,
    validatorMiddleWare,
    brandController.getBrand
  )
  .patch(brandValidator.updateBrandValidator, brandController.updateBrand)
  .delete(brandValidator.deleteBrandValidator, brandController.deleteBrand);
module.exports = router;
