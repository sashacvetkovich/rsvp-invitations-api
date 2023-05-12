const { ErrorHandler } = require("../helpers/error");
const {
  createTemplateDb,
  createTemplateDataDb,
  getSingleTemplateDb,
  getAllTemplatesDb,
} = require("../db/templateDb");

const createTemplateService = async (data) => {
  const {
    template_name,
    category,
    background_image,
    preview_image,
    template_data,
  } = data;

  try {
    const template = await createTemplateDb({
      category,
      preview_image,
      template_name,
      background_image,
    });

    const templateDataWithId = template_data.map((item) => {
      const {
        itemName: item_name,
        itemStyles: item_styles,
        isEditable: is_editable,
        exanleText: example_text,
        publicName: public_name,
        itemType: item_type,
      } = item;

      return [
        item_name,
        item_styles,
        is_editable,
        example_text,
        public_name,
        item_type,
        template.id,
      ];
    });

    const templateData = await createTemplateDataDb(templateDataWithId);

    return { template, templateData };
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getAllTemplatesService = async () => {
  try {
    return await getAllTemplatesDb();
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

const getSingleTemplateService = async (templateId) => {
  try {
    return await getSingleTemplateDb(templateId);
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = {
  createTemplateService,
  getSingleTemplateService,
  getAllTemplatesService,
};
