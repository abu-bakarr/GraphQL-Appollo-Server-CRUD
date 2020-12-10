const Sequelize = require('sequelize');
require('dotenv').config()
// this will load .env parameters to process.env
const username = process.env.DB_USER
const password = process.env.DB_PASSWORD
const host = process.env.HOST
const database = process.env.DATABASE


const sequelize = new Sequelize(`postgres://${username}:${password}@${host}:5432/${database}`);
module.exports = sequelize;