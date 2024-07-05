const slugify = require("slugify");

const validator = require("express-validator");
const validatorMiddleWare = require("../../middlesWares/validatorMiddleWare");
const ProductModel = require("../../models/productModel");
const Review = require("../../models/reviewModel");
exports.getReviewValidator = [
  validator.check("id").isMongoId().withMessage("invalid Review id format"),
  validatorMiddleWare,
];
exports.createReviewValidator = [
  validator
    .body("ratings")
    .notEmpty()
    .withMessage("a Review must have ratings"),
  validator
    .body("user")
    .notEmpty()
    .withMessage("a Review must have ratings")
    .isMongoId()
    .withMessage("in valid user id format")
    .custom((val, { req }) => {
      if (!(val === req.user.id)) {
        throw new Error("you must be the same user to create a new review");
      }
      return true;
    }),
  validator
    .body("product")
    .notEmpty()
    .withMessage("a Review must belong to a product")
    .isMongoId()
    .withMessage("in valid product id format")
    .custom(async (val, { req }) => {
      const product = await ProductModel.findOne({ _id: val });
      if (!product) {
        throw new Error("no product found with this id");
      }
      const review = await Review.findOne({ product: val, user: req.user.id });
      if (review) {
        throw new Error("you can only have one review");
      }
      return true;
    }),
  validatorMiddleWare,
];

exports.updateReviewValidator = [
  validator
    .param("id")
    .isMongoId()
    .withMessage("invalid Review id format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);

      if (review.user._id.toString() !== req.user.id.toString()) {
        throw new Error(
          "you must be the same user who created that review to update the review"
        );
      }
      return true;
    }),
  validatorMiddleWare,
];

exports.deleteReviewValidator = [
  validator
    .param("id")
    .isMongoId()
    .withMessage("invalid Review i  d format")
    .custom(async (val, { req }) => {
      const review = await Review.findById(val);
      if (!review) {
        throw new Error("no review found with this id");
      }
      if (["admin", "manager"].includes(req.user.role)) {
        return true;
      }

      if (review.user._id.toString() !== req.user.id.toString()) {
        throw new Error(
          "you must be the same user who created that review to delete the review"
        );
      }
      return true;
    }),
  validatorMiddleWare,
];
