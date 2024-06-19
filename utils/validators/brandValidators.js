const validator = require("express-validator");
const validatorMiddleWare = require("../../middlesWares/validatorMiddleWare");
exports.getBrandValidator = [
  validator.check("id").isMongoId().withMessage("invalid brand id format"),
  validatorMiddleWare,
];
exports.createBrandValidator = [
  validator.body("name").notEmpty().withMessage("a brand must have name"),
  validatorMiddleWare,
];

exports.updateBrandValidator = [
  validator.body("name").notEmpty().withMessage("a brand must have a name"),
  validator.param("id").isMongoId().withMessage("invaild brand id format"),
  validatorMiddleWare,
];

exports.deleteBrandValidator = [
  validator.param("id").isMongoId().withMessage("invalid brand id format"),
  validatorMiddleWare,
];
