const pool = require("../config");

const addGuestDb = async ({
  eventId,
  guestName,
  guestComment,
  guestNumber,
}) => {
  const { rows: guest } = await pool.query(
    "INSERT INTO guest(event_id, guest_name, guest_comment, guest_number) VALUES ($1, $2, $3, $4) returning guest_id; ",
    [eventId, guestName, guestComment, guestNumber]
  );
  return guest[0];
};

module.exports = {
  addGuestDb,
};
