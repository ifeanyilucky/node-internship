
const Email = require('../models/email');

exports.getAll = async (req, res) => {
  try {
    const emails = await Email.findAll();
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
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
};

exports.create = async (req, res) => {
  try {
    const newEmail = await Email.create(req.body);
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
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
};

exports.delete = async (req, res) => {
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
};
