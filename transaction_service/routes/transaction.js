const express = require('express')
const router = express.Router()

const transactionController = require('../controllers/transactionController.js')

router.post('/', transactionController.createTransaction)
router.get('/points/:userId', transactionController.getUsersPoints)
router.get('/report', transactionController.getTransactionsReport)
router.get('/:userId', transactionController.getUsersTransacitions)
router.put('/:transactionId', transactionController.deactivateTransaction)

module.exports = router
