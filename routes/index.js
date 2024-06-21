const router = require("express").Router();
const authRouter = require("../routes/authRoutes");
const userRouter = require("../routes/userRoutes");
const templateRouter = require("../routes/templateRoutes");
const eventRouter = require("../routes/eventRoutes");
const guestRouter = require("../routes/guestRoutes");
const uploadRouter = require("../routes/uploadRoutes");
const healthRouter = require("../routes/healthRoutes");

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/template", templateRouter);
router.use("/event", eventRouter);
router.use("/guest", guestRouter);
router.use("/uploads", uploadRouter);
router.use("/health", healthRouter);

module.exports = router;
