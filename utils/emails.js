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

class VerifyEmail {
  constructor({ to, url, templateId, name }) {
    this.to = [to];
    this.from = { name: "Sasa IV", email: "cvetkovicsasahs@gmail.com" };
    this.templateId = templateId;
    this.dynamicTemplateData = {
      url: url,
      name: name,
    };
  }
}

const sendMail = async (message) => {
  if (process.env.NODE_ENV === "test") return;
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

const sendVerificationEmail = async ({ userEmail, name, token }) => {
  const origin = process.env.ORIGIN;
  const url = `${origin}/verify?token=${token}&email=${userEmail}`;

  const message = new VerifyEmail({
    templateId: "d-60e71b0dfe514e388f24146f849fcadc",
    to: userEmail,
    url,
    name,
    hideWarnings: true,
  });

  await sendMail(message);
};

module.exports = { sendResetPasswordEmail, sendVerificationEmail };
