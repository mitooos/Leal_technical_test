const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db.js').sequelize

const User = sequelize.define('User', {
  user_id:{
    type: DataTypes.STRING,
    primaryKey: true,
  },
  created_date:{
    type: DataTypes.DATE,
    allowNull: false
  },
  name:{
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname:{
    type: DataTypes.STRING,
    allowNull: false
  },
  birth_date:{
    type: DataTypes.DATE,
    allowNull: false
  },
  email:{
    type: DataTypes.STRING,
    allowNull: false
  },
  password:{
    type: DataTypes.STRING,
    allowNull: false
  }
}, {

})

module.exports = {User}
