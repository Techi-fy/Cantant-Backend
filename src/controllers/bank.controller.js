const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bankService } = require('../services');
const { uploadToAws } = require('../utils/helpers');
var excelToJson = require('convert-excel-to-json')
const fs = require('fs');
const EVENT = require('../triggers/custom-events').customEvent;
const { NOTIFICATION_TYPE } = require('../utils/enums');
const {roleAuthorization,getUserIdFromToken}=require('../middlewares/auth');

const addBankAccount = catchAsync(async(req,res)=>{
    const body = req.body;
    const user = await getUserIdFromToken(req);
    body.user = user
    const bankAccount = await bankService.addBankAccount(body);
    // EVENT.emit('add-product-workspace',{
    //   productId:product._id,
    //   workspace:product.workspace
    // });
    res.status(httpStatus.CREATED).send({message:"Successfull",bankAccount})
  })


const getBanks  = catchAsync(async (req, res) => {
      const filter = pick(req.query, ['name', 'category']);
      const options = pick(req.query, ['sortBy', 'limit', 'page']);
      const result = await bankService.queryBankAccounts(filter, options);
      res.status(httpStatus.OK).send(result);
  });
  
const getBank = catchAsync(async (req, res) => {
    const bank = await bankService.getBankAccountById(req.query.bankId);
    if (!bank) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Bank Not Found');
    }
    res.send({ status: true, message: 'Successfull', bank });
});

const updateBank = catchAsync(async (req, res) => {
    const body = req.body;
    const bank = await bankService.updateBankAccountById(req.query.bankAccountId, body);
    res.send({status:true, bank});
});

const deleteBank = catchAsync(async (req, res) => {
  if(req.body.bankAccountIds.length){
    await bankService.deleteBankAccounts(req.body.bankAccountIds);
  }
  const bank = await bankService.deleteBankAccountById(req.query.bankAccountId);
  // EVENT.emit('remove-product-workspace',{
  //   productId:product._id,
  //   workspace:product.workspace
  // });
  res.status(httpStatus.NO_CONTENT).send('Bank Account Deleted Successfully!');
});



module.exports = {
  addBankAccount,
  getBanks,
  getBank,
  updateBank,
  deleteBank

  };
  