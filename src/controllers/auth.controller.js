const mongoose = require('mongoose')
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService } = require('../services');
const {sendOTPviaSMS} = require('../utils/helpers')
const { checkAdminRole,getUserIdFromToken} = require('../middlewares/auth');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.OK).send({status:true, user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email,password } = req.body;
  var user;
   if(email != undefined && password != undefined ){
    user = await authService.loginUserWithEmailAndPassword(email,password)
  }
  if(user.isEmailVerified == false){
    throw new ApiError(httpStatus.BAD_REQUEST,'Please Verify Your Email');
  }
  if (user){
    // await tokenService.removeToken(user);
    // const tokens = await tokenService.generateAuthTokens(user);
    res.send({
      status: true,
      user:user._id,
      // tokens
    });
  } else {
    res.send({
      status: false,
      user: null,
      // tokens: null,
      message: 'No user found',
    });
  }
});

const logout = catchAsync(async (req, res) => {
  await tokenService.removeToken(req.user);
  res.status(httpStatus.OK).send({
    status: true,
  });
});

const blockUser = catchAsync(async (req,res,next)=>{
  // const isAdmin = await checkAdminRole(req,res);
  
  // if(isAdmin == true){
    const user = await userService.updateUserById(req.params.userId, req.body);
    res.send(`user blocked Status: ${user.isblock}`); 
  // }else{
  //   res.status(httpStatus.UNAUTHORIZED).send('Role is not Admin of requested User!');
  // }
}) 

const forgotPassword = catchAsync(async (req, res) => {
  var dbUser = await userService.getUserByEmail(req.body.email);
  if (!dbUser) {
    return res.status(404).send({
      status: 404,
      message: 'User not found',
    });
  }
  const code = Math.floor(1000+Math.random()*9000);
  // await emailService.mailsendwithnodemailer();
  await emailService.sendResetPasswordEmail(req.body.email, code);
  await userService.saveForgotPasswordCode(req.body.email, code); 
   res.status(200).send({
    code: 200,
    message: 'Password reset email has been successfully sent to your email',
  }); 
});

const verifyCode = catchAsync(async (req, res) => {
  const flag = await authService.verifyCode(req.body.code, req.body.email);
  if (flag) {
    if (req.body.newPassword) {
      await userService.updateUserByEmail(req.body.email, req.body.newPassword);
      res.status(httpStatus.OK).send({
        status: 200,
        message: 'Password updated Successfully',
      });
    } else {
      res.status(httpStatus.OK).send({
        status: 200,
        message: 'Code verified',
      });
    }
  } else {
    res.status(httpStatus.EXPECTATION_FAILED).send({
      status: 400,
      message: 'code didnot verified',
    });
  }
});

const resetPassword = catchAsync(async (req, res) => {
  const {email,code,newPassword} = req.body
  let dbUser = await userService.getUserByEmail(email)
    if (!dbUser) {
      return res.status(404).send({
        status: 404,
        message: 'User not found',
      });
    }
      const passwordUpdatedUser = await authService.resetPassword(dbUser, code, newPassword );
      res.status(httpStatus.OK).json({
        status: 200,
        message: 'Password changed successfully!',
        "userUpdated":passwordUpdatedUser
      });
    console.log(dbUser)
});

const changePassword = catchAsync(async (req,res)=>{
    const user = await getUserIdFromToken(req);
    const body = req.body
    if(user){
      await authService.changePassword(user,body)
      res.status(httpStatus.OK).send({status:true,message:'Password Changed Successfully'})
    }
})

const sendVerificationEmail = catchAsync(async (req,res)=>{
  const email = req.body.email
  const user = await userService.getUserByEmail(email);
  const token = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(email,token)
  res.send('Email Sent')
})

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send("Email Verified!");
});



const verifyPhone = catchAsync(async (req,res)=>{
  console.log('verifyPhone');
  const {phoneNumber,OTP} = req.body;
   await sendOTPviaSMS(phoneNumber,OTP);
  res.status(httpStatus.OK).send({status:true,message:`OTP sent to Phone Number:${phoneNumber} , Please check your SMS inbox!`})
})

module.exports = {
  register,
  login,
  logout,
  blockUser,
  forgotPassword,
  verifyCode,
  resetPassword,
  changePassword,
  verifyEmail,
  verifyPhone,
  sendVerificationEmail,
};
