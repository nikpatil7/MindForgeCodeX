const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(
      process.env.MONGODB_URI
      //   , {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      // }
    )
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log("Database connection error: ");
      console.log(err);
      process.exit(1);
    });
};
