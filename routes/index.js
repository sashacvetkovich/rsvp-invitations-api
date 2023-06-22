const router = require("express").Router();
const authRouter = require("../routes/authRoutes");
const templateRouter = require("../routes/templateRoutes");
const eventRouter = require("../routes/eventRoutes");
const guestRouter = require("../routes/guestRoutes");
const uploadRouter = require("../routes/uploadRoutes");

router.use("/auth", authRouter);
router.use("/template", templateRouter);
router.use("/event", eventRouter);
router.use("/guest", guestRouter);
router.use("/uploads", uploadRouter);

module.exports = router;
