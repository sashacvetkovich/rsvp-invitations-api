const router = require("express").Router();
const authRouter = require("../routes/authRoutes");
const invitationRouter = require("../routes/invitationRoutes");
const eventRouter = require("../routes/eventRoutes");
const guestRouter = require("../routes/guestRoutes");
const usersRouter = require("../routes/usersRoutes");

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/invitations", invitationRouter);
router.use("/events", eventRouter);
router.use("/guest", guestRouter);

module.exports = router;
