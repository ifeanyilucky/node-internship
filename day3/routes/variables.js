const express = require('express');
const router = express.Router();
const { Variable } = require('../models');

// GET all variables
router.get('/', async (req, res) => {
  try {
    const variables = await Variable.findAll();
    res.json(variables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one variable
router.get('/:id', async (req, res) => {
  try {
    const variable = await Variable.findByPk(req.params.id);
    if (variable) {
      res.json(variable);
    } else {
      res.status(404).json({ message: 'Variable not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST (create) one variable
router.post('/', async (req, res) => {
  try {
    const newVariable = await Variable.create(req.body);
    res.status(201).json(newVariable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (update) one variable
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Variable.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedVariable = await Variable.findByPk(req.params.id);
      res.json(updatedVariable);
    } else {
      res.status(404).json({ message: 'Variable not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE one variable
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Variable.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Variable not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
