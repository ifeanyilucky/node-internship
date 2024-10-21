'use strict';
module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define('Email', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    subject: DataTypes.STRING,
    body: DataTypes.TEXT,
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        isIn: [[1, 2]] // 1: active, 2: inactive
      }
    }
  }, {
    tableName: 'emails',
    timestamps: false
  });

  Email.associate = function(models) {
    // associations 
  };

  return Email;
};
