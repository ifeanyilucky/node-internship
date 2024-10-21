const { Op } = require('sequelize');
const db = require('../models');

class OrderService {
  // get odd orders
  async getOddOrders() {
    return db.Order.findAll({
      where: {
        order_id: {
          [Op.and]: [
            { [Op.ne]: null },
            db.sequelize.where(db.sequelize.literal('order_id % 2'), '=', 1)
          ]
        }
      }
    });
  }

  // get paginated orders
  async getPaginatedOrders(page, limit, sort = 'id', direction = 'ASC') {
    const offset = (page - 1) * limit;
    const { count, rows } = await db.Order.findAndCountAll({
      limit,
      offset,
      order: [[sort, direction]],
    });

    return {
      total: count,
      page,
      list: rows,
    };
  }

 

  // get sale report
  async getSaleReport(month, year) {
    const result = await db.Order.sum('amount', {
      where: {
        [Op.and]: [
          db.sequelize.where(db.sequelize.fn('MONTH', db.sequelize.col('created_at')), month),
          db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('created_at')), year),
        ],
      },
    });

    return { total: result || 0 };
  }

  // get sale report by date range
  async getSaleReportByDateRange(fromDate, toDate) {
    const [start, end] = [fromDate, toDate].sort();
    const result = await db.Order.sum('amount', {
      where: {
        created_at: {
          [Op.between]: [start, end],
        },
      },
    });

    return { total: result || 0 };
  }

  // get monthly sale report
  async getMonthlySaleReport(year) {
    const result = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('MONTH', db.sequelize.col('created_at')), 'month'],
        [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total'],
      ],
      where: {
        [Op.and]: [
          db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('created_at')), year),
        ],
      },
      group: [db.sequelize.fn('MONTH', db.sequelize.col('created_at'))],
      having: db.sequelize.literal('total > 0'),
      order: [[db.sequelize.fn('MONTH', db.sequelize.col('created_at')), 'ASC']],
    });

    return result;
  }

  // get user monthly sale report
  async getUserMonthlySaleReport(year, userId) {
    const result = await db.Order.findAll({
      attributes: [
        [db.sequelize.fn('MONTH', db.sequelize.col('created_at')), 'month'],
        [db.sequelize.fn('SUM', db.sequelize.col('amount')), 'total'],
      ],
      where: {
        [Op.and]: [
          db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('created_at')), year),
          { user_id: userId },
        ],
      },
      group: [db.sequelize.fn('MONTH', db.sequelize.col('created_at'))],
      having: db.sequelize.literal('total > 0'),
      order: [[db.sequelize.fn('MONTH', db.sequelize.col('created_at')), 'ASC']],
    });

    return result;
  }
}
  // get shipping dock monthly sale report


module.exports = new OrderService();
