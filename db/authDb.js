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
    `SELECT users.*, cart.id AS cart_id FROM users LEFT JOIN cart on cart.user_id = users.user_id WHERE LOWER(email) = LOWER($1)`,
    [email]
  );
  return user[0];
};

const createUserDb = async ({ password, email, fullname }) => {
  const { rows: user } = await pool.query(
    `INSERT INTO users(password, email, fullname) 
      VALUES($1, $2, $3) 
      returning user_id, email, fullname, roles, address, city, state, country, created_at`,
    [password, email, fullname]
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

module.exports = {
  getUserByRefreshTokenDb,
  getUserByEmailDb,
  createUserDb,
  updateRefreshTokenDb,
};
