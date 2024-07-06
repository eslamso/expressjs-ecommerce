const handler = require("./handlerFactory");
const Coupon = require("../models/couponModel");

// @desc create brand
// @route POST /api/v1/brand
// @access Privacy

exports.createCoupon = handler.createOne(Coupon);
// @desc getAllBrands
// @route GET /api/v1/brands
// @access Public

exports.getAllCoupons = handler.getAll(Coupon, "coupons");
// @desc get brand
// @route GET /api/v1/brand/:id
// @access Public
exports.getCoupon = handler.getOne(Coupon);
// @desc update brand
// @route PUT /api/v1/brand/:id
// @access Privacy

exports.updateCoupon = handler.updateOne(Coupon);

// @desc delete brand
// @route /api/v1/brand/:id
// @access Privacy

exports.deleteCoupon = handler.deleteOne(Coupon);
