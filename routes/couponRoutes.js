const express = require("express");
const couponController = require("../controllers/couponController");
const { protect, restrictTo } = require("../controllers/authController");

const router = express.Router();

//router.use("/:categoryId/subcategory", subcategoryRouter);
router.use(protect, restrictTo("admin", "manager"));
router
  .route("/")
  .post(couponController.createCoupon)
  .get(couponController.getAllCoupons);
router
  .route("/:id")
  .get(
    //1 rules,
    couponController.getCoupon
  )
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);
module.exports = router;
