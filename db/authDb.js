const pool = require("../config");

const getUserByIdDb = async (id) => {
  const { rows: user } = await pool.query(
    "SELECT users.*, cart.id AS cart_id FROM users LEFT JOIN cart on cart.user_id = users.user_id WHERE users.user_id = $1",
    [id]
  );
  return user[0];
};

const getUserByUsernameDb = async (username) => {
  const { rows: user } = await pool.query(
    "SELECT users.*, cart.id AS cart_id FROM users LEFT JOIN cart on cart.user_id = users.user_id WHERE LOWER(users.username) = LOWER($1)",
    [username]
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

const createUserDb = async ({ username, password, email, fullname }) => {
  const { rows: user } = await pool.query(
    `INSERT INTO users(username, password, email, fullname) 
      VALUES($1, $2, $3, $4) 
      returning user_id, username, email, fullname, roles, address, city, state, country, created_at`,
    [username, password, email, fullname]
  );
  return user[0];
};

module.exports = {
  getUserByIdDb,
  getUserByEmailDb,
  getUserByUsernameDb,
  createUserDb,
};
