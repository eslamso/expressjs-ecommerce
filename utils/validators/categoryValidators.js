const slugify = require("slugify");

const validator = require("express-validator");
const validatorMiddleWare = require("../../middlesWares/validatorMiddleWare");
exports.getCategoryValidator = [
  validator.check("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleWare,
];
exports.createCategoryValidator = [
  validator
    .body("name")
    .notEmpty()
    .withMessage("a category must have name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleWare,
];

exports.updateCategoryValidator = [
  validator
    .body("name")
    .notEmpty()
    .withMessage("a category must have a name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator.param("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleWare,
];

exports.deleteCategoryValidator = [
  validator.param("id").isMongoId().withMessage("invalid category id format"),
  validatorMiddleWare,
];
