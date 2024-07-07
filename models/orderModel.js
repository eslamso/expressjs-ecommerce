const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
        color: String,
      },
    ],
    tax: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    shippingAddress: {
      details: String,
      city: String,
      state: String,
      postalCode: String,
    },
    totalOrderPrice: Number,
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    PaidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliverAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name email " }).populate({
    path: "cartItems.product",
    select: "title",
  });
  next();
});
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
