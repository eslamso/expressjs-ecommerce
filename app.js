const express = require("express");

const morgan = require("morgan");

const app = express();
const categoryRoute = require("./routes/categoryRoutes");
const subCategoryRoute = require("./routes/subCategoryRoutes");
const brandRoute = require("./routes/brandRoutes");
const productRoute = require("./routes/productRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./middlesWares/ErrorHandler");
//middlewares

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
// to send convert to json object
app.use(express.json());

// mount Routes
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/subCategory", subCategoryRoute);
app.use("/api/v1/brand", brandRoute);
app.use("/api/v1/product", productRoute);

// unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`cant find route in the server :${req.originalUrl}`, 404));
});
// global Error Handler
app.use(globalErrorHandler);
module.exports = app;
