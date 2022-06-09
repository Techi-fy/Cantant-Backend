const Joi = require('joi');
const { password,objectId } = require('./custom.validation');
const {ROLES} = require('../utils/enums') 

const register = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    role: Joi.string().required().valid(...Object.values(ROLES)),
  }),
};

const login = {
  body: Joi.object().keys({
    phone_number: Joi.string(),
    password:Joi.string(),
    email:Joi.string().email()
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const blockUser={
  params:Joi.object().keys({
    userId:Joi.required().custom(objectId)
  })
}

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required()
  }),
};

const resetPassword = {
  body: Joi.object().keys({  
    email: Joi.string().required().email(),
    code: Joi.number().required(),
    newPassword: Joi.string().required().custom(password),
  }),
};

const verifyCode = {
  body: Joi.object().keys({
    code: Joi.string().length(4).required(),
    email: Joi.string().email().required(),
    newPassword: Joi.string(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  blockUser,
  refreshTokens,
  forgotPassword,
  verifyCode,
  resetPassword,
  verifyEmail,
};
