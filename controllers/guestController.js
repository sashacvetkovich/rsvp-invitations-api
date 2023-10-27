const { checkPermissions } = require("../utils");
const { StatusCodes } = require("http-status-codes");
const { getSingleEventService } = require("../services/eventService");
const { ErrorHandler } = require("../helpers/error");

const {
  addGuestService,
  addCustomGuestService,
  getEventGuestListService,
  getSingleGuestService,
  updateGuestAnswerService,
  updateGuestDataService,
  deleteGuestService,
} = require("../services/guestService");

const {
  updateGuestAnswerValidator,
  addCustomGuestValidator,
} = require("../validations/guestValidations");

const addGuest = async (req, res) => {
  const { eventId } = req.params;
  const { guestName, guestEmail, invitedGuestNumber } = req.body;

  if (!guestName || !eventId || !guestEmail || !invitedGuestNumber) {
    throw new ErrorHandler(StatusCodes.OK, `Please provide guest info`);
  }

  const event = await getSingleEventService(eventId);

  if (!event) {
    throw new ErrorHandler(StatusCodes.OK, `No event with id : ${eventId}`);
  }

  checkPermissions(req.user, event.user_id);

  const guest = await addGuestService({
    eventId,
    guestName,
    guestEmail,
    invitedGuestNumber,
    userId: req.user.userId,
    isCustom: false,
    isAnswered: false,
    isComing: false,
  });

  res
    .status(StatusCodes.OK)
    .json({ status: true, msg: `Added guest with id ${guest.guest_id}` });
};

const addCustomGuest = async (req, res) => {
  const { eventId, customShareId } = req.body;

  if (!eventId) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide valid guest info");
  }
  addCustomGuestValidator(req.body);

  const event = await getSingleEventService(eventId);

  if (!event || event.custom_share_id !== customShareId) {
    throw new ErrorHandler(
      StatusCodes.OK,
      "Custom guests option is not enabled"
    );
  }

  const guest = await addCustomGuestService({
    ...req.body,
    eventId,
    isCustom: true,
    isAnswered: true,
    isComing: true,
  });

  res
    .status(StatusCodes.OK)
    .json({ status: true, msg: `Added guest with id ${guest.guest_id}` });
};

const updateGuestData = async (req, res) => {
  const { id: guestId } = req.params;
  const { guestName, guestNumber } = req.body;

  if (!guestName || !guestNumber) {
    throw new ErrorHandler(StatusCodes.OK, `Please provide guest info`);
  }

  const guest = await getSingleGuestService(guestId);

  if (!guest) {
    throw new ErrorHandler(StatusCodes.OK, `No guest with id : ${guestId}`);
  }

  checkPermissions(req.user, Number(guest.user_id));

  const updatedGuest = await updateGuestDataService({
    guestName,
    guestNumber,
    guestId,
  });

  res
    .status(StatusCodes.OK)
    .json({ status: true, guestId: updatedGuest.user_id });
};

const getEventGuestList = async (req, res) => {
  const { eventId } = req.params;

  const { guestList, eventInfo } = await getEventGuestListService(eventId);

  if (!eventInfo) {
    throw new ErrorHandler(StatusCodes.OK, "Event is not fount");
  }
  checkPermissions(req.user, eventInfo.user_id);

  res.status(StatusCodes.OK).json({ status: true, guestList, eventInfo });
};

const getSingleGuest = async (req, res) => {
  const { id: guestId } = req.params;

  const guest = await getSingleGuestService(guestId);

  if (!guest) {
    throw new ErrorHandler(StatusCodes.OK, `No guest with id : ${guestId}`);
  }

  res.status(StatusCodes.OK).json({ guest });
};

const updateGuestAnswer = async (req, res) => {
  const { answerData, guestId } = req.body;

  if (!guestId) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide valid guest Id");
  }

  updateGuestAnswerValidator(answerData);

  const guest = await getSingleGuestService(guestId);

  if (!guest) {
    throw new ErrorHandler(StatusCodes.OK, `No guest with id : ${guestId}`);
  }

  const guestIdDb = await updateGuestAnswerService({ ...answerData, guestId });

  res.status(StatusCodes.OK).json({
    status: true,
    message: `Guest with id ${guestIdDb.user_id} info is updated`,
  });
};

const deleteGuest = async (req, res) => {
  const { id: guestId } = req.params;

  if (!guestId) {
    throw new ErrorHandler(StatusCodes.OK, "Please provide valid guest Id");
  }

  const guest = await getSingleGuestService(guestId);
  if (!guest) {
    throw new ErrorHandler(StatusCodes.OK, `No guest with id : ${guestId}`);
  }
  checkPermissions(req.user, Number(guest.user_id));

  await deleteGuestService(guestId);

  res.status(StatusCodes.OK).json({
    status: true,
    message: `Guest is successfully deleted`,
  });
};

module.exports = {
  addGuest,
  addCustomGuest,
  updateGuestData,
  getEventGuestList,
  getSingleGuest,
  updateGuestAnswer,
  deleteGuest,
};
