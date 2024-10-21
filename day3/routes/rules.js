const express = require('express');
const router = express.Router();
const { Rule } = require('../models');

// GET all rules
router.get('/', async (req, res) => {
  try {
    const rules = await Rule.findAll();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one rule
router.get('/:id', async (req, res) => {
  try {
    const rule = await Rule.findByPk(req.params.id);
    if (rule) {
      res.json(rule);
    } else {
      res.status(404).json({ message: 'Rule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST (create) one rule
router.post('/', async (req, res) => {
  try {
    const newRule = await Rule.create(req.body);
    res.status(201).json(newRule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (update) one rule
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Rule.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedRule = await Rule.findByPk(req.params.id);
      res.json(updatedRule);
    } else {
      res.status(404).json({ message: 'Rule not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE one rule
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Rule.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Rule not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
