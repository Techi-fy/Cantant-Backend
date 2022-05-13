const httpStatus = require('http-status');
const { Bank } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * 
 * @param {Object} userBody 
 * @returns Object
 */
const addBankAccount = async (userBody) => {
      const bank = await Bank.create(userBody);
      return bank.toObject();
};

/**
 * 
 * @param {Array} services 
 * @returns Object
 */
const createManyServices = async (services)=>{
  return await Service.insertMany(services);
}

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBankAccounts = async (filter, options) => {
  const banks = await Bank.paginate(filter, options);
  return banks;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getBankAccountById = async (id) => {
  return await Bank.findById(id).lean();
};
// /**
//  * Get user by id
//  * @param {ObjectId} userId
//  * @param {Object} updateBody
//  * @returns {Promise<User>}
//  */
// const blockUserById = async (userId,updateBody)=>{
//   const user = await User.findByIdAndUpdate(userId,updateBody,{new:true}).lean()
//   return user;
// }

/**
 * Update user by id
 * @param {ObjectId} productId
 * @param {Object} updateBody
 * @returns {Promise<Product>}
 */
const updateBankAccountById = async (serviceId, updateBody) => {
  const service = await Service.findByIdAndUpdate(serviceId,updateBody, {
    new: true,
  });
  return service;
};

/**
 * Delete product by id
 * @param {ObjectId} accountId
 * @returns {Promise<User>}
 */
const deleteBankAccountById = async (accountId) => {
  const bankAccount = await getBankAccountById(accountId);
  if (!bankAccount) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Account not found');
  }
  await Bank.findOneAndDelete(accountId)
  return bankAccount;
};

const deleteBankAccounts = async (serviceIds)=>{
  const deleted = await Service.deleteMany({_id:{$in:serviceIds}});
  console.log(deleted);
  return deleted;
}

const searchServicesByName = async (keyword, page, perPage) => {
  return await Service.find({ name: { $regex: keyword, $options: 'i' } })
    .limit(parseInt(perPage))
    .skip(page * perPage);
};

const addCategories = async(userId,categories,selectedSubCategoryPercentage)=>{
  const product = await Product.findByIdAndUpdate(userId,
    {category:categories,sub_category_percentage:selectedSubCategoryPercentage},
    {new:true});
  return product;
}

const addOption = async ( productId , optionsBody)=>{
  const optionAdd = await Product.findByIdAndUpdate(productId,{$push:{options:optionsBody}},{new:true})
  console.log(optionAdd);  
  return optionAdd;
}

const editOption = async ( query , optionsBody)=>{
  const {productId, optionId} = query;
  console.log(optionId);
  const optionEdit = await Product.findOneAndUpdate({_id:productId,'options._id':optionId},{$push:{'options.$.option_value':optionsBody}},{new:true})
  console.log(optionEdit);  
  return optionEdit;
}

const removeOptionValue = async ( query , optionsBody)=>{
  const {productId, optionId} = query;
  const optionEdit = await Product.findOneAndUpdate({_id:productId,'options._id':optionId},{$pull:{'options.$.option_value':optionsBody}},{new:true});
  console.log(optionEdit);  
  return optionEdit;
}

const deleteOption = async ( query)=>{
  const {productId, optionId} = query;
  const optionRemove = await Product.findOneAndUpdate({_id:productId},{$pull:{'options':{'_id':optionId}}},{new:true})
  console.log(optionRemove);  
  return optionRemove;
}

const addVariation = async ( productId , variationsBody)=>{
  const variationAdd = await Product.findByIdAndUpdate(productId,{$push:{variations:variationsBody}},{new:true})
  console.log(variationAdd);  
  return variationAdd;
}

// const editVariation = async ( productId , variationsBody)=>{
//   const variationAdd = await Product.findByIdAndUpdate(productId,{$push:{variations:variationsBody}},{new:true})
//   console.log(variationAdd);  
//   return variationAdd;
// }

const deleteVariation = async ( query,)=>{
  const {productId, variationId} = query;
  const variationRemove = await Product.findByIdAndUpdate({_id:productId},{$pull:{'variations':{'_id':variationId}}},{new:true})
  console.log(variationRemove);  
  return variationRemove;
}

module.exports = {
  addBankAccount,
  createManyServices,
  queryBankAccounts,
  getBankAccountById,
  updateBankAccountById,
  deleteBankAccountById,
  deleteBankAccounts,
  

};
