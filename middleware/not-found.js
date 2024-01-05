const notFound = (req, res) => res.status(404).send('Route does not exist. Please check API documentation.')

module.exports = notFound
