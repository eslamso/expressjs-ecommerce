const path = require("path");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
// eslint-disable-next-line import/no-extraneous-dependencies
const { rateLimit } = require("express-rate-limit");
// eslint-disable-next-line import/no-extraneous-dependencies
const hpp = require("hpp");
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
// const categoryRoute = require("./routes/categoryRoutes");
// const subCategoryRoute = require("./routes/subCategoryRoutes");
// const brandRoute = require("./routes/brandRoutes");
// const productRoute = require("./routes/productRoutes");
// const userRoute = require("./routes/userRoutes");
// const authRoute = require("./routes/authRoutes");
// const reviewRoute = require("./routes/reviewRoutes");
// const favoriteRoute = require("./routes/favoriteRoutes");
// const addressRoute = require("./routes/addressRoutes");
// const couponRoute = require("./routes/couponRoutes");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./middlesWares/ErrorHandler");
const mountRoutes = require("./routes");
const { stripeWebhook } = require("./controllers/orderController");
const { opayWebhook } = require("./controllers/opayOrderController");
//middlewares
app.use(cors());
app.options("*", cors()); // include before other routes
app.use(compression());

app.post(
  "/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

app.post(
  "/opay-webhook",
  express.raw({ type: "application/json" }),
  opayWebhook
);

app.use(express.json({ limit: "20kb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// to send convert to json object

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
});
app.use(limiter);
app.use(hpp()); // <- THIS IS THE NEW LINE

// mount Routes
mountRoutes(app);
// app.use("/api/v1/category", categoryRoute);
// app.use("/api/v1/subCategory", subCategoryRoute);
// app.use("/api/v1/brand", brandRoute);
// app.use("/api/v1/product", productRoute);
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/auth", authRoute);
// app.use("/api/v1/review", reviewRoute);
// app.use("/api/v1/fav", favoriteRoute);
// app.use("/api/v1/address", addressRoute);
// app.use("/api/v1/coupon", couponRoute);

// unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`cant find route in the server :${req.originalUrl}`, 404));
});
// global Error Handler
app.use(globalErrorHandler);
module.exports = app;
