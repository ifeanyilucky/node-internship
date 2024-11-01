"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Availability = sequelize.define("Availability", {
    dayOfWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 6,
      },
    },
    startHour: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 23,
      },
    },
    startMinute: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 59,
      },
    },
    endHour: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 23,
      },
    },
    endMinute: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 59,
      },
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  return Availability;
};
