'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    name: DataTypes.STRING,
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isIn: [[1, 2]] // 1: active, 2: inactive
      }
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  User.associate = function(models) {
    // associations can be defined here
  };

  return User;
};
