const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const User = require('../models/user.model');
const Token = require('../models/token.model');
const { Organization } = require('../models');

const verifyCallback = (req, resolve, reject, requiredRights) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  if (requiredRights.length) {
    const userRights = roleRights.get(user.role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }

  resolve();
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

const roleAuthorization = async (req, res,requireRole) => {
  try{
    let FLAG = false;
    let obj = {};
  const reqToken = req.headers.authorization.split(' ')[1];
  const tokenfound = await Token.findOne({ token: reqToken })
    if (!tokenfound) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "UNAUTHORIZED! Token not found");
    }
    var user = await User.findOne(tokenfound.user)
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "UNAUTHORIZED! Token not match with records");
    }
    if(user.role === requireRole){
      FLAG = true;
    }else{
      throw new ApiError(httpStatus.UNAUTHORIZED,`Request must be made by ${requireRole}`)
      }
      obj.user = user._id;
      obj.FLAG = FLAG
    return obj;
  }catch(err){
    res.status(httpStatus.BAD_REQUEST).send("Bad request with Token")
  }
};

const getUserIdFromToken = async (req)=>{
  try{
    const reqToken = req.headers.authorization.split(' ')[1];
    const tokenfound = await Token.findOne({ token: reqToken })
      if (!tokenfound) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "UNAUTHORIZED! Token not found");
      }
      var user = await User.findOne(tokenfound.user)
      if(!user){
        throw new ApiError(httpStatus.NOT_FOUND, "User not found");
      }
      return user._id;
  }catch(err){
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
  }
}

const checkOrganizationRole = async (req, res) => {
  try{
    let FLAG;
  const reqToken = req.headers.authorization.split(' ')[1];
  const tokenfound = await Token.findOne({ token: reqToken }, (err, result) => {
    if (err || result == undefined) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized due to not found user's Token");
    }
    return result;
  });
  await User.findOne(tokenfound.user)
    .then((result) => {
      if (result.role == 'organization') {
       FLAG = true;
      } else {
        FLAG = false;
      }
      return FLAG;
    })
    // .catch((err) => {
    //   console.log(err);
    //   return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err);
    // });
  }catch(err){
    res.status(httpStatus.BAD_REQUEST).send("Bad request due to token sent")
  }
};


module.exports = {
  auth,
  roleAuthorization,
  checkOrganizationRole,
  getUserIdFromToken,
};
