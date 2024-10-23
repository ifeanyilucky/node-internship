const express = require('express');
const router = express.Router();
const htmlPdf = require('html-pdf-node');
const fs = require('fs');
const path = require('path');

router.get('/code', async function(req, res, next) {
  const { amount, service } = req.query;
  
  if (!amount || !service) {
    return res.status(400).json({ error: 'Amount and service are required' });
  }

  let invoiceHtml = fs.readFileSync(path.join(__dirname, '../views/invoice.html'), 'utf8');
  
  const currentDate = new Date().toLocaleDateString();
  invoiceHtml = invoiceHtml
    .replace('{{date}}', currentDate)
    .replace(/{{amount}}/g, amount)
    .replace('{{service}}', service);

  const options = { format: 'A4' };
  const file = { content: invoiceHtml };

  try {
    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    res.contentType('application/pdf');
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
