const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const handler = require("./handlerFactory");
const Review = require("../models/reviewModel");

// @desc create Review
exports.createReview = handler.createOne(Review);

// @desc getAllReviews
// @route GET /api/v1/Review
// @access Public

exports.getAllReviews = handler.getAll(Review, "Reviews");
// @desc get Review
// @route GET /api/v1/Review/:id
// @access Public
exports.getReview = handler.getOne(Review);

// @desc update Review
// @route PUT /api/v1/Review/:id
// @access Privacy

exports.updateReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!review) {
    return new AppError("No review found with that ID", 404);
  }
  //to trigger post save middleware to calculate ratings avg
  await Review.calcAvgRatingsAndQuantity(review.product);

  res.status(200).json({
    success: true,
    review,
  });
});

// @desc delete Review
// @route /api/v1/Review/:id
// @access Privacy

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    return next(new AppError("No document found with that ID", 404));
  }
  //used for calculating rating and quantity after removing review with id
  await Review.calcAvgRatingsAndQuantity(review.product);
  res.status(204).json({
    success: true,
  });
});
