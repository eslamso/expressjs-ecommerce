const express = require("express");
const cartController = require("../controllers/cartController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

//router.use("/:categoryId/subcategory", subcategoryRouter);
router.use(protect, restrictTo("user"));
router
  .route("/")
  .post(cartController.addProductToCart)
  .get(cartController.getMyCart)
  .put(cartController.clearMyCart)
  .delete(cartController.removeMyCart);
router.route("/:id").put(cartController.removeProductFromMyCart);
router
  .route("/update-Quantity/:itemId")
  .put(cartController.updateProductQuantityCart);
router.post("/apply-coupon", cartController.applyCoupon);
router.delete("/removeCoupon", cartController.removeCouponFromMyCart);

module.exports = router;
