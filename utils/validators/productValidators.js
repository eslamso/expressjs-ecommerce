const slugify = require("slugify");

const validator = require("express-validator");
const validatorMiddleWare = require("../../middlesWares/validatorMiddleWare");
const categoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subcategoryModel");
exports.getProductValidator = [
  validator.check("id").isMongoId().withMessage("invalid Product id format"),
  validatorMiddleWare,
];
exports.createProductValidator = [
  validator
    .body("title")
    .notEmpty()
    .withMessage("a Product must have title")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validator
    .body("description")
    .notEmpty()
    .withMessage("a Product must have description")
    .isLength({ min: 20 })
    .withMessage("description can not be less than 20 characters"),
  validator.body("price").isNumeric().withMessage("price must be a number"),
  validator
    .body("category")
    .notEmpty()
    .withMessage("a product must belong to a category")
    .isMongoId()
    .withMessage("invalid category id format")
    .custom(async (id) => {
      const category = await categoryModel.findById(id);
      if (!category) {
        throw new Error("category not found");
      }
      return true;
    }),
  validator
    .body("quantity")
    .notEmpty()
    .withMessage("a product must have a quantity")
    .isNumeric()
    .withMessage("quantity must be a number"),
  validator
    .body("colors")
    .optional()
    .isArray()
    .withMessage("colors must be an array"),
  validator
    .body("images")
    .optional()
    .isArray()
    .withMessage("images must be an array"),
  validator
    .body("sold")
    .optional()
    .isNumeric()
    .withMessage("sold must be a number"),
  validator
    .body("price")
    .notEmpty()
    .withMessage("a product must have a price")
    .isNumeric()
    .withMessage("price must be a number"),
  validator
    .body("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (value > req.body.price) {
        throw new Error("price after discount can not be greater than price");
      }
      return true;
    }),
  validator
    .body("imageCover")
    .notEmpty()
    .withMessage("imageCover must be provided"),
  validator
    .body("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingAverage must be a number")
    .isLength({ min: 1, max: 5 })
    .withMessage("ratingAverage must be between 1 and 5"),
  validator
    .body("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingQuantity must be a number"),
  validator
    .body("subcategory")
    .optional()
    .isArray()
    .withMessage("invalid subcategory must be an array")
    .custom(async (vals, { req }) => {
      const categories = await subCategoryModel.find({
        _id: { $exists: true, $in: vals },
        category: req.body.category,
      });
      console.log(categories);
      if (categories.length !== vals.length || categories.length < 1) {
        throw new Error("subcategories not found yaba");
      }
      return true;
    }),
  validator
    .body("brand")
    .optional()
    .isMongoId()
    .withMessage("invalid brand id format"),

  validatorMiddleWare,
];

exports.updateProductValidator = [
  validator.param("id").isMongoId().withMessage("invalid Product id format"),
  validator
    .body("title")
    .notEmpty()
    .withMessage("a subCategory must have a name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleWare,
];

exports.deleteProductValidator = [
  validator.param("id").isMongoId().withMessage("invalid Product id format"),
  validatorMiddleWare,
];
