const express = require("express");
const { protect, restrictTo } = require("../controllers/authController");
const {
  createCashPayment,
  getAllOrders,
  getOneOrder,
  findAllFilterObj,
  updateOrderToPaid,
  updateOrderToDeliver,
  stripeCheckOutSession,
} = require("../controllers/orderController");

const router = express.Router();
router.use(protect);
router.route("/:cartId").post(restrictTo("user"), createCashPayment);
router.route("/").get(findAllFilterObj, getAllOrders);
router.route("/:id").get(getOneOrder);
router.route("/:id/pay").put(restrictTo("admin", "manager"), updateOrderToPaid);
router
  .route("/:id/deliver")
  .put(restrictTo("admin", "manager"), updateOrderToDeliver);
router
  .route("/stripe-checkout-session/:cartId")
  .get(restrictTo("user"), stripeCheckOutSession);

module.exports = router;
