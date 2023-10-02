const pool = require("../config");

const addGuestDb = async ({
  eventId,
  guestName,
  guestEmail,
  invitedGuestNumber,
  isCustom,
  userId,
  isAnswered,
}) => {
  const { rows: guest } = await pool.query(
    "INSERT INTO guest(event_id, guest_name, is_custom, guest_email, invited_guest_number, user_id, is_answered) VALUES ($1, $2, $3, $4, $5, $6, $7) returning guest_id; ",
    [
      eventId,
      guestName,
      isCustom,
      guestEmail,
      invitedGuestNumber,
      userId,
      isAnswered,
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

module.exports = {
  addGuestDb,
  getEventGuestListDb,
};
