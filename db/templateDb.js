const pool = require("../config");
const format = require("pg-format");

const createTemplateDb = async ({
  category,
  preview_image,
  template_name,
  background_image,
}) => {
  const { rows: template } = await pool.query(
    "INSERT INTO invitation_template(category, preview_image, template_name, background_image) VALUES ($1, $2, $3, $4) returning *; ",
    [category, preview_image, template_name, background_image]
  );
  return template[0];
};

const createTemplateDataDb = async (data) => {
  const { rows: templateData } = await pool.query(
    format(
      "INSERT INTO template_data(item_name, item_styles, is_editable, example_text, public_name, item_type, template_id) VALUES %L returning *; ",
      data
    )
  );
  return templateData;
};

module.exports = {
  createTemplateDb,
  createTemplateDataDb,
};
