const sharp = require("sharp");

const expressAsyncHandler = require("express-async-handler");

const handler = require("./handlerFactory");
const { uploadSingleImage } = require("../middlesWares/uploadImageMiddleWare");
const brandModel = require("../models/brandModel");

exports.uploadImage = uploadSingleImage("image");
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  const filename = `brand-${Math.round(Math.random() * 1e9)}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(800, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`);
  req.body.image = filename;
  next();
});

// @desc create brand
// @route POST /api/v1/brand
// @access Privacy

exports.createBrand = handler.createOne(brandModel);
// @desc getAllBrands
// @route GET /api/v1/brands
// @access Public

exports.getAllBrands = handler.getAll(brandModel, "brands");
// @desc get brand
// @route GET /api/v1/brand/:id
// @access Public
exports.getBrand = handler.getOne(brandModel);
// @desc update brand
// @route PUT /api/v1/brand/:id
// @access Privacy

exports.updateBrand = handler.updateOne(brandModel);

// @desc delete brand
// @route /api/v1/brand/:id
// @access Privacy

exports.deleteBrand = handler.deleteOne(brandModel);
