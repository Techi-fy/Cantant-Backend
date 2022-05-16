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

};
