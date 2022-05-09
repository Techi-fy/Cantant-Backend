
const cron = require('node-cron');
const { auctionService, raffleService } = require('../services');
const config = require('../config/config');
const logger = require('../config/logger');

module.exports = () => {
  
  // var nodeCron = cron.schedule('* * * * *', async () => {
  // console.log('cronjob ready for launching Auction Winner');
  // auctionService.checkAndCompleteAuctionStatus();
  // console.log('-----------------------------------------');
  // console.log('cronjob ready for launching Raffle Winner');
  // raffleService.checkRaffleWinnerAndStatus();
// });
}
// const mongoose = require('mongoose');

// mongoose.set('useFindAndModify', false);
// mongoose.connect(config.mongoose.url, config.mongoose.options).then(async () => {
//   logger.info('Connected to MongoDB');
//   // await auctionService.checkAndCompleteAuctionStatus();
// });
