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

const getAllTemplatesDb = async () => {
  const { rows: templates } = await pool.query(
    "SELECT * FROM invitation_template"
  );
  return templates;
};

const getSingleTemplateDb = async (templateId) => {
  const { rows: template } = await pool.query(
    "SELECT * ,(SELECT array_to_json(array_agg(row_to_json(template_alias))) AS template_data FROM (SELECT * FROM template_data WHERE template_id = $1) template_alias) FROM invitation_template WHERE id = $1",
    [templateId]
  );
  return template[0];
};

module.exports = {
  createTemplateDb,
  createTemplateDataDb,
  getAllTemplatesDb,
  getSingleTemplateDb,
};
