const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv' && file.mimetype !== 'application/vnd.ms-excel') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  }
});

router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded or invalid file type' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const db = req.app.get('db');
        await db.Transaction.bulkCreate(results);
        fs.unlinkSync(req.file.path); 
        res.json({ message: 'Import successful', count: results.length });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error importing data' });
      }
    });
});

router.get('/export', async (req, res) => {
  try {
    const db = req.app.get('db');
    const transactions = await db.Transaction.findAll();

    const csvStringifier = createCsvStringifier({
      header: [
        { id: 'id', title: 'ID' },
        { id: 'order_id', title: 'Order ID' },
        { id: 'user_id', title: 'User ID' },
        { id: 'shipping_dock_id', title: 'Shipping Dock ID' },
        { id: 'amount', title: 'Amount' },
        { id: 'discount', title: 'Discount' },
        { id: 'tax', title: 'Tax' },
        { id: 'total', title: 'Total' },
        { id: 'notes', title: 'Notes' },
        { id: 'status', title: 'Status' },
        { id: 'createdAt', title: 'Created At' },
        { id: 'updatedAt', title: 'Updated At' }
      ]
    });

    const csvString = csvStringifier.stringifyRecords(transactions);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csvStringifier.getHeaderString() + csvString);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error exporting data' });
  }
});

module.exports = router;
