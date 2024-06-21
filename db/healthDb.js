const pool = require('../config');

const healthCheckDb = async () => {
  const status = await pool.query('SELECT 1');
  return status[0];
};

module.exports = {
  healthCheckDb,
};
