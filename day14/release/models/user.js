
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('user', {
  
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id',
      comment: 'ID'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'name',
      comment: 'Name'
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
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
