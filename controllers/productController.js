const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const productModel = require("../models/productModel");
const AppError = require("../utils/appError");

// @desc create product
// @route POST /api/v1/product
// @access Privacy

exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.slug = slugify(req.body.title, { lower: true });
  const newProduct = await productModel.create(req.body);
  res.status(201).json({
    success: true,
    newProduct,
  });
});

// @desc getAllProducts
// @route GET /api/v1/product
// @access Public

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  //1) filtering
  const queryStringObj = { ...req.query };
  const exitingFields = ["page", "limit", "sort", "fields"];
  exitingFields.forEach((field) => delete queryStringObj[field]);
  console.log(queryStringObj);
  // applying filter using [gte, lte, gt, lt, ne]
  let queryStr = JSON.stringify(queryStringObj);
  queryStr = queryStr.replace(
    /\b(gt|lt|gte|lte|ne)\b/g,
    (match) => `$${match}`
  );
  console.log(queryStr);
  console.log(JSON.parse(queryStr));

  // 2)building query
  const mongooseQuery = productModel
    .find(JSON.parse(queryStr))
    .populate({ path: "category", select: "name -_id" });
  // 3) consuming query
  const products = await mongooseQuery;
  res.status(200).json({
    success: true,
    results: products.length,
    products,
  });
});
// @desc get product
// @route GET /api/v1/product/:id
// @access Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await productModel
    .findById(id)
    .populate({ path: "category", select: "name -_id" });
  if (!product) {
    return next(new AppError("not found product", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

// @desc update product
// @route PUT /api/v1/product/:id
// @access Privacy

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) req.body.slug = slugify(req.body.title, { lower: true });

  const product = await productModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

// @desc delete product
// @route /api/v1/product/:id
// @access Privacy

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await productModel.findByIdAndDelete(req.params.id);

  if (!product) {
    res
      .status(404)
      .json({ success: "fail", message: "cant find product with this id " });
  } else
    res.status(204).json({
      success: true,
    });
});
