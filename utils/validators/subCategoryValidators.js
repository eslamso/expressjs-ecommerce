const slugify = require("slugify");

const validator = require("express-validator");
const validatorMiddleWare = require("../../middlesWares/validatorMiddleWare");

exports.createSubCategoryValidator = [
  validator
    .body("name")
    .notEmpty()
    .withMessage("a subcategory must have name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator.body("category").isMongoId().withMessage("enter valid category Id"),
  validatorMiddleWare,
];

exports.getSubCategoryValidator = [
  validator.param("id").isMongoId().withMessage("enter valid SubCategory Id"),
  validatorMiddleWare,
];

exports.updateSubCategoryValidator = [
  validator
    .body("name")
    .notEmpty()
    .withMessage("a subCategory must have a name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator
    .body("category")
    .isMongoId()
    .withMessage("invaild category id format"),
  validator.param("id").isMongoId().withMessage("enter valid SubCategory Id"),
  validatorMiddleWare,
];

exports.deleteSubCategoryValidator = [
  validator.param("id").isMongoId().withMessage("enter valid SubCategory Id"),
  validatorMiddleWare,
];
