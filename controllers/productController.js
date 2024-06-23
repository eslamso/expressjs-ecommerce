const productModel = require("../models/productModel");

const handler = require("./handlerFactory");

// @desc create product
// @route POST /api/v1/product
// @access Privacy

exports.createProduct = handler.createOne(productModel);

// @desc getAllProducts
// @route GET /api/v1/product
// @access Public

exports.getAllProducts = handler.getAll(productModel, "products");
// @desc get product
// @route GET /api/v1/product/:id
// @access Public
exports.getProduct = handler.getOne(productModel);

// @desc update product
// @route PUT /api/v1/product/:id
// @access Privacy

exports.updateProduct = handler.updateOne(productModel);
// @desc delete product
// @route /api/v1/product/:id
// @access Privacy

exports.deleteProduct = handler.deleteOne(productModel);
