'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ShippingDock extends Model {
    static associate(models) {
      // associated with transaction
      ShippingDock.hasMany(models.Transaction, { foreignKey: 'shipping_dock_id' });
    }
  }

  ShippingDock.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: [[0, 1]] // 0 for active, 1 for inactive
      }
    }
  }, {
    sequelize,
    modelName: 'ShippingDock',
    tableName: 'shipping_docks',
  });

  return ShippingDock;
};