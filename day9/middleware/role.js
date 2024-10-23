module.exports = function(req, res, next) {
  const path = req.path;
  const portalName = path.split('/')[1]; 

  if (req.user && req.user.role === portalName) {
    next();
  } else {
    res.status(403).json({ error: true, message: 'Access denied. Invalid role for this portal.' });
  }
};
