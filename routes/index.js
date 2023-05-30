const router = require("express").Router();
const authRouter = require("../routes/authRoutes");
const templateRouter = require("../routes/templateRoutes");
const eventRouter = require("../routes/eventRoutes");
const guestRouter = require("../routes/guestRoutes");

router.use("/auth", authRouter);
router.use("/template", templateRouter);
router.use("/event", eventRouter);
router.use("/guest", guestRouter);

module.exports = router;
