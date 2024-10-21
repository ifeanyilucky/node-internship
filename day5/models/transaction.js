'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // define associations here
    }
  }
  Transaction.init({
    order_id: DataTypes.STRING,
    user_id: DataTypes.INTEGER,
    shipping_dock_id: DataTypes.INTEGER,
    amount: DataTypes.DECIMAL(10, 2),
    discount: DataTypes.DECIMAL(10, 2),
    tax: DataTypes.DECIMAL(10, 2),
    total: DataTypes.DECIMAL(10, 2),
    notes: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};
