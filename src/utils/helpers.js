const pinataSDK = require('@pinata/sdk');
const config = require('../config/config');
const { Readable } = require('stream');
const AWS = require('aws-sdk');
const fs = require('fs');
const ApiError = require('./ApiError');
const httpStatus = require('http-status');
const stripe = require('stripe')("sk_test_51KJuebHtbJyHQFQJL1OWBxK2numyPgWsaF6nCZSVMCDb11AFezCZTUTZHuUl5wAWl51N439WuLWgssgfQ8hwzslF00wNKONZEN")


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

function formatUSD(stripeAmount) {
  return `$${(stripeAmount / 100).toFixed(2)}`;
}

function formatStripeAmount(USDString) {
  return parseFloat(USDString) * 100;
}

/**
 * 
 * @param {string} email 
 * @param {string} name 
 * @param {string} description 
 * @returns {object}
 */
const createCustomer =async (body)=>{
    var param = {
              email:body.email,
              name:body.name,
              description:"from Node.js"
          }
  const customerCreate = await stripe.customers.create(param)
  return customerCreate
}

const retrieveCustomer = async (cusId)=>{
  const customerGet = await stripe.customers.retrieve(cusId)
  return customerGet;
}

/**
 * 
 * @param {object} card 
 * @param {string} card.number 
 * @param {string} card.exp_month 
 * @param {string} card.exp_year 
 * @param {string} card.cvc 
 * @returns {object} token
 */
const createToken = async(card)=>{
  var param = {};
  param.card = card
 const token = await stripe.tokens.create(param)
 console.log("Customer Info: "+JSON.stringify(token,null,2));
  return token;
}

/**
 * 
 * @param {string} cusId 
 * @param {token} token 
 * @returns 
 */
const addCardToCustomer = async(cusId,token)=>{
  const addCard =await stripe.customers.createSource(cusId,{source:token})
 console.log("Card Info: "+JSON.stringify(addCard,null,2));
  return addCard
}

/**
 * @params {object} params 
 * @param {string} param.amount 
 * @param {string} param.currency 
 * @param {string} param.description 
 * @param {string} param.customer 
 */

const chargeCustomerThroughCustomerID =async (params)=>{
  var param = {
      amount:params.amount,
      currency: params.currency,
      description:params.description,
      customer:params.customer
  }
  const charges = await stripe.charges.create(param)
  return charges;
}

/**
 * @param {object} param 
 * @param {string} param.amount
 * @param {string} param.currency
 * @param {string} param.description
 * @param {string} param.source
 */
const chargeCustomerThroughToken = async (params)=>{
  var param = {
      amount:params.amount,
      currency: params.currency,
      description:params.description,
      source:params.source
  }
  const chargeWithToken = await stripe.charges.create(param)
    return chargeWithToken;
}

const getAllCustomers =async ()=>{
  const customerList = await stripe.customers.list(function(err,customers){
      if(err){
          console.log(err);
      }
      if(customers){
          console.log("Success: "+JSON.stringify(customers, null, 2));
      }else{
          console.log('Something went wrong!');
      }

  })
  return customerList;
}

const  getAllProductsAndPlans= async ()=> {
  return Promise.all(
    [
      await stripe.products.list({}),
      await stripe.plans.list({})
    ]
  ).then(stripeData => {
    var products = stripeData[0].data;
    var plans = stripeData[1].data; 

    plans = plans.sort((a, b) => {
      /* Sort plans in ascending order of price (amount)
       * Ref: https://www.w3schools.com/js/js_array_sort.asp */
      return a.amount - b.amount;
    }).map(plan => {
      /* Format plan price (amount) */
      amount = formatUSD(plan.amount)
      return {...plan, amount};
    });

    products.forEach(product => {
      const filteredPlans = plans.filter(plan => {
        return plan.product === product.id;
      });

      product.plans = filteredPlans;
    });

    return products;
  });
}

const createProduct = async (requestBody)=> {
  return await stripe.products.create({
    name: requestBody.productName,
    type: 'service'
  });
}

const createPlan= async (requestBody) => {
  return await stripe.plans.create({
    nickname: requestBody.planName,
    amount: formatStripeAmount(requestBody.planAmount),
    interval: requestBody.planInterval,
    interval_count: parseInt(requestBody.planIntervalNumber),
    product: requestBody.productId,
    currency: 'USD'
  });
}

const createCustomerAndSubscription = async (requestBody)=> {
  return await stripe.customers.create({
    source: requestBody.stripeToken,
    email: requestBody.customerEmail
  }).then(customer => {
     stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          plan: requestBody.planId
        }
      ]
    });
  });
}

const createSubscription = async (requestBody)=> {
  return await stripe.subscriptions.create({
      customer: requestBody.customerId,
      items: [
        {
          // plan: requestBody.planId
          price: requestBody.priceId
        }
      ]
    });
}

module.exports = {
  uploadToAws,
  deleteFromAWS,
  createCustomer,
  retrieveCustomer,
  createToken,
  addCardToCustomer,
  chargeCustomerThroughCustomerID,
  chargeCustomerThroughToken,
  getAllCustomers,
  getAllProductsAndPlans,
  createProduct,
  createPlan,
  createCustomerAndSubscription,
  createSubscription

};
