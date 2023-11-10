const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class ResetPasswordEmail {
  constructor({ to, url, templateId }) {
    this.to = [to];
    this.from = { name: "Sasa IV", email: "cvetkovicsasahs@gmail.com" };
    this.templateId = templateId;
    this.dynamicTemplateData = {
      url: url,
    };
  }
}

const sendMail = async (message) => {
  try {
    await sgMail.send(message);
  } catch (error) {
    console.error(error.response?.body);
  }
};

const sendResetPasswordEmail = async ({ userEmail, token }) => {
  const origin = process.env.ORIGIN;
  const url = `${origin}/reset-password?token=${token}&email=${userEmail}`;

  const message = new ResetPasswordEmail({
    templateId: "d-75779e3761194e5c9d79a77d13bf59a4",
    to: userEmail,
    url,
    hideWarnings: true,
  });

  await sendMail(message);
};

module.exports = { sendResetPasswordEmail };
