const { Bid, History } = require('../models');
const { HISTORY_TYPE } = require('../utils/enums');

const getArtworkHistory = async (artworkId, page, perPage, fieldsToPopulate) => {
  return await History.find({ artwork: artworkId })
    .populate(fieldsToPopulate)
    .sort({ createdAt: -1 })
    .limit(parseInt(perPage))
    .skip(page * perPage);
};

const getAllHistoriesPaginated = async (page, perPage) => {
  return await History.find({
    $or: [{ type: HISTORY_TYPE.ARTWORK_CREATED }, { type: HISTORY_TYPE.AUCTION_STARTED }, { type: HISTORY_TYPE.BID_PLACED }]
  })
    .populate('artwork owner auction')
    .populate({
      path: 'bid',
      populate: 'bidder'
    })
    .limit(parseInt(perPage))
    .skip(page * perPage).lean();
};

const getUserHistory = async (page,perPage,userId,history_type) => {
  return await History.find({user:userId,type:history_type})
  .populate('user cart auction raffle')
  .populate({
    path: 'bid',
    populate: 'bidder ',
  })
  
  .limit(parseInt(perPage))
  .skip(page * perPage).lean();
}

module.exports = {
  getArtworkHistory,
  getAllHistoriesPaginated,
  getUserHistory
};
