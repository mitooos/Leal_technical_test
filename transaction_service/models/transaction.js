const { Sequelize, DataTypes } = require('sequelize')
const sequelize = require('../db/db.js').sequelize

const Transaction = sequelize.define('Transaction',{
  user_id:{
    type: DataTypes.STRING,
    allowNull: false
  },
  created_date:{
    type: DataTypes.DATE,
    allowNull: false
  },
  value:{
    type: DataTypes.FLOAT,
    allowNull: false
  },
  points:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status:{
    type: DataTypes.BOOLEAN,
    allowNull: false
  }

},{

})


module.exports = {Transaction}

