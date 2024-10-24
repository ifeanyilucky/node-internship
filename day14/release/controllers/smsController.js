
const Sms = require('../models/sms');

exports.getAll = async (req, res) => {
  try {
    const smss = await Sms.findAll();
    res.json(smss);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const sms = await Sms.findByPk(req.params.id);
    if (sms) {
      res.json(sms);
    } else {
      res.status(404).json({ message: 'Sms not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const newSms = await Sms.create(req.body);
    res.status(201).json(newSms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await Sms.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated[0] === 1) {
      res.json({ message: 'Sms updated successfully' });
    } else {
      res.status(404).json({ message: 'Sms not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Sms.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.json({ message: 'Sms deleted successfully' });
    } else {
      res.status(404).json({ message: 'Sms not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
