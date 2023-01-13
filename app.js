require("dotenv").config();
require("express-async-errors");

// express
const express = require("express");
const app = express();
// database
const connectDB = require("./db/connect");
// routers
const authRouter = require("./routes/authRoutes");
const invitationRouter = require('./routes/invitationRoutes');
const eventRouter = require('./routes/eventRoutes');
const guestRouter = require('./routes/guestRoutes');

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use('/api/v1/invitations', invitationRouter);
app.use('/api/v1/events', eventRouter);
app.use('/api/v1/guest', guestRouter);

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
