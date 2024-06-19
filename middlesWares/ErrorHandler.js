const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") sendErrorDev(err, res);
  else sendErrorProduction(err, res);
};
const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    success: err.status,
    message: err.message,
    Error: err,
    stack: err.stack,
  });
};
const sendErrorProduction = (err, res) => {
  return res.status(err.statusCode).json({
    success: err.status,
    message: err.message,
  });
};
module.exports = globalErrorHandler;
