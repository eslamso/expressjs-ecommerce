const brandModel = require("../models/brandModel");

const handler = require("./handlerFactory");

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
