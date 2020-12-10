const Sequelize = require('sequelize');
const sequelizeConfig = require('../config/dbConfig');

// Create a person schema 
const person = sequelizeConfig.define('person', {
  // id: {
  //   type: Sequelize.INTEGER,
  //   primaryKey: true,
  // },
  email: Sequelize.STRING,
  password: Sequelize.STRING,
}, {
  schema: 'public',
  tableName: 'person',
  timestamps: false,
});

module.exports = person;