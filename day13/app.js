require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var seedProducts = require('./seedProducts');

const db = require("./models");
var cors = require("cors");

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set in the environment variables');
  process.exit(1);
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('./models/order');
const Product = require('./models/product');

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

app.get('/config', (req, res) => {
  if (!process.env.STRIPE_PUBLISHABLE_KEY) {
    return res.status(500).json({ error: 'Stripe publishable key is not set' });
  }
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

app.get('/create-checkout-session/:productId', async (req, res) => {
  try {
    const product = await db.Product.findByPk(req.params.productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/products/${product.id}`,
      metadata: {
        product_id: product.id
      }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      const order = await Order.create({
        product_id: session.metadata.product_id,
        total: session.amount_total / 100,
        stripe_id: session.id,
        status: 'paid',
      });

      console.log('Order created:', order);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  }

  res.json({received: true});
});

app.get('/checkout-success', async (req, res) => {
  const sessionId = req.query.session_id;
  
  if (!sessionId) {
    return res.status(400).send('Session ID is required');
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Create the order
    const order = await db.Order.create({
      product_id: session.metadata.product_id,
      total: session.amount_total / 100,
      stripe_id: session.id,
      status: 'paid',
    });

    // Redirect to thank you page with the order ID
    res.redirect(`/thank-you/${order.id}`);
  } catch (error) {
    console.error('Error processing successful checkout:', error);
    res.status(500).send('Server error');
  }
});

app.get('/thank-you/:orderId', async (req, res) => {
  try {
    const order = await db.Order.findByPk(req.params.orderId, {
      include: [{ model: db.Product }]
    });

    if (!order) {
      return res.status(404).send('Order not found');
    }

    // Retrieve the Stripe session to get payment method details
    const session = await stripe.checkout.sessions.retrieve(order.stripe_id);
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
    const paymentMethod = paymentIntent.payment_method_types[0];

    res.render('thank-you', { order, paymentMethod });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).send('Server error');
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);

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

module.exports = app;
