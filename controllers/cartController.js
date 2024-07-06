const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const Coupon = require("../models/couponModel");

const Product = require("../models/productModel");

const Cart = require("../models/cartModel");

const calCartPrice = async (cart) => {
  let total = 0;
  cart.cartItems.forEach((item) => {
    total += item.quantity * item.price;
  });
  cart.totalCartPrice = total.toFixed(2);
  cart.totalCartPriceAfterDiscount = undefined;

  await cart.save();
};
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);
  //1- if user has already cart created or ont
  let cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    cart = await Cart.create({
      cartItems: [{ product: productId, color, price: product.price }],
      user: req.user.id,
    });
  } else {
    //2- if user has already cart and check if the product found on the cart or not
    console.log("element added here");
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const item = cart.cartItems[productIndex];
      item.quantity += 1;
      cart.cartItems[productIndex] = item;
    } else {
      // element not found in the cart
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  calCartPrice(cart);

  res.status(201).json({
    success: true,
    message: "product added to cart",
    numOfItems: cart.cartItems.length,

    cart,
  });
});

exports.getMyCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new AppError("there is no cart for you", 404));
  }
  res.status(200).json({
    success: true,
    numOfItems: cart.cartItems.length,
    cart,
  });
});

exports.removeProductFromMyCart = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    {
      //addToSet if id founded in set before added it not added again
      $pull: { cartItems: { _id: id } },
    },
    { new: true }
  );
  if (!cart) {
    return next(new AppError("no cart found", 404));
  }
  calCartPrice(cart);
  res.status(200).json({
    success: true,
    numOfItems: cart.cartItems.length,
    cart,
  });
});

exports.clearMyCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    {
      //addToSet if id founded in set before added it not added again
      $set: {
        cartItems: [],
        totalCartPrice: 0,
      },
      // remove field
      $unset: { totalCartPriceAfterDiscount: "" },
    },
    { new: true }
  );
  if (!cart) {
    return next(new AppError("no cart found", 404));
  }
  res.status(200).json({
    success: true,
    numOfItems: cart.cartItems.length,
    cart,
  });
});

exports.removeMyCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user.id });
  if (!cart) {
    return next(new AppError("no cart found", 404));
  }
  res.status(204).json({
    success: true,
  });
});

exports.updateProductQuantityCart = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new AppError("no cart found", 404));
  }
  const productIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId.toString()
  );
  if (productIndex == -1) {
    return next(new AppError("item not found in cart", 404));
  }
  const item = cart.cartItems[productIndex];
  const product = await Product.findById(item.product);
  if (!product) {
    return next(new AppError("product not found", 404));
  }
  if (quantity > product.quantity) {
    return next(
      new AppError("quantity should not exceed the product's quantity", 400)
    );
  }
  item.quantity = quantity;
  cart.cartItems[productIndex] = item;
  calCartPrice(cart);
  res.status(200).json({
    success: true,
    cart,
  });
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expires: { $gt: Date.now() },
  });
  //check if coupon is valid
  if (!coupon) {
    return next(new AppError("the coupon is not found or expired", 400));
  }
  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) {
    return next(new AppError("no cart found", 404));
  }
  const totalAfterDiscount = (
    cart.totalCartPrice -
    (cart.totalCartPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalCartPriceAfterDiscount = totalAfterDiscount;
  await cart.save();
  res.status(200).json({
    success: true,
    message: "coupon applied successfully",
    cart,
  });
});

exports.removeCouponFromMyCart = asyncHandler(async (req, res, next) => {
  console.log("hello from here");
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
  });
  //check if coupon is valid
  if (!coupon) {
    return next(new AppError("the coupon is not found or expired", 400));
  }
  const cart = await Cart.findOneAndUpdate(
    { user: req.user.id },
    { $unset: { totalCartPriceAfterDiscount: "" } },
    { new: true }
  );
  if (!cart) {
    return next(new AppError("no cart found", 404));
  }
  res.status(200).json({
    success: true,
    message: "coupon is remove successfully",
    cart,
  });
});
