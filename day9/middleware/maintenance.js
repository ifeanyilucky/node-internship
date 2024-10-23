const config = {
    maintenance: false
}
module.exports = function(req, res, next) {
  if (config.maintenance === true) {
    return res.status(503).json({ error: true,   message: 'Service is currently under maintenance. Please try again later.' });
  }
  next();
};
