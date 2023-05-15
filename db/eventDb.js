const pool = require("../config");
const format = require("pg-format");

const createEventDb = async ({
  templateId: template_id,
  eventDate: event_date,
  eventName: event_name,
  eventDescription: event_description,
  venueName: venue_name,
  venueAddress: venue_address,
}) => {
  const { rows: eventDetails } = await pool.query(
    "INSERT INTO event(template_id, event_date, event_name, event_description, venue_name, venue_address) VALUES ($1, $2, $3, $4, $5, $6) returning *; ",
    [
      template_id,
      event_date,
      event_name,
      event_description,
      venue_name,
      venue_address,
    ]
  );
  return eventDetails[0];
};

const createEventCustomDataDb = async (customValuesArray) => {
  const { rows: eventCustomData } = await pool.query(
    format(
      "INSERT INTO custom_data(item_name, item_styles, is_editable, public_name, item_type, item_value, event_id) VALUES %L returning *;",
      customValuesArray
    )
  );
  return eventCustomData;
};

module.exports = {
  createEventDb,
  createEventCustomDataDb,
};
