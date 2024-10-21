const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;ob

    const response = await axios.get(`https://hmj6ngi-hx.myshopify.com/admin/api/2022-01/products.json?limit=${limit}&page=${page}`, {
      headers: {
        'X-Shopify-Access-Token': 'cee9dc15369353c463e5966df3ea2088'
      }
    });

    const products = response.data.products;

    res.render('products', { products, currentPage: page });
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    res.status(500).send('Error fetching products');
  }
});

module.exports = router;
