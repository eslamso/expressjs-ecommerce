const sharp = require("sharp");

const expressAsyncHandler = require("express-async-handler");

const handler = require("./handlerFactory");
const { uploadImages } = require("../middlesWares/uploadImageMiddleWare");
const productModel = require("../models/productModel");

exports.uploadImage = uploadImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 8 },
]);
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    console.log("req.files", req.files.imageCover[0]);
    const imageCoverName = `product-${Math.round(Math.random() * 1e9)}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(800, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverName}`);
    req.body.imageCover = imageCoverName;
  }
  if (req.files.images) {
    req.body.images = [];
    req.files.images.forEach(async (element, index) => {
      const productImageName = `product-${Math.round(Math.random() * 1e9)}-${Date.now()}-(${index + 1}).jpeg`;
      await sharp(element.buffer)
        .resize(800, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/products/${productImageName}`);
      req.body.images.push(productImageName);
    });
  }
  next();
});
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
// reviews refer to virtual populate on product model
exports.getProduct = handler.getOne(productModel, "reviews");

// @desc update product
// @route PUT /api/v1/product/:id
// @access Privacy

exports.updateProduct = handler.updateOne(productModel);
// @desc delete product
// @route /api/v1/product/:id
// @access Privacy

exports.deleteProduct = handler.deleteOne(productModel);
