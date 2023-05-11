const pool = require("../config");

const createInvitationDb = async ({
  category,
  preview_image,
  invitation_name,
  background_image,
}) => {
  const { rows: invitaion } = await pool.query(
    "INSERT INTO invitation_template(category, preview_image, invitation_name, background_image) VALUES ($1, $2, $3, $4) returning *; ",
    [category, preview_image, invitation_name, background_image]
  );
  return invitaion[0];
};

const createInvitationDataDb = async ({
  item_name,
  item_styles,
  is_editable,
  example_text,
  public_name,
  item_type,
  template_id,
}) => {
  const data = await pool.query(
    "INSERT INTO invitation_template(item_name, item_styles, is_editable, example_text, public_name, item_type, template_id) VALUES ($1, $2, $3, $4) returning *; "[
      (item_name,
      item_styles,
      is_editable,
      example_text,
      public_name,
      item_type,
      template_id)
    ]
  );
  return data;
};

module.exports = {
  createInvitationDb,
  createInvitationDataDb,
};
