const sharp = require("sharp");
const bcrypt = require("bcryptjs");

const expressAsyncHandler = require("express-async-handler");
const asyncHandler = require("express-async-handler");
const AppError = require("../utils/appError");
const handler = require("./handlerFactory");
const { uploadSingleImage } = require("../middlesWares/uploadImageMiddleWare");
const createToken = require("../utils/create-JWT");

const User = require("../models/userModel");

exports.uploadImage = uploadSingleImage("profileImg");
exports.resizeImage = expressAsyncHandler(async (req, res, next) => {
  const filename = `user-${Math.round(Math.random() * 1e9)}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(800, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);
    req.body.image = filename;
  }
  next();
});

// @desc create user
// @route POST /api/v1/user
// @access Private

exports.createUser = handler.createOne(User);
// @desc getAllUsers
// @route GET /api/v1/Users
// @access private

exports.getAllUsers = handler.getAll(User, "Users");
// @desc get user
// @route GET /api/v1/user/:id
// @access Private
exports.getUser = handler.getOne(User);
// @desc update user
// @route PUT /api/v1/user/:id
// @access Privacy

exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password, role, profileImg } = req.body;
  const doc = await User.findOneAndUpdate(
    { _id: id },
    {
      name: name,
      email: email,
      password: password,
      role: role,
      profileImg: profileImg,
    },
    {
      new: true,
    }
  );
  if (!doc) {
    return new AppError("No document found with that ID", 404);
  }
  res.status(200).json({
    success: true,
    doc,
  });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { newPassword } = req.body;
  const doc = await User.findOneAndUpdate(
    { _id: id },
    {
      password: await bcrypt.hash(newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  if (!doc) {
    return new AppError("No document found with that ID", 404);
  }
  res.status(200).json({
    success: true,
    doc,
  });
});

// @desc delete user
// @route /api/v1/user/:id
// @access Privacy

exports.deleteUser = handler.deleteOne(User);
exports.getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.updateMyPassword = asyncHandler(async (req, res, next) => {
  const { newPassword } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    {
      password: await bcrypt.hash(newPassword, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );
  const token = createToken(user._id);
  res.status(200).json({
    success: true,
    user,
    token,
  });
});

exports.updateMe = asyncHandler(async (req, res, next) => {
  const { name, email, phone } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: req.user.id },
    {
      name: name,
      email: email,
      phone: phone,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    user,
  });
});

exports.deleteMe = asyncHandler(async (req, res, next) => {
  await User.findOneAndUpdate(
    { _id: req.user.id },
    { active: false, expireAt: Date.now() },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message:
      "you account is deactivated for 30 day after that time it will be removed permanently",
  });
});
