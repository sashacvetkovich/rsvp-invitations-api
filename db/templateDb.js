const pool = require("../config");
const format = require("pg-format");

const createTemplateDb = async ({
  category,
  previewImage,
  templateName,
  previewImageSmall,
  colors,
}) => {
  const { rows: template } = await pool.query(
    "INSERT INTO invitation_template(category, preview_image, template_name, preview_image_small, colors) VALUES ($1, $2, $3, $4, $5) returning *; ",
    [category, previewImage, templateName, previewImageSmall, colors]
  );
  return template[0];
};

const createTemplateDataDb = async (data) => {
  const { rows: templateData } = await pool.query(
    format(
      "INSERT INTO template_data(item_name, item_styles, is_editable, example_text, item_type, template_id) VALUES %L returning *; ",
      data
    )
  );
  return templateData;
};

const getAllTemplatesDb = async () => {
  const { rows: templates } = await pool.query(
    "SELECT id, category, preview_image_small, template_name, colors FROM invitation_template"
  );
  return templates;
};

const getSingleTemplateDb = async (templatePath) => {
  const { rows: template } = await pool.query(
    "SELECT id, category, preview_image, template_name, colors, path,(SELECT array_to_json(array_agg(row_to_json(template_alias))) AS template_data FROM (SELECT * FROM template_data WHERE template_path = $1) template_alias) FROM invitation_template WHERE path = $1",
    [templatePath]
  );
  return template[0];
};

const getTemplateRecommendationDb = async (category) => {
  const { rows: templates } = await pool.query(
    "SELECT id, template_name, category, preview_image_small FROM invitation_template WHERE category = $1 LIMIT 4",
    [category]
  );
  return templates;
};

const getAllTemplateCategoriesDb = async () => {
  const { rows: templateCategories } = await pool.query(
    "SELECT * FROM template_categories"
  );
  return templateCategories;
};

const getSingleTemplateCategoryDb = async (categoryName) => {
  const { rows: templateCategory } = await pool.query(
    "SELECT * FROM template_categories WHERE category_name = $1",
    [categoryName]
  );
  return templateCategory[0];
};

const createTemplateCategoryDb = async (data) => {
  const {
    categoryName,
    categoryTitle,
    categoryShortDescription,
    categoryLongDescription,
    categoryImage,
  } = data;

  const { rows: templateCategories } = await pool.query(
    "INSERT INTO template_categories( category_name, category_title, category_short_description, category_long_description, category_image) VALUES ($1, $2, $3, $4, $5) returning *; ",
    [
      categoryName,
      categoryTitle,
      categoryShortDescription,
      categoryLongDescription,
      categoryImage,
    ]
  );
  return templateCategories;
};

module.exports = {
  createTemplateDb,
  createTemplateDataDb,
  getAllTemplatesDb,
  getSingleTemplateDb,
  getAllTemplateCategoriesDb,
  createTemplateCategoryDb,
  getSingleTemplateCategoryDb,
  getTemplateRecommendationDb,
};
