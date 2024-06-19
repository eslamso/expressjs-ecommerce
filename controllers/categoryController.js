const asyncHandler = require("express-async-handler");
const CategoryModel = require("../models/categoryModel");
const categoryModel = require("../models/categoryModel");
const AppError = require("../utils/appError");

// @desc create category
// @route POST /api/v1/category
// @access Privacy

exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  const newCategory = await CategoryModel.create({ name });
  res.status(201).json({
    success: true,
    newCategory,
  });
});

// @desc getAllCategories
// @route GET /api/v1/category
// @access Public

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  //console.log(process.env.NODE_ENV);
  const categories = await categoryModel.find();
  res.status(200).json({
    success: true,
    results: categories.length,
    categories,
  });
});
// @desc get category
// @route GET /api/v1/category/:id
// @access Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);
  if (!category) {
    return next(new AppError("not found category", 404));
  }
  res.status(200).json({
    success: true,
    category,
  });
});

// @desc update category
// @route PUT /api/v1/category/:id
// @access Privacy

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { new: true }
  );
  res.status(200).json({
    success: true,
    category,
  });
});

// @desc delete category
// @route /api/v1/category/:id
// @access Privacy

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findByIdAndDelete(req.params.id);

  if (!category) {
    res
      .status(404)
      .json({ success: "fail", message: "cant find category with this id " });
  } else
    res.status(204).json({
      success: true,
    });
});
