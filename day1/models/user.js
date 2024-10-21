'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
     
      User.hasMany(models.Order, { foreignKey: 'user_id' });
      User.hasMany(models.Transaction, { foreignKey: 'user_id' });
    }
  }

  User.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
   
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};