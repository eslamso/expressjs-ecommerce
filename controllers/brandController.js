const asyncHandler = require("express-async-handler");
const brandModel = require("../models/brandModel");
const AppError = require("../utils/appError");
const { default: slugify } = require("slugify");

// @desc create brand
// @route POST /api/v1/brand
// @access Privacy

exports.createBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const newBrand = await brandModel.create({ name });
  res.status(201).json({
    success: true,
    newBrand,
  });
});
// @desc getAllBrands
// @route GET /api/v1/brands
// @access Public

exports.getAllBrands = asyncHandler(async (req, res, next) => {
  //console.log(process.env.NODE_ENV);
  const brands = await brandModel.find();
  res.status(200).json({
    success: true,
    results: brands.length,
    brands,
  });
});
// @desc get brand
// @route GET /api/v1/brand/:id
// @access Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.findById(req.params.id);
  if (!brand) {
    return next(new AppError("not found brand", 404));
  }
  res.status(200).json({
    success: true,
    brand,
  });
});

// @desc update brand
// @route PUT /api/v1/brand/:id
// @access Privacy

exports.updateBrand = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );
  if (!brand) {
    return next(new AppError("not found brand", 404));
  }
  res.status(200).json({
    success: true,
    brand,
  });
});

// @desc delete brand
// @route /api/v1/brand/:id
// @access Privacy

exports.deleteBrand = asyncHandler(async (req, res, next) => {
  const brand = await brandModel.findByIdAndDelete(req.params.id);

  if (!brand) {
    res
      .status(404)
      .json({ success: "fail", message: "cant find brand with this id " });
  } else
    res.status(204).json({
      success: true,
    });
});
