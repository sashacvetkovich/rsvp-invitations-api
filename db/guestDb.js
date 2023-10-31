const pool = require("../config");

const addGuestDb = async ({
  eventId,
  guestName,
  guestEmail,
  invitedGuestNumber,
  isCustom,
  userId,
  isAnswered,
  guestId,
  isComing,
}) => {
  const { rows: guest } = await pool.query(
    "INSERT INTO guest(event_id, guest_name, is_custom, guest_email, invited_guest_number, user_id, is_answered, guest_id, is_coming) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning guest_id; ",
    [
      eventId,
      guestName,
      isCustom,
      guestEmail,
      invitedGuestNumber,
      userId,
      isAnswered,
      guestId,
      isComing,
    ]
  );
  return guest[0];
};

const addCustomGuestDb = async ({
  eventId,
  guestName,
  isCustom,
  guestEmail = "",
  guestNumber,
  guestComment = "",
  isAnswered,
  isComing,
  guestId,
}) => {
  const { rows: guest } = await pool.query(
    "INSERT INTO guest(event_id, guest_name, is_custom, guest_email, invited_guest_number, guest_number, guest_comment, is_answered, is_coming, guest_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) returning guest_id; ",
    [
      eventId,
      guestName,
      isCustom,
      guestEmail,
      guestNumber,
      guestNumber,
      guestComment,
      isAnswered,
      isComing,
      guestId,
    ]
  );
  return guest[0];
};

const getEventGuestListDb = async (eventId) => {
  const { rows: guest } = await pool.query(
    "SELECT * FROM guest WHERE event_id = $1",
    [eventId]
  );
  return guest;
};

const getSingleGuestDb = async (guestId) => {
  const { rows: guest } = await pool.query(
    "SELECT * FROM guest WHERE guest_id = $1",
    [guestId]
  );
  return guest[0];
};

const updateGuestAnswerDb = async ({
  guestComment,
  guestNumber,
  isComing,
  guestId,
}) => {
  const { rows: guest } = await pool.query(
    `UPDATE guest SET guest_comment = $1, guest_number=$2, is_coming=$3, is_answered=true WHERE guest_id = $4 returning user_id`,
    [guestComment, guestNumber, isComing, guestId]
  );

  return guest[0];
};

const updateGuestDataDb = async ({ guestName, guestNumber, guestId }) => {
  const { rows: guest } = await pool.query(
    `UPDATE guest SET guest_name = $1, invited_guest_number=$2 WHERE guest_id = $3 returning user_id`,
    [guestName, guestNumber, guestId]
  );

  return guest[0];
};

const deleteGuestDb = async (guestId) => {
  const { rows: guest } = await pool.query(
    `DELETE FROM guest WHERE guest_id = $1 returning *`,
    [guestId]
  );

  return guest[0];
};

module.exports = {
  addGuestDb,
  getEventGuestListDb,
  updateGuestAnswerDb,
  getSingleGuestDb,
  updateGuestDataDb,
  addCustomGuestDb,
  deleteGuestDb
};
