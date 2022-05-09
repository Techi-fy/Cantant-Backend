const httpStatus = require('http-status');
const { Service } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * 
 * @param {Object} userBody 
 * @returns Object
 */
const createService = async (userBody) => {
      const service = await Service.create(userBody);
      return service.toObject();
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
const queryServices = async (filter, options) => {
  const products = await Service.paginate(filter, options);
  return products;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getServiceById = async (id) => {
  return await Service.findById(id).lean();
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
const updateServiceById = async (serviceId, updateBody) => {
  const service = await Service.findByIdAndUpdate(serviceId,updateBody, {
    new: true,
  });
  return service;
};

/**
 * Delete product by id
 * @param {ObjectId} serviceId
 * @returns {Promise<User>}
 */
const deleteServiceById = async (serviceId) => {
  const service = await getServiceById(serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  await Service.findOneAndDelete(serviceId)
  return service;
};

const deleteServices = async (serviceIds)=>{
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
  createService,
  createManyServices,
  queryServices,
  getServiceById,
  updateServiceById,
  deleteServiceById,
  deleteServices,
  searchServicesByName,
  addCategories,
  addOption,
  addVariation,
  editOption,
  deleteOption,
  deleteVariation,
  removeOptionValue,


};
