const dotenv = require("dotenv");
const dbConnetions = require("./config/dbConnection");
const morgan = require("morgan");
dotenv.config({ path: "./config.env" });
const app = require("./app");
//connecting dataBase
const DB_url = process.env.DATA_BASE.replace(
  "<PASSWORD>",
  process.env.DATA_BASE_PASSWORD
);
dbConnetions(DB_url);

const port = process.env.PORT || 3000;
// running express server
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
// handling un handled rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandled rejection Errors:"${err.name} |${err.message}`);
  server.close(() => {
    console.log("server Shutting Down ......");
    process.exit(1);
  });
});
