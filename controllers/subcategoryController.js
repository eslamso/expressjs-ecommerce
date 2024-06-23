const subCategoryModel = require("../models/subcategoryModel");
const handler = require("./handlerFactory");

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

exports.createSubCategory = handler.createOne(subCategoryModel);
// @desc getAllSubCategories
// @route GET /api/v1/category
// @access Public

exports.getAllSubCategories = handler.getAll(subCategoryModel, "subcategories");
// @desc get subcategory
// @route GET /api/v1/subCategory/:id
// @access Public
exports.getSubCategory = handler.getOne(subCategoryModel);

// @desc update subcategory
// @route PUT /api/v1/subCategory/:id
// @access Privacy

exports.updateSubCategory = handler.updateOne(subCategoryModel);

// @desc delete subcategory
// @route /api/v1/subcategory/:id
// @access Privacy

exports.deleteSubCategory = handler.deleteOne(subCategoryModel);
