const mongoose = require("mongoose");

//connecting dataBase

const dbConnection = (DB_url) => {
  mongoose.connect(DB_url).then((DB) => {
    console.log(`data base connect does Successfully:${DB.connection.host}`);
    //console.log(DB);
  });
};
module.exports = dbConnection;
