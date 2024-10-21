const express = require('express');
const router = express.Router();
const { ShippingDock } = require('../models');

// get all shipping docks
router.get('/', async (req, res) => {
  try {
    const shippingDocks = await ShippingDock.findAll();
    res.json(shippingDocks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving shipping docks', error: error.message });
  }
});

// get one shipping dock
router.get('/:id', async (req, res) => {
  try {
    const shippingDock = await ShippingDock.findByPk(req.params.id);
    if (shippingDock) {
      res.json(shippingDock);
    } else {
      res.status(404).json({ message: 'Shipping dock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving shipping dock', error: error.message });
  }
});

// post (add) one shipping dock
router.post('/', async (req, res) => {
  try {
    const newShippingDock = await ShippingDock.create(req.body);
    res.status(201).json(newShippingDock);
  } catch (error) {
    res.status(400).json({ message: 'Error creating shipping dock', error: error.message });
  }
});

// put (update) one shipping dock
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await ShippingDock.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedShippingDock = await ShippingDock.findByPk(req.params.id);
      res.json(updatedShippingDock);
    } else {
      res.status(404).json({ message: 'Shipping dock not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating shipping dock', error: error.message });
  }
});

// delete one shipping dock
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ShippingDock.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json({ message: 'Shipping dock deleted' });
    } else {
      res.status(404).json({ message: 'Shipping dock not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting shipping dock', error: error.message });
  }
});

module.exports = router;