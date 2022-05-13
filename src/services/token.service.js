const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const { Token } = require('../models');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const bcrypt = require('bcryptjs');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    type,
  };
  const jwttoken=  jwt.sign(payload, secret,{expiresIn : expires});

  return jwttoken;
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (token, userId, type,expires, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    type,
    expires,
    blacklisted,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  // const payload = jwt.verify(token, config.jwt.secret);
  // console.log("payload",payload);
  const tokenDoc = await Token.findOne({ token, type,
    // user: payload.sub,
     blacklisted: false });
  if (tokenDoc == undefined || tokenDoc== null) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  // const expires = moment().add(config.jwt.accessExpirationMinutes, 'm');
  const expires = `${config.jwt.accessExpirationMinutes}m`
  const accessToken =await generateToken(user._id, expires, tokenTypes.ACCESS);
  await saveToken(accessToken, user._id, tokenTypes.ACCESS);
  return accessToken;
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
  // const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'm');
  const expires = `${config.jwt.accessExpirationMinutes}m`
  const verifyEmailToken = generateToken(user._id, expires, tokenTypes.VERIFY_EMAIL);

  await saveToken(verifyEmailToken, user._id, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

const removeToken = async (user) => {
  let res = await Token.findOneAndDelete({ user: user.id });
  return res;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  removeToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
};
