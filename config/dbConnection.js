const mongoose = require("mongoose");

//connecting dataBase

const dbConnection = (dBUrl) => {
  mongoose.connect(dBUrl).then(
    (DB) => {
      console.log(`data base connect does Successfully:${DB.connection.host}`);
      //console.log(DB);
    },
    { useNewUrlParser: true, useUnifiedTopology: true }
  );
};

module.exports = dbConnection;
