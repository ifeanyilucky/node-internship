
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Email = sequelize.define('email', {
  
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id',
      comment: 'ID'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'email',
      comment: 'Email'
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'status',
      comment: 'Status'
    }
}, {
  tableName: 'emails',
  timestamps: true,
});

module.exports = Email;
