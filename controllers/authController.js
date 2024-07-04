const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const createToken = require("../utils/create-JWT");

// @desc sign user
// @route POST /api/v1/auth
// @access Public
exports.signUp = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name: name,
    email: email,
    password: password,
  });
  const token = createToken(user._id);

  res.status(201).json({
    success: true,
    user,
    token,
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError("email or password is incorrect", 401));
  }
  const isCorrect = await user.correctPassword(password, user.password);
  if (!isCorrect) {
    return next(new AppError("email or password is incorrect", 401));
  }
  const token = createToken(user._id);
  // if (!user.active) {
  //   return next(new AppError("User is not active", 403));
  // }
  res.status(200).json({
    success: true,
    user,
    token,
  });
});
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError(
        "you are not logged in please login to access this route",
        401
      )
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new AppError("user belong to that token does not exist", 401));
  }

  if (user.passwordChangedAt) {
    const passChangedAtTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passChangedAtTimeStamp > decoded.iat) {
      return next(new AppError("password is changed please login again", 401));
    }
  }
  req.user = user;
  next();
});

exports.restrictTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you do not have right to access this route ", 403)
      );
    }
    next();
  });

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  // check if user found with this email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("no user found with this email", 404));
  }
  // generate random code used one time only
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  // save code to user
  user.passwordResetCode = hashedCode;
  user.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  const message = `hi ${user.name} \n
  your password reset code is valid for (10 min) \n
  ${resetCode}\n
  if you did not request for password reset please ignore this email`;
  console.log(message);

  try {
    await sendEmail({
      email: user.email,
      subject: "password reset code",
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    await user.save();
    return next("there is a problem when sending email please try again", 500);
  }

  res.status(200).json({
    success: true,
    message: "reset code is sent to your email",
  });
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.code)
    .digest("hex");
  const user = await User.findOne({
    passwordResetCode: hashedCode,
    passwordResetCodeExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("invalid or expired code", 400));
  }
  user.passwordResetCodeVerified = true;
  await user.save();
  res.status(200).json({
    success: true,
    message: "code verified",
    verifyToken: user.passwordResetCode,
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    passwordResetCode: req.params.token,
    passwordResetCodeVerified: true,
  });
  if (!user) {
    return next(
      new AppError(
        "invalid or expired code,please check mail to see what is missed",
        400
      )
    );
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  user.passwordResetCodeVerified = undefined;

  await user.save();
  const token = createToken(user._id);

  res.status(200).json({
    success: true,
    message: "password reset successfully",
    token,
  });
});
