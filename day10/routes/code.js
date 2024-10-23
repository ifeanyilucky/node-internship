const express = require('express');
const router = express.Router();
const qr = require('qrcode');

router.get('/', async function(req, res, next) {
  const amount = Math.floor(Math.random() * 1000) + 1; // Random amount between 1 and 1000
  const service = 'software service';
  const url = `${req.protocol}://${req.get('host')}/api/v1/code/?amount=${amount}&service=${encodeURIComponent(service)}`;
  
  try {
    const qrCodeDataUrl = await qr.toDataURL(url);
    res.render('code', { title: 'QR Code', qrCodeDataUrl: qrCodeDataUrl });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
