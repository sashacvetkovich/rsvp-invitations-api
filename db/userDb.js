const pool = require("../config");

const getUserDb = async (id) => {
  const { rows: user } = await pool.query(
    "SELECT email, fullname, roles, user_image, is_verified from users WHERE user_id = $1",
    [id]
  );
  return user[0];
};

module.exports = {
  getUserDb,
};
