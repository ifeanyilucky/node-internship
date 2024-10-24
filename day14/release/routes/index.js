var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
const locationControllerRoutes = require('./locationControllerRoutes');
app.use('/location', locationControllerRoutes);
const emailControllerRoutes = require('./emailControllerRoutes');
app.use('/email', emailControllerRoutes);
const smsControllerRoutes = require('./smsControllerRoutes');
app.use('/sms', smsControllerRoutes);
const userControllerRoutes = require('./userControllerRoutes');
app.use('/user', userControllerRoutes);
