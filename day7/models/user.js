'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define associations here
    }
  }
  User.init({
    name: DataTypes.STRING,
    wallet_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
