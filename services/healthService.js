const { healthCheckDb } = require('../db/healthDb');

const healthService = async () => {
  try {
    await healthCheckDb();

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  healthService,
};
