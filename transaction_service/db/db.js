const { Sequelize } = require('sequelize')

const sequelize = process.env.NODE_ENV === 'test' ? new Sequelize('sqlite::memory:') : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
})

const connectToDb = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    await sequelize.sync()
    console.log('All models were synchronized successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

module.exports.sequelize = sequelize
module.exports.connectToDb = connectToDb
