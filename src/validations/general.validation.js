const Joi = require('joi');
const { password } = require('./custom.validation');

const getActivityVS = {
  query: Joi.object().keys({
    page: Joi.string().required(),
    perPage: Joi.string().required(),
  }),
};
const getUserHistoryVS = {
  query: Joi.object().keys({
    page: Joi.string().required(),
    perPage: Joi.string().required(),
    userId:Joi.string().required(),
    history_type:Joi.string()

  }),
};
const getSettingsVS = {
  body:Joi.object().keys({
    notifications: Joi.boolean(),
    bid_notifications: Joi.boolean(),
    royalty:Joi.number(),
    minimum_bid:Joi.number()
  })
}

module.exports = {
  getActivityVS,
  getSettingsVS,
  getUserHistoryVS
};
