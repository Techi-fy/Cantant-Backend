const pinataSDK = require('@pinata/sdk');
const config = require('../config/config');
const { Readable } = require('stream');
const AWS = require('aws-sdk');
const fs = require('fs');
const ApiError = require('./ApiError');
const httpStatus = require('http-status');
const sdk = require('api')('@okra/v2.0#b1cfdcbul447wikm');
const stripe = require('stripe')("sk_test_51KJuebHtbJyHQFQJL1OWBxK2numyPgWsaF6nCZSVMCDb11AFezCZTUTZHuUl5wAWl51N439WuLWgssgfQ8hwzslF00wNKONZEN")
const client = require('twilio')(config.twilio.accountSID, config.twilio.authToken);
const fetch = require('node-fetch');



const uploadToAws = (photo, path) => {
  return new Promise(async (resolve, reject) => {
    try {
      const s3 = new AWS.S3();

      const params = {
        Bucket: config.aws.bucket,
        Key: `${path}`,
        Body: photo,
        ACL: 'public-read',
        ContentEncoding: 'base64',
      };
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    } catch (error) {
      console.log('Uploading to amazon error', error);
      reject(err);
    }
  });
};

const deleteFromAWS = (key) => {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new AWS.S3();
      var params = {
        Bucket: config.aws.bucket,
        Key: `${key}`,
      };
      s3.deleteObject(params, (err, data) => {
        if (err) {
          reject();
        } else {
          resolve(data);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

const sendOTPVerifyPhone = async (to,channel)=>{
  const sendOTP = await client.verify.services('VA460d003c6f7870b0365a9fd59ec4dc46')
               .verifications
               .create({to , channel})
              //  .then(verification => console.log("",verification.status));
  return sendOTP;

}

const verifyPhoneCode = async (to,code)=>{
  const phoneVerification = await client.verify.services('VA460d003c6f7870b0365a9fd59ec4dc46')
      .verificationChecks
      .create({to, code})
      // .then(verification_check => console.log(verification_check.status));
  
  return phoneVerification;
    }

const sendOTPviaSMS = async (phoneNumber,OTP) =>{
console.log('in');
client.messages 
      .create({ 
         body: `Dear User,Please Verify your phone Number for Register on CANTANT with given below OTP ${OTP}`,  
         messagingServiceSid: 'MG3a2935979b971786b4cfac0628ea038d',      
         to: `+${phoneNumber}` 
       }) 
      .then(message => console.log(message.sid))
      .catch(err=>console.log(err))
      .done();
}

const verifyNubanviaOkra = async (params)=>{
  sdk.auth(config.okra.authToken);
  sdk.NubanVerify(params,{Accept: 'application/json; charset=utf-8'})
  .then(res => { console.log(res)
        return res;
    })
  .catch(err => console.error(err));
}

const getTransactionsByNuban = async(params)=>{
sdk.auth(config.okra.authToken);
if(params.nuban){
sdk.Gettransactionbynuban(params, {
  Accept: 'application/json; charset=utf-8'
})
  .then( res =>{ console.log(res)
      return res;
    })
  .catch(err => console.error(err));
  }
}

const getTransactionsByCustomerId = async ()=>{


const url = 'https://api.okra.ng/v2/sandbox/transactions/getByCustomer';
const options = {
  method: 'POST',
  headers: {
    Accept: 'application/json; charset=utf-8',
    'Content-Type': 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Mjg2MjI2N2EzNDllMTg3NmY0Mzg4MzEiLCJpYXQiOjE2NTM0ODUzMjh9.GitNVGd2xlH1M4w9vYuH8qh--80Auq_AxwGGAZnnv7Q'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));
}

module.exports = {
  uploadToAws,
  deleteFromAWS,
  sendOTPviaSMS,
  verifyNubanviaOkra,
  getTransactionsByNuban,
  getTransactionsByCustomerId,
  sendOTPVerifyPhone,
  verifyPhoneCode,

};
