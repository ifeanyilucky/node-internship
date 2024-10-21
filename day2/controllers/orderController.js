const { Order, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getOddOrders = async (req, res) => {
  try {
    const oddOrders = await Order.findAll({
      where: {
        order_id: {
          [Op.and]: [
            { [Op.ne]: null },
            sequelize.where(sequelize.literal('order_id % 2'), '=', 1)
          ]
        }
      }
    });
    res.json(oddOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const sort = req.query.sort || 'id';
    const direction = req.query.direction === 'DESC' ? 'DESC' : 'ASC';

    const { count, rows } = await Order.findAndCountAll({
      limit,
      offset,
      order: [[sort, direction]]
    });

    res.json({
      total: count,
      page,
      list: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByCursor = async (req, res) => {
  try {
    const id = parseInt(req.query.id) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const orders = await Order.findAll({
      where: {
        id: {
          [Op.gt]: id
        }
      },
      limit,
      order: [['id', 'ASC']]
    });

    res.json({
      id,
      list: orders
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
