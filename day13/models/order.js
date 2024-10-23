const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stripe_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.ENUM('paid', 'failed'),
      allowNull: false
    }
  }, {
    tableName: 'Orders',
    timestamps: true
  });

  Order.associate = function(models) {
    Order.belongsTo(models.Product, { foreignKey: 'product_id' });
  };

  return Order;
};
