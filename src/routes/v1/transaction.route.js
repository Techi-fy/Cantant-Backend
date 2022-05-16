const express = require('express');
const {auth} = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
// const productValidation = require('../../validations/product.validation');
const transactionController = require('../../controllers/transaction.controller');

const router = express.Router();

router.post('/add',transactionController.createTransaction)

router.get('/query',transactionController.queryTransaction)

router.get('/getByUser',transactionController.getTransactionByUser)

router.put('/update',transactionController.updateTransaction)

router.delete('/remove',transactionController.deleteTransaction)

module.exports = router;