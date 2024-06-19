const asyncHandler = require("express-async-handler");
const subCategoryModel = require("../models/subcategoryModel");
const AppError = require("../utils/appError");

// nested routes
exports.setCategoryToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

exports.createFilterObject = (req, res, next) => {
  let filter = {};
  if (req.params.categoryId) filter = { category: req.params.categoryId };
  req.filterObj = filter;
  next();
};

// @desc createSubCategory
// @route POST /api/v1/subcategory
// @access Privacy

exports.createSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const subCategory = await subCategoryModel.create({ name, category });
  res.status(201).json({
    success: true,
    subCategory,
  });
});

// @desc getAllSubCategories
// @route GET /api/v1/category
// @access Public

exports.getAllSubCategories = asyncHandler(async (req, res, next) => {
  //console.log(process.env.NODE_ENV);
  const subCategories = await subCategoryModel.find(req.filterObj);
  res.status(200).json({
    success: true,
    results: subCategories.length,
    subCategories,
  });
});
// @desc get subcategory
// @route GET /api/v1/subCategory/:id
// @access Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subCategory = await subCategoryModel.findById(id);
  if (!subCategory) {
    return next(new AppError("not found subCategory", 404));
  }
  res.status(200).json({
    success: true,
    subCategory,
  });
});

// @desc update subcategory
// @route PUT /api/v1/subCategory/:id
// @access Privacy

exports.updateSubCategory = asyncHandler(async (req, res, next) => {
  const { name, category } = req.body;
  const subCategory = await subCategoryModel.findOneAndUpdate(
    { _id: req.params.id },
    { name, category },
    { new: true }
  );
  if (!subCategory) {
    return next(new AppError("there is no subcategory that id ", 404));
  }
  res.status(200).json({
    success: true,
    subCategory,
  });
});

// @desc delete subcategory
// @route /api/v1/subcategory/:id
// @access Privacy

exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
  const subCategory = await subCategoryModel.findByIdAndDelete(req.params.id);

  if (!subCategory) {
    res
      .status(404)
      .json({ success: "fail", message: "cant find category with this id " });
  } else
    res.status(204).json({
      success: true,
    });
});
