const httpStatus = require('http-status');
const { Workspace } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * 
 * @param {Object} userBody 
 * @returns Object
 */
const createWorkspace = async (userBody) => {
      const product = await Workspace.create(userBody);
      return product.toObject();
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
const queryWorkspaces = async (filter, options) => {
  const products = await Workspace.paginate(filter, options);
  return products;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getWorkspaceById = async (id) => {
  return await Workspace.findById(id).lean();
};

const getWorkspaceByUser = async (id) => {
  return await Workspace.findOne({user:id}).lean();
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
const updateWorkspaceById = async (workspaceId, updateBody) => {
  const workspace = await Workspace.findByIdAndUpdate(workspaceId,updateBody, {
    new: true,
  });
  return workspace;
};

/**
 * Delete product by id
 * @param {ObjectId} workspaceId
 * @returns {Promise<User>}
 */
const deleteWorkspaceById = async (workspaceId) => {
  const workspace = await getWorkspaceById(workspaceId);
  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found');
  }
  await Workspace.findOneAndDelete(workspaceId)
  return workspace;
};

const deleteWorkspaces = async (productIds)=>{
  const deleted = await Workspace.deleteMany({_id:{$in:productIds}});
  return true;
}

const searchWorkspacesByName = async (keyword, page, perPage) => {
  return await Workspace.find({ name: { $regex: keyword, $options: 'i' } })
    .limit(parseInt(perPage))
    .skip(page * perPage);
};

// const addOption = async ( productId , optionsBody)=>{
//   const optionAdd = await Product.findByIdAndUpdate(productId,{$push:{options:optionsBody}},{new:true})
//   console.log(optionAdd);  
//   return optionAdd;
// }

// const editOption = async ( query , optionsBody)=>{
//   const {productId, optionId} = query;
//   console.log(optionId);
//   const optionEdit = await Product.findOneAndUpdate({_id:productId,'options._id':optionId},{$push:{'options.$.option_value':optionsBody}},{new:true})
//   console.log(optionEdit);  
//   return optionEdit;
// }

const removeProductCategory = async ( workspaceId , categoryId)=>{
  const categoryUpdated = await Workspace.findOneAndUpdate({_id:workspaceId},{$pull:{product_categories:{_id:categoryId}}},{new:true});
  console.log(categoryUpdated);  
  return categoryUpdated;
}

const removeServiceCategory = async ( workspaceId , categoryId)=>{
  const categoryUpdated = await Workspace.findOneAndUpdate({_id:workspaceId},{$pull:{'services_categories.$._id':categoryId}},{new:true});
  console.log(categoryUpdated);  
  return categoryUpdated;
}

// const deleteOption = async ( query)=>{
//   const {productId, optionId} = query;
//   const optionRemove = await Product.findOneAndUpdate({_id:productId},{$pull:{'options':{'_id':optionId}}},{new:true})
//   console.log(optionRemove);  
//   return optionRemove;
// }

// const addVariation = async ( productId , variationsBody)=>{
//   const variationAdd = await Product.findByIdAndUpdate(productId,{$push:{variations:variationsBody}},{new:true})
//   console.log(variationAdd);  
//   return variationAdd;
// }

// const editVariation = async ( productId , variationsBody)=>{
//   const variationAdd = await Product.findByIdAndUpdate(productId,{$push:{variations:variationsBody}},{new:true})
//   console.log(variationAdd);  
//   return variationAdd;
// }

// const deleteVariation = async ( query,)=>{
//   const {productId, variationId} = query;
//   const variationRemove = await Product.findByIdAndUpdate({_id:productId},{$pull:{'variations':{'_id':variationId}}},{new:true})
//   console.log(variationRemove);  
//   return variationRemove;
// }

const addProductCategory = async ( workspaceId, body )=>{
    const category = await Workspace.findByIdAndUpdate(workspaceId,{$push:{product_categories:body}},{new:true});
    return category;
}

const addServiceCategory = async ( workspaceId, body )=>{
    const category = await Workspace.findByIdAndUpdate(workspaceId,{$push:{service_categories:body}},{new:true});
    return category;
}


module.exports = {
  createWorkspace,
  queryWorkspaces,
  getWorkspaceById,
  updateWorkspaceById,
  deleteWorkspaceById,
  deleteWorkspaces,
  searchWorkspacesByName,
  getWorkspaceByUser,
  addProductCategory,
  addServiceCategory,
  removeProductCategory,
  removeServiceCategory,
//   addOption,
//   addVariation,
//   editOption,
//   deleteOption,
//   deleteVariation,
//   removeOptionValue,


};
