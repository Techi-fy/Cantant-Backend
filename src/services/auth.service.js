const httpStatus = require('http-status');
const web3 = require('web3');
const bcrypt = require('bcryptjs');
const tokenService = require('./token.service');
const userService = require('./user.service');
const Token = require('../models/token.model');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');

// /**
//  * Login with username and password
//  * @param {string} email
//  * @param {string} password
//  * @returns {Promise<User>}
//  */
const loginUserWithEmailAndPassword = async (email, password) => {
  var user = await userService.getUserByEmail(email);
  if(user.isEmailVerified == false){
    throw new ApiError(true, 'Please Verify Your Email First');
  }
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  if ('isblock' in user) {
    if (user.isblock === true) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Account is Blocked!');
    }
  }
  return user;
};

/**
 *
 * @param {string} address
 * @returns  {Promise<User>}
 */
const loginUserWithAddress = async (address) => {
  if (!(await web3.utils.isAddress(address))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'address is not valid');
  }

  const user = await userService.getUserByAddress(address);
  return user;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @headers {string} resetPasswordToken
 * @param {string} password
 * @param {string} newPassword
 * @returns {Promise}
 */

const resetPassword = async (dbUser, code, newPassword) => {
  try {
    // const user = await userService.getUserByEmail(email);
    if (!dbUser) {
      throw new Error('Wrong User');
    }
    if(dbUser.code == code)
      await userService.updateUserById(dbUser._id, { password: newPassword });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const changePassword = async (user,body)=>{
  try{const getuser = await userService.getUserByfind({_id:user})
  console.log(getuser);
  if(!(await getuser.isPasswordMatch(body.currentPassword))){
      throw new ApiError(httpStatus.UNAUTHORIZED,'Current Password Incorrect')
  }else{
    console.log("Iam In 92authService")
    const updatedUser = await userService.updateUserById(user,{password:body.newPassword});
    return updatedUser;
  }
}catch(err){
  throw new ApiError(httpStatus.UNAUTHORIZED, err.message);
}
}

const verifyCode = async (verifyEmailCode, email) => {
  const user = await userService.getUserByEmail(email);
  if(user?.code == verifyEmailCode){
    return true;
  }
  return false;
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error(httpStatus.NOT_FOUND,'User Not Found!');
    }
    await Token.deleteMany({ user: user._id, type: tokenTypes.VERIFY_EMAIL });
    await userService.updateUserById(user._id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

module.exports = {
  refreshAuth,
  resetPassword,
  changePassword,
  verifyEmail,
  verifyCode,
  loginUserWithAddress,
  loginUserWithEmailAndPassword,
};
