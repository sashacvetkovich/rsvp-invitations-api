require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const { corsOptions } = require("./config/index");
// express
const express = require("express");
const app = express();

// rest of the packages
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

// cloudinary
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//routes
const routes = require("./routes");

app.use(cors(corsOptions));
app.use(fileUpload({ useTempFiles: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", routes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;
