require("dotenv").config();
require("express-async-errors");
const cors = require("cors");

// express
const express = require("express");
const app = express();

// rest of the packages
const cookieParser = require("cookie-parser");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//routes
const routes = require("./routes");

const whitelist = ["http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1", routes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

module.exports = app;