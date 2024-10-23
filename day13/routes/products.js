const express = require('express');
const router = express.Router();
const config = require('../config');
const stripe = require('stripe')(config.secret_key);
const { Product } = require('../models');

// GET /products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    console.log(products)
    res.render('products/index', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Error fetching products');
  }
});

// GET products
router.get('/all', async (req, res) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'title', 'price', 'description', 'createdAt', 'updatedAt']
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
});


// GET /products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('products/detail', { product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Error fetching product');
  }
});

// POST /products/:id/checkout
router.post('/:id/checkout', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
            },
            unit_amount: product.price * 100, 
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/products/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/products/${product.id}`,
      metadata: {
        product_id: product.id.toString(),
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});



// POST /products
router.post('/', async (req, res) => {
  try {
    const { title, description, price, image_url } = req.body;
    
    if (!title || !description || !price) {
      return res.status(400).json({ error: 'Title, description, and price are required' });
    }

    const newProduct = await Product.create({
      title,
      description,
      price,
      image_url
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
})


// POST 
router.post('/:id/edit', async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    
    const { title, price, description } = req.body;
    await product.update({ title, price, description });
    
    res.status(200).json('product updated')
  } catch (error) {
    next(error);
  }
});

router.post('/create-checkout-session/:productId', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.title,
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/thank-you/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/products/${product.id}`,
      metadata: {
        product_id: product.id,
      },
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

module.exports = router;
