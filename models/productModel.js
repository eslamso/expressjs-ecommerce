const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "a product must have a title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "a product must have a description"],
      minlength: [20, "description can not be less than 20 characters"],
    },
    price: {
      type: Number,
      required: [true, "a product must have a price"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "a product must belong to a category"],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    subcategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
    images: [String],
    imageCover: String,
    slug: String,
    colors: [String],
    priceAfterDiscount: Number,
    sold: Number,
    quantity: {
      type: Number,
      required: [true, "a product must have a quantity"],
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, "rating must be between 1 and 5"],
      max: [5, "rating must be between 1 and 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});
productSchema.post("init", (doc) => {
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}/uploads/products/${doc.imageCover}`;
  }
  if (doc.images) {
    doc.images.forEach((img, index) => {
      doc.images[index] = `${process.env.BASE_URL}/uploads/products/${img}`;
    });
  }
});
const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
