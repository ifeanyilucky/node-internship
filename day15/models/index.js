"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const { DataTypes } = require("sequelize");
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const config = {
  DB_DATABASE: "mysql",
  DB_USERNAME: "root",
  DB_PASSWORD: "",
  DB_ADAPTER: "mysql",
  DB_NAME: "day_15",
  DB_HOSTNAME: "localhost",
  DB_PORT: 3306,
};

let sequelize = new Sequelize(
  config.DB_DATABASE,
  config.DB_USERNAME,
  config.DB_PASSWORD,
  {
    dialect: config.DB_ADAPTER,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    host: config.DB_HOSTNAME,
    port: config.DB_PORT,
    logging: console.log,
    timezone: "-04:00",
    pool: {
      maxConnections: 1,
      minConnections: 0,
      maxIdleTime: 100,
    },
    define: {
      timestamps: false,
      underscoredAll: true,
      underscored: true,
    },
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    var model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Modified synchronization function
const syncDatabase = async () => {
  try {
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");
    await sequelize.sync({ force: true });
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database:", error);
  }
};

// Call the synchronization function
syncDatabase();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
