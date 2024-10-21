var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var shippingDockRouter = require('./routes/shipping_dock');
var orderRouter = require('./routes/order');
var transactionRouter = require('./routes/transaction');

const db = require("./models");
var cors = require("cors");
const orderService = require('./services/orderService');

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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/v1/shipping_dock', shippingDockRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/transaction', transactionRouter);

// Database connection check
db.sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Sync database
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

// GET /api/v1/order/odd
app.get('/api/v1/order/odd', async (req, res) => {
  try {
    const oddOrders = await orderService.getOddOrders();
    res.json(oddOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/order', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'id', direction = 'ASC' } = req.query;
    const result = await orderService.getPaginatedOrders(parseInt(page), parseInt(limit), sort, direction);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.get('/api/v1/report/sale', async (req, res) => {
  try {
    const { month, year, from_date, to_date } = req.query;
    let result;

    if (month && year) {
      result = await orderService.getSaleReport(parseInt(month), parseInt(year));
    } else if (from_date && to_date) {
      result = await orderService.getSaleReportByDateRange(from_date, to_date);
    } else {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/report/monthly', async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ error: 'Year is required' });
    }
    const result = await orderService.getMonthlySaleReport(parseInt(year));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/report/user', async (req, res) => {
  try {
    const { year, user_id } = req.query;
    if (!year || !user_id) {
      return res.status(400).json({ error: 'Year and user_id are required' });
    }
    const result = await orderService.getUserMonthlySaleReport(parseInt(year), parseInt(user_id));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const PORT = process.env.PORT || 3100;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
