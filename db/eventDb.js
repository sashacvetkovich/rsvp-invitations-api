const pool = require("../config");

const createEventDb = async ({
  template_id,
  event_date,
  event_name,
  event_description,
  venue_name,
  venue_address,
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
  return eventDetails;
};

const createEventCustomDataDb = async ({
  event_id,
  item_name,
  item_styles,
  is_editable,
  public_name,
  item_type,
  item_value,
}) => {
  const { rows: eventCustomData } = await pool.query(
    "INSERT INTO custom_data(event_id, item_name, item_styles, is_editable, public_name, item_type, item_value) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *; ",
    [
      event_id,
      item_name,
      item_styles,
      is_editable,
      public_name,
      item_type,
      item_value,
    ]
  );
  return eventCustomData;
};

module.exports = {
  createEventDb,
  createEventCustomDataDb,
};
