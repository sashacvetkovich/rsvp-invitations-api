const { healthService } = require('../services/healthService');
const { StatusCodes } = require('http-status-codes');

const healthController = async (req, res) => {
  const status = await healthService();

  res.status(StatusCodes.OK).json({
    status: status,
  });
};

module.exports = {
  healthController,
};
