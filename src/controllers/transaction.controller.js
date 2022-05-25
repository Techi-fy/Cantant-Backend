const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { transactionService } = require('../services');
// const { uploadToAws } = require('../utils/helpers');
const EVENT = require('../triggers/custom-events').customEvent;
// const { NOTIFICATION_TYPE } = require('../utils/enums');
// const {roleAuthorization,getUserIdFromToken}=require('../middlewares/auth');
const { Product } = require('../models');

const createTransaction = catchAsync(async (req,res)=>{
    const body = req.body;
    const user =  req.query.userId 
                  // || await getUserIdFromToken(req);
    body.user = user
    const transaction = await transactionService.createTransaction( body );
    // EVENT.emit('add-transaction-user',{
    //     userId,
    //     transaction : transaction._id
    // })
    res.status(httpStatus.CREATED).send({message:'Successful', transaction });
})

const queryTransaction = catchAsync(async (req, res) => {
    const filter = pick(req.query, [ 'fullname', 'business_type' , 'cashIn', 'cashOut' ]);
    const options = pick(req.query, [ 'sortBy', 'limit' , 'page' , 'perPage' ]);
    const result = await transactionService.queryTransactions(filter, options);
    res.status(httpStatus.OK).send(result);
});

const getTransaction = catchAsync(async (req, res) => {
  const transaction = await transactionService.getTransactionById(req.query.transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  res.send({ status: true, message: 'Successfull', transaction });
});

const getTransactionByUser = catchAsync(async (req, res) => {
  const transaction = await transactionService.getTransactionByUser(req.query.userId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Transaction not found');
  }
  res.status(httpStatus.OK).send({ status: true, message: 'Successfull', transaction });
});

const updateTransaction = catchAsync(async (req, res) => {
  const body = req.body;
const transaction = await transactionService.updateTransactionById(req.query.transactionId, body );
res.send({status:true,transaction});
});

const deleteTransaction = catchAsync(async (req, res) => {
const transaction = await transactionService.deleteTransactionById(req.query.transactionId);
// EVENT.emit('remove-workspace-user',{
//   workspace:transaction._id,
//   user:transaction.user
// });
res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createTransaction,
  queryTransaction,
  getTransaction,
  getTransactionByUser,
  updateTransaction,
  deleteTransaction,

}
