const { userService, historyService, notificationService } = require('../services');

const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { SEARCH_FILTERS } = require('../utils/enums');

const handleSearch = catchAsync(async (req, res) => {
  const { keyword, filter, page, perPage } = req.query;

  if (keyword) {
    const users = await userService.searchUsersByName(keyword, page, perPage);
    const artworks = await storeService.searchArtworkByName(keyword, page, perPage);
    const auctions = await auctionService.searchAuctionByName(keyword, page, perPage);
    const raffles = await raffleService.searchRaffleByName(keyword, page, perPage);


    let data = {};

    switch (filter) {
      case SEARCH_FILTERS.USERS:
        data.users = users;
        break;

      case SEARCH_FILTERS.ARTWORKS:
        data.artworks = artworks;
        break;

      case SEARCH_FILTERS.AUCTIONS:
          data.auctions = auctions;
          break;
  
      case SEARCH_FILTERS.RAFFLES:
            data.raffles = raffles;
            break;
    
      default:
        data = {
          users,
          artworks,
          auctions,
          raffles
        };
    }

    res.status(httpStatus.OK).send({
      status: true,
      message: 'Successfull',
      page,
      data,
    });
  } else {
    res.status(httpStatus.OK).send({
      status: true,
      message: 'Successfull',
      data: [],
    });
  }
});

const getAppActivity = catchAsync(async (req, res) => {
  const { page, perPage } = req.query;

  const histories = await historyService.getAllHistoriesPaginated(page, perPage);

  res.status(httpStatus.OK).send({
    status: true,
    message: 'Successfull',
    data: histories,
  });
});

const getUserHistory = catchAsync(async (req,res)=>{
  const {page,perPage, userId,history_type} = req.query;

  const userHistory = await historyService.getUserHistory(page,perPage,userId,history_type);

  res.status(httpStatus.OK).send({
    status:true,
    message:'Successfull',
    data:userHistory,
  })
})

const getNotifications = catchAsync(async (req, res) => {
  const user = req.user;
  const { page, perPage } = req.query;

  const notifications = await notificationService.getUserNotifications(user._id, page, perPage);
  res.status(httpStatus.OK).send({
    status: true,
    message: 'Successfull',
    page,
    data: notifications,
  });
});

const getSettings = catchAsync(async (req, res) =>{
    const foundSetting =await settingService.getSettings()
    res.status(200).json({
      message:'Successful!',
      foundSetting
    })
})

const updateSettings = catchAsync(async (req,res) => {
  const existSetting = await settingService.getSettings()
  console.log(existSetting)
  if( existSetting.length == 0){
    await settingService.createSettings(req.body)
    res.status(200).send('Setting created')
  }else if(existSetting[0]){
    const id=existSetting[0]._id
    const updatedSetting = await settingService.updateSettings(id,req.body)
    res.status(200).json({
      message:'settings_updated',
      updatedSetting
    })
  }
})

module.exports = {
  handleSearch,
  getAppActivity,
  getNotifications,
  getSettings,
  updateSettings,
  getUserHistory
};
