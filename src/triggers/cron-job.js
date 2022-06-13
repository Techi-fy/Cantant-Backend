
const cron = require('node-cron');
const { transactionService } = require('../services');
const config = require('../config/config');
const logger = require('../config/logger');

module.exports = () => {

  // var nodeCron = cron.schedule('0 0 */1 * * *', async () => {
  // console.log('cronjob ready for fetching transactions');
  // transactionService.get();
  // console.log('-----------------------------------------');
  
};
// const mongoose = require('mongoose');

// mongoose.set('useFindAndModify', false);
// mongoose.connect(config.mongoose.url, config.mongoose.options).then(async () => {
//   logger.info('Connected to MongoDB');
//   // await auctionService.checkAndCompleteAuctionStatus();
// });
