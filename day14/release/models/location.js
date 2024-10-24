
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Location = sequelize.define('location', {
  
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
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'status',
      comment: 'Status'
    }
}, {
  tableName: 'locations',
  timestamps: true,
});

module.exports = Location;
