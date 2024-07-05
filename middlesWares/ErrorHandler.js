const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: err.status,
    message: err.message,
    Error: err,
    stack: err.stack,
  });
};
const sendErrorProduction = (err, res) => {
  res.status(err.statusCode).json({
    success: err.status,
    message: err.message,
  });
};
const handleInvalidSignature = () =>
  new AppError("in invalid token ,please login again", 401);
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") sendErrorDev(err, res);
  else {
    if (err.name === "JsonWebTokenError") err = handleInvalidSignature();
    sendErrorProduction(err, res);
  }
};
module.exports = globalErrorHandler;
