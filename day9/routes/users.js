var express = require('express');
var router = express.Router();
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

/* GET users listing. */
router.get('/', authMiddleware, roleMiddleware, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
