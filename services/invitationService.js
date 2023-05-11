const { ErrorHandler } = require("../helpers/error");
const {
  createInvitationDb,
  createInvitationDataDb,
} = require("../db/invitation.db");

const createInvitationService = async (data) => {
  const {
    invitation_name,
    category,
    background_image,
    preview_image,
    template_data,
  } = data;

  try {
    const invitation = await createInvitationDb({
      category,
      preview_image,
      invitation_name,
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
        invitation.id,
      ];
    });

    const invitationData = await createInvitationDataDb(templateDataWithId);

    return { invitation, invitationData };
    
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = { createInvitationService };
