const sharp = require("sharp");

const expressAsyncHandler = require("express-async-handler");

const categoryModel = require("../models/categoryModel");

const handler = require("./handlerFactory");
const { uploadSingleImage } = require("../middlesWares/uploadImageMiddleWare");

// @desc create category
// @route POST /api/v1/category
// @access Privacy
exports.uploadImage = uploadSingleImage("image");
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  const filename = `category-${Math.round(Math.random() * 1e9)}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(800, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/categories/${filename}`);
  req.body.image = filename;
  next();
});
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
