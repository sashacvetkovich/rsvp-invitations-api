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
}) => {
  const { rows: guest } = await pool.query(
    "INSERT INTO guest(event_id, guest_name, is_custom, guest_email, invited_guest_number, user_id, is_answered, guest_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) returning guest_id; ",
    [
      eventId,
      guestName,
      isCustom,
      guestEmail,
      invitedGuestNumber,
      userId,
      isAnswered,
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
  isComming,
  guestId,
}) => {
  const { rows: guest } = await pool.query(
    `UPDATE guest SET guest_comment = $1, guest_number=$2, is_coming=$3, is_answered=true WHERE guest_id = $4 returning user_id`,
    [guestComment, guestNumber, isComming, guestId]
  );

  return guest[0];
};

module.exports = {
  addGuestDb,
  getEventGuestListDb,
  updateGuestAnswerDb,
  getSingleGuestDb
};
