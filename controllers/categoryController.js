const CategoryModel = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");
const categoryModel = require("../models/categoryModel");
exports.createCategory = asyncHandler(async (req, res, next) => {
  const name = req.body.name;

  const newCategory = await CategoryModel.create(req.body);
  res.status(201).json({
    success: true,
    newCategory,
  });
});
exports.getAllCategories = asyncHandler(async (req, res, next) => {
  //console.log(process.env.NODE_ENV);
  const categories = await categoryModel.find();
  res.status(200).json({
    success: true,
    results: categories.length,
    categories,
  });
});
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);
  res.status(200).json({
    success: true,
    category,
  });
});
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
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await categoryModel.findByIdAndDelete(req.params.id);

  if (!category) {
    res
      .status(404)
      .json({ success: "fail", message: "cant find tour with this id " });
  } else
    res.status(204).json({
      success: true,
    });
});
