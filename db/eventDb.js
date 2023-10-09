const pool = require("../config");
const format = require("pg-format");

const createEventDb = async ({
  templateId,
  eventDate,
  eventName,
  eventDescription,
  venueName,
  venueAddress,
  userId,
}) => {
  const { rows: eventDetails } = await pool.query(
    "INSERT INTO event(template_id, event_date, event_name, event_description, venue_name, venue_address, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *; ",
    [
      templateId,
      eventDate,
      eventName,
      eventDescription,
      venueName,
      venueAddress,
      userId,
    ]
  );
  return eventDetails[0];
};

const createEventCustomDataDb = async (customValuesArray) => {
  const { rows: eventCustomData } = await pool.query(
    format(
      "INSERT INTO custom_data(item_name, item_styles, is_editable, item_value, item_type, event_id) VALUES %L returning *;",
      customValuesArray
    )
  );
  return eventCustomData;
};

const getSingleEventDb = async (eventId) => {
  const { rows: event } = await pool.query(
    "SELECT * ,(SELECT array_to_json(array_agg(row_to_json(template_alias))) AS template_data FROM (SELECT * FROM custom_data WHERE event_id = $1) template_alias) FROM event WHERE event_id = $1",
    [eventId]
  );
  return event[0];
};

const getCurrentUserEventsDb = async (userId) => {
  const { rows: events } = await pool.query(
    "SELECT event_id, event_date, event_name FROM event WHERE user_id = $1",
    [userId]
  );
  return events;
};

const getBasicEventInfoDb = async (eventId) => {
  const { rows: event } = await pool.query(
    "SELECT event_id, event_date, event_name FROM event WHERE event_id = $1",
    [eventId]
  );
  return event[0];
};

const enableCustomGuestsDb = async ({ eventId, customShareId }) => {
  const { rows: event } = await pool.query(
    "UPDATE event SET custom_share_id = $1 WHERE event_id = $2 returning custom_share_id",
    [customShareId, eventId]
  );
  return event[0];
};

module.exports = {
  createEventDb,
  createEventCustomDataDb,
  getSingleEventDb,
  getCurrentUserEventsDb,
  enableCustomGuestsDb,
  getBasicEventInfoDb,
};
