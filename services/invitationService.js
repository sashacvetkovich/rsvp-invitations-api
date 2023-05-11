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
    // console.log({ category, preview_image, invitation_name, background_image });

    const invitation = await createInvitationDb({
      category,
      preview_image,
      invitation_name,
      background_image,
    });

    // const ibvitationData =  await createInvitationDataDb({...template_data })

    // res.status(StatusCodes.CREATED).json({ invitation });

    return  invitation ;
    // ovde sad dodajemo i template data i vracamo ceo objekat sa bodacim iznad
  } catch (error) {
    throw new ErrorHandler(error.statusCode, error.message);
  }
};

module.exports = { createInvitationService };
