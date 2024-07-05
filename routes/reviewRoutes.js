const express = require("express");
const reviewController = require("../controllers/reviewController");
// const reviewValidator = require("../utils/validators/reviewValidators");
const { protect, restrictTo } = require("../controllers/authController");
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidators");

const router = express.Router();

//router.use("/:categoryId/subcategory", subcategoryRouter);
router
  .route("/")
  .post(
    protect,
    restrictTo("user"),
    createReviewValidator,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);
router
  .route("/:id")
  .get(
    //1 rules,
    protect,
    getReviewValidator,
    reviewController.getReview
  )
  .patch(
    protect,
    restrictTo("user"),
    updateReviewValidator,
    reviewController.updateReview
  )
  .delete(protect, /*deleteReviewValidator,*/ reviewController.deleteReview);
module.exports = router;
