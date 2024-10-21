const express = require('express');
const router = express.Router();
const { Transaction } = require('../models');

//get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transactions', error: error.message });
  }
});

//get one transaction
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving transaction', error: error.message });
  }
}); 

// post (add) one transaction
router.post('/', async (req, res) => {
  try {
    const newTransaction = await Transaction.create(req.body);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(400).json({ message: 'Error creating transaction', error: error.message });
  }
});

// put (update) one transaction
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Transaction.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedTransaction = await Transaction.findByPk(req.params.id);
      res.json(updatedTransaction);
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating transaction', error: error.message });
  }
});

// DELETE one transaction
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Transaction deleted' });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error: error.message });
  }
});

module.exports = router;