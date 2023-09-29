const axios = require("axios");

const getGoogleOAuthTokens = async ({ code }) => {
  const url = "https://oauth2.googleapis.com/token";

  try {
    const res = await axios.post(url, {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: "http://localhost:8000/api/v1/auth/google",
      grant_type: "authorization_code",
    });
    return res.data;
  } catch (error) {
    throw new Error(error?.response?.data?.error);
  }
};

const getGoogleUser = async ({ id_token, access_token }) => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    // log.error(error, "Error fetching Google user");
    throw new Error(error.message);
  }
};

module.exports = { getGoogleOAuthTokens, getGoogleUser };
