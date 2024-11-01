"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Schedule = sequelize.define("Schedule", {
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    status: {
      type: DataTypes.ENUM("confirmed", "cancelled"),
      defaultValue: "confirmed",
    },
  });

  return Schedule;
};
