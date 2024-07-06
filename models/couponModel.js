const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "a coupon must have name"],
      unique: [true, "a coupon must have a unique name"],
      trim: true,
    },
    expires: {
      type: Date,
      required: [true, "a coupon must have an expiration date"],
    },
    discount: {
      type: Number,
      required: [true, "a coupon must have a discount percentage"],
    },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
