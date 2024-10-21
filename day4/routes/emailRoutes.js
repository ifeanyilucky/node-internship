const express = require('express');
const router = express.Router();
const { Email } = require('../models');

// GET all emails
router.get('/', async (req, res) => {
  try {
    const emails = await Email.findAll();
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one email
router.get('/:id', async (req, res) => {
  try {
    const email = await Email.findByPk(req.params.id);
    if (email) {
      res.json(email);
    } else {
      res.status(404).json({ message: 'Email not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new email
router.post('/', async (req, res) => {
  try {
    const newEmail = await Email.create(req.body);
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update an email
router.put('/:id', async (req, res) => {
  try {
    const updated = await Email.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated[0] === 1) {
      res.json({ message: 'Email updated successfully' });
    } else {
      res.status(404).json({ message: 'Email not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE an email
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Email.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Email deleted successfully' });
    } else {
      res.status(404).json({ message: 'Email not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
