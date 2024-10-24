
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sms = sequelize.define('sms', {
  
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id',
      comment: 'ID'
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'phone',
      comment: 'Phone'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'status',
      comment: 'Status'
    }
}, {
  tableName: 'smss',
  timestamps: true,
});

module.exports = Sms;
