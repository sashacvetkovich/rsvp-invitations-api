const sgMail = require("@sendgrid/mail");
const { logger } = require("../utils/logger");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class ResetPasswordEmail {
  constructor({ to, url, templateId }) {
    this.to = [to];
    this.from = { name: "Invitewave", email: process.env.FROM_EMAIL };
    this.templateId = templateId;
    this.hideWarnings = true;
    this.dynamic_template_data = {
      url: url,
    };
  }
}

class VerifyEmail {
  constructor({ to, url, templateId }) {
    this.to = [to];
    this.from = { name: "Invitewave", email: process.env.FROM_EMAIL };
    this.templateId = templateId;
    this.hideWarnings = true;
    this.dynamic_template_data = {
      url: url,
    };
  }
}

class GuestInvitationnEmail {
  constructor({ to, url, templateId }) {
    this.to = [to];
    this.from = { name: "Invitewave", email: process.env.FROM_EMAIL };
    this.templateId = templateId;
    this.hideWarnings = true;
    this.dynamic_template_data = {
      url: url,
    };
  }
}

const sendMail = async (message) => {
  if (process.env.NODE_ENV === "test") return;
  try {
    await sgMail.send(message);
  } catch (error) {
    logger.error(`Email error: ${error.response?.body}`);
  }
};

const sendResetPasswordEmail = async ({ userEmail, token }) => {
  const url = `https://invitewave.com/reset-password?token=${token}&email=${userEmail}`;

  const message = new ResetPasswordEmail({
    templateId: "d-75779e3761194e5c9d79a77d13bf59a4",
    to: userEmail,
    url,
  });

  await sendMail(message);
};

const sendVerificationEmail = async ({ userEmail, token }) => {
  const origin = process.env.ORIGIN;
  const url = `${origin}/verify?token=${token}&email=${userEmail}`;

  const message = new VerifyEmail({
    templateId: "d-60e71b0dfe514e388f24146f849fcadc",
    to: userEmail,
    url,
  });

  await sendMail(message);
};

const sendGuestInvitationnEmail = async ({ guestId, guestEmail }) => {
  const origin = process.env.ORIGIN;
  const url = `${origin}/guest/${guestId}`;
  const message = new GuestInvitationnEmail({
    templateId: "d-c0ffc29a5a2243deb54f3f748b082c1c",
    to: guestEmail,
    url,
  });
  await sendMail(message);
};

module.exports = {
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendGuestInvitationnEmail,
};
