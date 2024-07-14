const asyncHandler = require("express-async-handler");
const axios = require("axios");
const AppError = require("../utils/appError");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");

const ProductModel = require("../models/productModel");

// const stripeCardOrder = async (res, session) => {
//   const cart = await Cart.findById(session.data.object.client_reference_id);
//   const price = session.data.object.amount_total / 100;
//   const user = await User.findOne({
//     email: session.data.object.customer_email,
//   });
//   const shippingAddress = session.data.object.metadata.shipping_Address;

//   const order = await Order.create({
//     user: user._id,
//     cartItems: cart.cartItems,
//     shippingAddress,
//     totalOrderPrice: price,
//     isPaid: true,
//     PaidAt: Date.now(),
//     paymentMethod: "online",
//   });
//   if (order) {
//     // eslint-disable-next-line arrow-body-style
//     /*
//     const bulkOpt = cart.cartItems.map((item) => {
//       return {
//         updateOne: {
//           filter: { _id: item.product },
//           update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
//         },
//       };
//     });
// */
//     //await ProductModel.bulkWrite(bulkOpt, {});
//     cart.cartItems.forEach(async (item) => {
//       await ProductModel.findByIdAndUpdate(item.product, {
//         $inc: { quantity: -item.quantity, sold: +item.quantity },
//       });
//     });
//     //5-remove cart
//     await Cart.deleteOne({ _id: cart._id });
//   }
//   res
//     .status(201)
//     .json({ success: true, message: "order is created successfully" });
// };

// can be used when the delivery deliver order to customer and checking barcode

exports.opayCheckOutSession = asyncHandler(async (req, res, next) => {
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new AppError("cart not found", 404));
  }
  const cartPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;
  const totalCartPrice = cartPrice + taxPrice + shippingPrice;
  const formData = {
    amount: {
      currency: "EGP",
      total: Math.round(totalCartPrice * 100),
    },
    callbackUrl: "https://natoursapp-lu63.onrender.com/opay-webhook",
    cancelUrl: "https://www.w3schools.com/howto/howto_js_remove_decimals.asp",
    country: "EG",
    expireAt: 300,
    payMethod: "BankCard",
    productList: [
      {
        description: "order to my products",
        name: req.user.name,
        price: Math.trunc(Math.round(totalCartPrice * 100)),
        productId: cart._id,
        quantity: 1,
      },
    ],
    reference: req.params.cartId,
    returnUrl: "https://natoursapp-lu63.onrender.com",
    userInfo: {
      userEmail: req.user.email,
      userId: req.user.id,
      userName: req.user.name,
    },
  };

  const publickey = process.env.OPAY_PUBLIC_KEY;
  const { data } = await axios.post(
    "https://sandboxapi.opaycheckout.com/api/v1/international/cashier/create",
    formData,
    {
      headers: {
        Authorization: `Bearer ${publickey}`,
        MerchantId: process.env.OPAY_MERCHANT_ID,
      },
    }
  );
  res.status(201).json({
    success: true,
    data,
  });
});

exports.opayWebhook = asyncHandler(async (req, res, next) => {
  const session = req.body;
  console.log("session :", session);

  const cart = await Cart.findById(session.reference);
  const { status } = req.body;

  if (status === "SUCCESS") {
    // Handle successful payment logic here (e.g., update database)
    res.status(200).json({ message: "Payment successful" });
  } else {
    res.status(400).json({ message: "Payment failed" });
  }

  //   const price = session.amount / 100;
  //   const user = await User.findOne({
  //     email: session.data.object.customer_email,
  //   });
  //   const shippingAddress = session.data.object.metadata.shipping_Address;

  //   const order = await Order.create({
  //     user: user._id,
  //     cartItems: cart.cartItems,
  //     shippingAddress,
  //     totalOrderPrice: price,
  //     isPaid: true,
  //     PaidAt: Date.now(),
  //     paymentMethod: "online",
  //   });
  //   if (order) {
  //     // eslint-disable-next-line arrow-body-style
  //     /*
  //     const bulkOpt = cart.cartItems.map((item) => {
  //       return {
  //         updateOne: {
  //           filter: { _id: item.product },
  //           update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
  //         },
  //       };
  //     });
  // */
  //     //await ProductModel.bulkWrite(bulkOpt, {});
  //     cart.cartItems.forEach(async (item) => {
  //       await ProductModel.findByIdAndUpdate(item.product, {
  //         $inc: { quantity: -item.quantity, sold: +item.quantity },
  //       });
  //     });
  //     //5-remove cart
  //     await Cart.deleteOne({ _id: cart._id });
  //   }
  // res
  //   .status(201)
  //   .json({ success: true, message: "order is created successfully" });
});
