const JwtService = require('../services/JwtService');

module.exports = function(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: true, message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = JwtService.verify(token);
    req.user = { id: decoded.user_id };
    next();
  } catch (error) {
    return res.status(401).json({ error: true, message: 'Invalid or expired token' });
  }
};
