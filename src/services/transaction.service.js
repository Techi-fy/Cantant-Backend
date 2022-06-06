const httpStatus = require('http-status');
const { Transaction } = require('../models');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const { transactionService } = require('.');
var ObjectId = require('mongodb').ObjectID;
/**
 * 
 * @param {Object} userBody 
 * @returns Object
 */
const createTransaction = async (userBody) => {
      const transaction = await Transaction.create(userBody);
      return transaction.toObject();
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTransactions = async (filter, options) => {
  const transactions = await Transaction.paginate(filter, options);
  return transactions;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getTransactionById = async (id) => {
  return await Transaction.findById(id).lean();
};

const getTransactionByUser = async (id) => {
  return await Transaction.find({user:id});
};

const countTransactions = async (filter)=>{
  // const prev = new Date(filter.Date);
  // console.log(newDate);
  // const filterDate = newDate.toISOString()
  // console.log(filterDate);
  const prev = new Date(new Date().setDate(0)).toISOString();
  console.log(prev);

  const totalCashOut = await Transaction.aggregate([
    {$match:{
       date:{$lte: filter.date},
       cashOut:true
    }},
    {$group:{
          _id:null,cashOut:{$sum:"$amount"}
          // _id:"$cashOut",totalCash:{$sum:"$amount"}
          }
    },
    // {
    //   $count:"Total Transaction in duration"
    // }
])
  const totalCashIn = await Transaction.aggregate([
    {$match:{
       cashIn:true,
       date:{$lte: filter.date},
    }},
    {$group:{
          _id:null,cashIn:{$sum:"$amount"}
          // _id:"$cashOut",totalCash:{$sum:"$amount"}
          }
    },
])
const totalCashInAndOut = {
  totalCashIn,
  totalCashOut
}
  return totalCashInAndOut;
}

const countTotal = async ()=>{
  const totalTransactions = await Transaction.find().then(count=>{return count.length});
  const unCategorizedTransactions = await Transaction.find({category:null}).then(count=>{return count.length});
  const count = {totalTransactions,unCategorizedTransactions}
  return count;
}
const graphTransaction = async (query)=>{
  let startof ;
  let endof;
  let aggregationMatchQuery = {};
  const {cashIn,cashOut,year,user} = query;
  const dateSet = moment().set({'year':year,'month':query.month});
  
  if(query.year){
    startof = moment().startOf('year')
    endof = moment(dateSet).endOf('year')
  }
  if(query.cashIn){
    aggregationMatchQuery = {"user":new ObjectId(`${user}`),"createdAt":{$gte:new Date(startof),$lt:new Date(endof)},"cashIn":true}
    }
  if(query.cashOut){
     aggregationMatchQuery = {"user":new ObjectId(user),"createdAt":{$gte:new Date(startof),$lt:new Date(endof)},"cashOut":true}
    }
  const getMonthsProfit = await Transaction.aggregate([
    { 
      "$match":aggregationMatchQuery
    },
    {
        "$group":{
        "_id":{"month":{"$month":"$createdAt"}},
        "totalAmount":{"$sum":"$amount"}},
      },
   
        // "$group":{
        //     "_id":{"cashOut":"$cashOut",
        //     "$month":"$createdAt"},
        //     "cashOutProfit":{"$sum":"$amount"}
        //   },
       
  ])
  console.log(getMonthsProfit);
  return getMonthsProfit;
}
const reports = async (query)=>{
  let startof ;
  let endof;
  let aggregationMatchQuery = {};
  let transactionQuery = {}
  let {user} = query
  const dateSet = moment().set({'year':query.year,'month':query.month});
  if(query.year){
    startof = moment().startOf('year')
    endof = moment(dateSet).endOf('year')
  }
  if(query.year && query.month){
    startof = moment().startOf('month')
    endof = moment(dateSet).endOf('month')
  }
  if(query.year && query.month && query.date){
    startof = moment().startOf('date');
    endof = moment(dateSet).endOf('date');
  }
  if(query.cashIn){
    // console.log("cashIn",query.cashIn);
     transactionQuery = {user,createdAt:{$gte:new Date(startof).toISOString(),$lt:new Date(endof).toISOString()},cashIn:true}
      aggregationMatchQuery = {"user":new ObjectId(user),"createdAt":{$gte:new Date(startof),$lt:new Date(endof)},"cashIn":true}
    }
  if(query.cashOut){
    // console.log("cashOut",query.cashOut);
     transactionQuery = {user,createdAt:{$gte:new Date(startof).toISOString(),$lt:new Date(endof).toISOString()},cashOut:true};
     aggregationMatchQuery = {"user":new ObjectId(user),"createdAt":{$gte:new Date(startof),$lt:new Date(endof)},"cashOut":true}
    }
  if(!query.cashIn && !query.cashOut){
    // console.log("Cashflow")
    transactionQuery =  {user,createdAt:{$gte:new Date(startof).toISOString(),$lt:new Date(endof).toISOString()}}
    aggregationMatchQuery = {"user":new ObjectId(user),"createdAt":{$gte:new Date(startof),$lt:new Date(endof)}}
  }
  
   let transactions = await Transaction.find(transactionQuery)
  let cashInSum = 0
  let cashOutSum = 0
  for(let transaction of transactions){
    if(transaction.cashIn == true){
      cashInSum += transaction.amount 
    }
    if(transaction.cashOut == true){
      cashOutSum += transaction.amount 
      }
    }
    
    const totalProfit = cashInSum - cashOutSum
    const nums = await Transaction.countDocuments()
    const ranking = await Transaction.aggregate(
      [
        {
          "$match":aggregationMatchQuery
        },
        // Grouping pipeline
          { "$group": { 
              "_id": '$category', 
              "count": { "$sum": 1 },
              "totalAmount":{$sum:"$amount"},              
          }},
          // Project group pipeline for percentage 
          { 
            "$project": {
              "count": 1,
            "percentage": {
                     "$multiply":[{"$divide":["$count",{"$literal": nums }]},100]
                        }, 
            "totalAmount":1 
          }},
          // Sorting pipeline
          { "$sort": { "count": -1 } },
          // Optionally limit results
          { "$limit": 5 },
      ]
  );
  const reportObj = {
    cashInSum,
    cashOutSum,
    totalProfit,
    ranking,
    transactions
  }
  return reportObj;
}

/**
 * Update user by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateTransactionById = async (transactionId, updateBody) => {
  const transaction = await Transaction.findByIdAndUpdate(transactionId,updateBody, {
    new: true,
  });
  return transaction;
};

/**
 * Delete product by id
 * @param {ObjectId} transactionId
 * @returns {Promise<User>}
 */
const deleteTransactionById = async (transactionId) => {
  const transaction = await getTransactionById(transactionId);
  if (!transaction) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found');
  }
  await Transaction.findOneAndDelete(transactionId)
  return transaction;
};

const deleteTransactions = async (transactionIds)=>{
  const deleted = await Transaction.deleteMany({_id:{$in:transactionIds}});
  return true;
}

const searchTransactionsByName = async (keyword, page, perPage) => {
  return await Transaction.find({ name: { $regex: keyword, $options: 'i' } })
    .limit(parseInt(perPage))
    .skip(page * perPage);
};



module.exports = {
  createTransaction,
  queryTransactions,
  getTransactionById,
  updateTransactionById,
  deleteTransactionById,
  deleteTransactions,
  searchTransactionsByName,
  getTransactionByUser,
  countTransactions,
  reports,
  graphTransaction,
  countTotal
}
