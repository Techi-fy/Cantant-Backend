
const Joi = require('joi');
const { password, objectId } = require('./custom.validation');
const {concatSubCategoryObjectValues} = require('../utils/enums');



const createFeedVS = {
  body:Joi.object().keys({
    organization_name:Joi.string(),
    title:Joi.string(),
    description:Joi.string(),
    image:Joi.string().optional(),
  }) 
}

const updateFeedVS = {
  query:Joi.object().keys({
    feedId:Joi.string().required().custom(objectId)
  }),
  body:Joi.object().keys({
    organization_name:Joi.string(),
    title:Joi.string(),
    description:Joi.string(),
    image:Joi.string().required()
  }) 
}
const getFeedVS = {
  query:Joi.object().keys({
    feedId:Joi.string().custom(objectId),
  }) 
}
const getFeedsOfOrganizationVS = {
  query:Joi.object().keys({
    organization:Joi.string().custom(objectId),
    organization_name:Joi.string(),
    title:Joi.string(),
    page:Joi.number(),
    perPage:Joi.number(),
    limit:Joi.number(),
  }) 
}

const deleteFeedVS = {
  query:Joi.object().keys({
    feedId:Joi.string().custom(objectId),
  })
}
module.exports = {
    createFeedVS,
    deleteFeedVS,
    updateFeedVS,
    getFeedVS,
    getFeedsOfOrganizationVS,
    // AddCommentFeedVS,
    // editCommentFeedVS,
    // deleteCommentFeedVS,
  }