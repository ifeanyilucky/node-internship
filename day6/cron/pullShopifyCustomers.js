const cron = require('node-cron');
const { Customer } = require('../models');
const axios = require('axios');

const pullShopifyCustomers = async () => {
  try {
    const response = await axios.get('https://hmj6ngi-hx.myshopify.com/admin/api/2024-07/customers.json', {
      headers: {
        'X-Shopify-Access-Token': 'cee9dc15369353c463e5966df3ea2088'
      }
    });

    const customers = response.data.customers;

    for (const customer of customers) {
      await Customer.findOrCreate({
        where: { shopify_customer_id: customer.id.toString() },
        defaults: {
          shopify_customer_id: customer.id.toString(),
          shopify_customer_email: customer.email
        }
      });
    }

    console.log('Shopify customers pulled and saved successfully');
  } catch (error) {
    console.error('Error pulling Shopify customers:', error.response);
  }
};

cron.schedule('0 0 * * *', pullShopifyCustomers);

module.exports = pullShopifyCustomers;
