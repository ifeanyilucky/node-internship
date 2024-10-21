import { Sequelize } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  database: 'codack',
  user: 'codack',
  password: '',
  host: 'localhost',
  port: 5432,
  ssl: true,
  clientMinMessages: 'notice',
});

export default db;