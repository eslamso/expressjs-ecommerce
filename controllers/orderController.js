const stripe = require("stripe")(process.env.STRIPE_SECRET);

const asyncHandler = require("express-async-handler");

const AppError = require("../utils/appError");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const ProductModel = require("../models/productModel");
const handler = require("./handlerFactory");

const stripeCardOrder = async (session) => {};

exports.createCashPayment = asyncHandler(async (req, res, next) => {
  //1- get cart with cart Id
  //app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new AppError("cart not found", 404));
  }
  //2-get price from cart and check if there is a coupon applied or not
  const cartPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;
  const totalCartPrice = cartPrice + taxPrice + shippingPrice;
  //3-create order
  const order = await Order.create({
    user: req.user.id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice: totalCartPrice,
  });
  //4- update product quantity and sold
  if (order) {
    // eslint-disable-next-line arrow-body-style
    /*
    const bulkOpt = cart.cartItems.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product },
          update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
        },
      };
    });
*/
    //await ProductModel.bulkWrite(bulkOpt, {});
    cart.cartItems.forEach(async (item) => {
      await ProductModel.findByIdAndUpdate(item.product, {
        $inc: { quantity: -item.quantity, sold: +item.quantity },
      });
    });
    //5-remove cart
    await Cart.deleteOne({ _id: req.params.cartId });
  }
  res.status(201).json({
    success: true,
    message: "order created successfully",
    order,
  });
});

exports.findAllFilterObj = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user.id };
  next();
});

exports.getAllOrders = handler.getAll(Order);
exports.getOneOrder = handler.getOne(Order);

// can be used when the delivery deliver order to customer and checking barcode
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("there is no order with that id", 404));
  }
  order.isPaid = true;
  order.PaidAt = Date.now();
  await order.save();
  res.status(200).json({
    success: true,
    order,
  });
});

exports.updateOrderToDeliver = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("there is no order with that id", 404));
  }
  order.isDelivered = true;
  order.deliverAt = Date.now();
  await order.save();
  res.status(200).json({
    success: true,
    order,
  });
});

exports.stripeCheckOutSession = asyncHandler(async (req, res, next) => {
  //1- get cart with cart Id
  //app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(new AppError("cart not found", 404));
  }
  //2-get price from cart and check if there is a coupon applied or not
  const cartPrice = cart.totalCartPriceAfterDiscount
    ? cart.totalCartPriceAfterDiscount
    : cart.totalCartPrice;
  const totalCartPrice = cartPrice + taxPrice + shippingPrice;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          unit_amount: Math.round(totalCartPrice * 100),
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/order`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });
  res.status(201).json({
    success: true,
    session,
  });
});

exports.stripeWebhook = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(session);
  }
  res.status(200).json({ received: true });
});
