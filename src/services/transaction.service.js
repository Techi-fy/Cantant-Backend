const httpStatus = require('http-status');
const { Transaction } = require('../models');
const ApiError = require('../utils/ApiError');

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
  countTotal
};
