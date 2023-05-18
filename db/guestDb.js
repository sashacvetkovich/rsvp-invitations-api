const pool = require("../config");

const addGuestDb = async ({ eventId, guestName }) => {
  const { rows: guest } = await pool.query(
    "INSERT INTO guest(event_id, guest_name) VALUES ($1, $2) returning guest_id; ",
    [eventId, guestName]
  );
  return guest[0];
};

module.exports = {
  addGuestDb,
};
