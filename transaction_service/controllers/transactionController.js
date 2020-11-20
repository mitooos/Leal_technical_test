const { Transaction } = require('../models/transaction.js')
const sequelize = require('../db/db.js').sequelize
const { Op } = require('sequelize')
const ExcelJS = require('exceljs')

module.exports.createTransaction = async (req, res) => {
  if (!req.body.user_id || !req.body.value) {
    res.status(400).send({
      message: 'all fields aer required'
    })
    return
  }

  const newTransaction = Transaction.build({
    user_id: req.body.user_id,
    created_date: Date(),
    value: req.body.value,
    points: Math.floor(req.body.value * 0.05),
    status: true
  })

  await newTransaction.save()

  res.send(newTransaction)
}

module.exports.getUsersTransacitions = async (req, res) => {
  const transactions = await Transaction.findAll({
    where: {
      user_id: req.params.userId
    },
    order: [
      ['created_date', 'DESC']
    ]
  })

  res.send(transactions)
}

module.exports.getUsersPoints = async (req, res) => {
  const usersPoints = await Transaction.findOne({
    where: {
      [Op.and]: [
        { user_id: req.params.userId },
        { status: true }
      ]
    },
    attributes: [
      'user_id',
      [sequelize.fn('sum', sequelize.col('points')), 'points']
    ],
    group: ['user_id']
  })
  res.send(usersPoints)
}

module.exports.deactivateTransaction = async (req, res) => {
  const updatedTransaction = await Transaction.findByPk(req.params.transactionId)

  if (!updatedTransaction) {
    res.status(404).send({
      message: 'the transacrion with the given id does not exist'
    })
    return
  }
  updatedTransaction.status = false

  await updatedTransaction.save()

  res.send(updatedTransaction)
}

module.exports.getTransactionsReport = async (req, res) => {
  const transactions = await Transaction.findAll()

  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('transactions')

  sheet.columns = [
    {
      key: 'id',
      header: 'id'
    }, {
      key: 'user_id',
      header: 'user_id'
    }, {
      key: 'created_date',
      header: 'created_date'
    }, {
      key: 'value',
      header: 'value'
    }, {
      key: 'points',
      header: 'points'
    }, {
      key: 'status',
      header: 'status'
    }
  ]

  transactions.forEach(element => {
    sheet.addRow(element.dataValues)
  })

  res.attachment('report.xlsx')
  const buffer = await workbook.xlsx.writeBuffer()
  res.end(buffer)
}
