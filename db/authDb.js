const pool = require("../config");

const getUserByRefreshTokenDb = async (refreshToken) => {
  const { rows: user } = await pool.query(
    "SELECT user_id, roles from users WHERE refresh_token = $1",
    [refreshToken]
  );
  return user[0];
};

const getUserByEmailDb = async (email) => {
  const { rows: user } = await pool.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER($1)`,
    [email]
  );
  return user[0];
};

const createUserDb = async ({ password, email, fullname }) => {
  const { rows: user } = await pool.query(
    `INSERT INTO users(password, email, fullname) 
      VALUES($1, $2, $3) 
      returning user_id, email, fullname, roles, created_at`,
    [password, email, fullname]
  );
  return user[0];
};

const createGoogleUserDb = async ({
  email,
  fullname,
  isVerified,
  googleId,
  userImage,
}) => {
  const { rows: user } = await pool.query(
    `INSERT INTO users(email, fullname, is_verified, google_id, user_image) 
      VALUES($1, $2, $3, $4, $5) 
      returning user_id, fullname, roles`,
    [email, fullname, isVerified, googleId, userImage]
  );
  return user[0];
};

const updateGoogleUserDb = async ({
  googleId,
  isVerified,
  userImage,
  email,
}) => {
  const { rows: user } = await pool.query(
    `UPDATE users SET google_id = $1, is_verified = $2, user_image = $3 WHERE email = $4 returning user_id, fullname, roles`,
    [googleId, isVerified, userImage, email]
  );
  return user[0];
};

const updateRefreshTokenDb = async ({ email, refreshToken }) => {
  const { rows: user } = await pool.query(
    `UPDATE users SET refresh_token = $1 WHERE email = $2 returning user_id`,
    [refreshToken, email]
  );
  return user[0];
};

const deleteRefreshTokenDb = async (refreshToken) => {
  const { rows: user } = await pool.query(
    `UPDATE users SET refresh_token = '' WHERE refresh_token = $1 returning user_id`,
    [refreshToken]
  );
  return user[0];
};

const forgotPasswordDb = async ({
  passwordTokenExpirationDate,
  passwordToken,
  userId,
}) => {
  const { rows: user } = await pool.query(
    `UPDATE users SET password_token = $3, password_token_expiration = $2 WHERE user_id = $1 returning user_id`,
    [userId, passwordTokenExpirationDate, passwordToken]
  );
  return user[0];
};

const resetPasswordDb = async ({ email, password }) => {
  const { rows: user } = await pool.query(
    `UPDATE users SET password = $2, password_token = '', password_token_expiration = ''  WHERE email = $1 returning user_id`,
    [email, password]
  );
  return user[0];
};

module.exports = {
  getUserByRefreshTokenDb,
  getUserByEmailDb,
  createUserDb,
  updateRefreshTokenDb,
  createGoogleUserDb,
  updateGoogleUserDb,
  deleteRefreshTokenDb,
  forgotPasswordDb,
  resetPasswordDb,
};
