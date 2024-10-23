var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const db = require("./models");
var cors = require("cors");

// Import new middleware
const authMiddleware = require('./middleware/auth');
const roleMiddleware = require('./middleware/role');
const maintenanceMiddleware = require('./middleware/maintenance');

var app = express();
app.set("db", db);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// maintenance middleware to all routes
app.use(maintenanceMiddleware);

// app.use('/api', authMiddleware);

app.use('/api/v1', roleMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send a more human-readable error message
  const status = err.status || 500;
  const message = status === 404 ? 'Resource not found' : 'An error occurred';
  
  res.status(status).json({
    error: {
      message: message,
      details: req.app.get('env') === 'development' ? err.message : undefined
    }
  });
});

module.exports = app;
