require("dotenv").config();
require("express-async-errors");
const cors = require("cors");

// express
const express = require("express");
const app = express();

const fileUpload = require('express-fileupload');

// cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// rest of the packages
const cookieParser = require("cookie-parser");

// database
const connectDB = require("./db/connect");

// routers
const authRouter = require("./routes/authRoutes");
const invitationRouter = require("./routes/invitationRoutes");
const eventRouter = require("./routes/eventRoutes");
const guestRouter = require("./routes/guestRoutes");
const uploadRouter = require("./routes/uploadRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

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
app.use(fileUpload({ useTempFiles: true }));
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/invitations", invitationRouter);
app.use("/api/v1/events", eventRouter);
app.use("/api/v1/guest", guestRouter);
app.use("/api/v1/upload", uploadRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
