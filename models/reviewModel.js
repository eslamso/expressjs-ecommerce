const mongoose = require("mongoose");
const ProductModel = require("./productModel");
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "min val is 1"],
      max: [5, "max val is 5"],
      required: [true, "a review must have a rating"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "a review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "a review must belong to a product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.statics.calcAvgRatingsAndQuantity = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$ratings" },
        quantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    //console.log("result", result);
    await ProductModel.findOneAndUpdate(
      { _id: productId },
      {
        ratingsAverage: result[0].avgRating,
        ratingsQuantity: result[0].quantity,
      }
    );
  } else {
    //console.log("result 2", result);

    await ProductModel.findOneAndUpdate(
      { _id: productId },
      {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      }
    );
  }
};
// reviewSchema.post("save", async function () {
//   //console.log("post save middle", this);
//   await this.constructor.calcAvgRatingsAndQuantity(this.product);
// });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
