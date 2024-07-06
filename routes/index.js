const categoryRoute = require("./categoryRoutes");
const subCategoryRoute = require("./subCategoryRoutes");
const brandRoute = require("./brandRoutes");
const productRoute = require("./productRoutes");
const userRoute = require("./userRoutes");
const authRoute = require("./authRoutes");
const reviewRoute = require("./reviewRoutes");
const favoriteRoute = require("./favoriteRoutes");
const addressRoute = require("./addressRoutes");
const couponRoute = require("./couponRoutes");
const cartRoute = require("./cartRoutes");

const mountRoutes = (app) => {
  app.use("/api/v1/category", categoryRoute);
  app.use("/api/v1/subCategory", subCategoryRoute);
  app.use("/api/v1/brand", brandRoute);
  app.use("/api/v1/product", productRoute);
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/auth", authRoute);
  app.use("/api/v1/review", reviewRoute);
  app.use("/api/v1/fav", favoriteRoute);
  app.use("/api/v1/address", addressRoute);
  app.use("/api/v1/coupon", couponRoute);
  app.use("/api/v1/cart", cartRoute);
};

module.exports = mountRoutes;
