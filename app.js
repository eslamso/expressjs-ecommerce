const express = require("express");
const morgan = require("morgan");
const app = express();
const categoryRoute = require("./routes/categoryRoutes");
//middleswares

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.use(express.json());

// mount Routes
app.use("/api/v1/category", categoryRoute);

module.exports = app;
