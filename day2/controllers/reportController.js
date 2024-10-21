const db = require('../models');
const { Op } = require('sequelize');

exports.getSaleReport = async (req, res) => {
  try {
    const { month, year, from_date, to_date } = req.query;
    let whereClause = {};

    if (month && year) {
      whereClause = db.sequelize.where(db.sequelize.fn('MONTH', db.sequelize.col('order_date')), month);
      whereClause[Op.and] = db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('order_date')), year);
    } else if (from_date && to_date) {
      const startDate = new Date(from_date) < new Date(to_date) ? from_date : to_date;
      const endDate = new Date(from_date) < new Date(to_date) ? to_date : from_date;
      whereClause = {
        order_date: {
          [Op.between]: [startDate, endDate]
        }
      };
    }

    const totalAmount = await db.Order.sum('total_amount', { where: whereClause });
    res.json({ total_amount: totalAmount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthlyReport = async (req, res) => {
  try {
    const { year } = req.query;
    const result = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('MONTH', db.sequelize.col('order_date')), 'month'],
        [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'total_amount']
      ],
      where: db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('order_date')), year),
      group: [db.sequelize.fn('MONTH', db.sequelize.col('order_date'))],
      having: db.sequelize.literal('total_amount > 0'),
      order: [[db.sequelize.fn('MONTH', db.sequelize.col('order_date')), 'ASC']]
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserReport = async (req, res) => {
  try {
    const { year, user_id } = req.query;
    const result = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('MONTH', db.sequelize.col('order_date')), 'month'],
        [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'total_amount']
      ],
      where: {
        [Op.and]: [
          db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('order_date')), year),
          { user_id }
        ]
      },
      group: [db.sequelize.fn('MONTH', db.sequelize.col('order_date'))],
      having: db.sequelize.literal('total_amount > 0'),
      order: [[db.sequelize.fn('MONTH', db.sequelize.col('order_date')), 'ASC']]
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getShippingDockReport = async (req, res) => {
  try {
    const { year, shipping_dock_id } = req.query;
    const result = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('MONTH', db.sequelize.col('order_date')), 'month'],
        [db.sequelize.fn('SUM', db.sequelize.col('total_amount')), 'total_amount']
      ],
      where: {
        [Op.and]: [
          db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('order_date')), year),
          { shipping_dock_id }
        ]
      },
      group: [db.sequelize.fn('MONTH', db.sequelize.col('order_date'))],
      having: db.sequelize.literal('total_amount > 0'),
      order: [[db.sequelize.fn('MONTH', db.sequelize.col('order_date')), 'ASC']]
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrderCount = async (req, res) => {
  try {
    const { year, user_id } = req.query;
    const result = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('MONTH', db.sequelize.col('order_date')), 'month'],
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'order_count']
      ],
      where: {
        [Op.and]: [
          db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('order_date')), year),
          { user_id }
        ]
      },
      group: [db.sequelize.fn('MONTH', db.sequelize.col('order_date'))],
      order: [[db.sequelize.fn('MONTH', db.sequelize.col('order_date')), 'ASC']]
    });

    // Fill in missing months with 0 order count
    const filledResult = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const existingData = result.find(item => item.dataValues.month === month);
      return existingData ? existingData.dataValues : { month, order_count: 0 };
    });

    res.json(filledResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
