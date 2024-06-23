const categoryModel = require("../models/categoryModel");

const handler = require("./handlerFactory");

// @desc create category
// @route POST /api/v1/category
// @access Privacy

exports.createCategory = handler.createOne(categoryModel);

// @desc getAllCategories
// @route GET /api/v1/category
// @access Public

exports.getAllCategories = handler.getAll(categoryModel, "categories");
// @desc get category
// @route GET /api/v1/category/:id
// @access Public
exports.getCategory = handler.getOne(categoryModel);

// @desc update category
// @route PUT /api/v1/category/:id
// @access Privacy

exports.updateCategory = handler.updateOne(categoryModel);

// @desc delete category
// @route /api/v1/category/:id
// @access Privacy

exports.deleteCategory = handler.deleteOne(categoryModel);
