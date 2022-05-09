const { User, Store: Artwork, Auction, History, Notification, Transaction,Cause, Workspace } = require('../models');
const { settingService } = require('../services');
const { MINT_STATUS } = require('../utils/enums');
const logger = require('../config/logger');

const addCollectionInUser = async (params) => {
  const { collectionId, userId } = params;
  await User.findOneAndUpdate(
    { _id: userId },
    {
      $push: { collections: collectionId },
    }
  );
  console.log('collection added in user successfully');
};

const addArtworkInUser = async (params) => {
  const { artworkId, userId } = params;
  await User.findOneAndUpdate(
    { _id: userId },
    {
      $push: { artworks: artworkId },
    }
  );
  console.log('artwork added in user successfully');
};

const addArtworkInCollection = async (params) => {
  const { artworkId, collectionId } = params;
  await Collection.findOneAndUpdate(
    { _id: collectionId },
    {
      $push: { artworks: artworkId },
    }
  );
  console.log('artwork added in collection successfully');
};

const saveBidInAuction = async (params) => {
  const {  bid,  auction,bid_amount } = params;
  
  await Auction.findOneAndUpdate(
    { _id: auction },
    {
      $push: { bids: {bidId:bid ,
      bid_amount: bid_amount  }
      }
    })
    console.log('bid saved in auction successfully');
};

const openArtworkAuction = async (params) => {
  const { artworkId, auction } = params;
  await Artwork.findOneAndUpdate(
    { _id: artworkId },
    {
      auction: auction,
      isAuctionOpen: true,
    }
  );
  console.log('auction opened for artwork successfully');
};

const updateArtworkHistory = async (params) => {
  await History.create(params);
};
const updateHistory = async (params) => {
  await History.create(params);
};

const updateUserHistory = async (params) => {
  await History.create(params);
  console.log("Cart checkout history updated");
};
const createNotification = async (params) => {
  // const setting =await settingService.getSettings()
  // const notificationPermissioninSetting = setting[0].notifications
  // if(notificationPermissioninSetting === false){
    await Notification.create(params);
    logger.info('Notification Sent!')
  // }
};

const createTransaction = async (params) => {
  const transact = await Transaction.create(params);
  console.log('--transaction created successfully--:', transact);
};

const addCauseOrganization = async (params) => {
  const {organization,causeId} = params;
  const organizationUpdated = await Organization.findByIdAndUpdate(organization,{$push:{causes:causeId}},{new:true});
  if(organizationUpdated){
    console.log('cause added-in-organization successfully');
  }
}

const removeCauseOrganization = async (params) =>{
  const {causeId,organization} = params;
  const causeRemoved = await Organization.findByIdAndUpdate(organization,{$pull:{causes:causeId}});
  if(causeRemoved){
    console.log('Cause-removed-from-organiation-Causes-list')
  }
}

const addFeedOrganization = async (params) => {
  const {organization,feedId} = params;
  const feedUpdated = await Organization.findByIdAndUpdate(organization,{$push:{feeds:feedId}},{new:true});
  console.log(feedUpdated);
  if(feedUpdated){
    console.log('feed added-in-organization successfully');
  }
}

const removeFeedOrganization = async (params) =>{
  const {feedId,organization} = params;
  const feedRemoved = await Organization.findByIdAndUpdate(organization,{$pull:{feeds:feedId}});
  if(feedRemoved){
    console.log('Feed-removed-from-organiation-feeds-list')
  }
}

// const addTransactionHistory = async (params) => {
  
//   const history = await History.create(params)
//   if(history){
//     console.log('----Transaction-History-Created-Sucessfully----')
//   }
// }

const addWorkspaceUser = async (params)=>{
  const {userId,workspace} = params;
   await User.findByIdAndUpdate(userId,{ workspace },{new:true})
  console.log('workspace-added-in-User')
}

const removeWorkspaceUser = async (params) =>{
const {workspace,user} = params;
  await User.findByIdAndUpdate(user,{$set:{workspace:null} },{new:true})
console.log('workspace-removed-from-User');
}

const addProductWorkspace = async (params)=>{
  const {product,workspace} = params;
  await Workspace.findByIdAndUpdate(workspace,{$push:{products:product}})
  console.log('Product-Added-Into-Workspace');
} 

const removeProductWorkspace = async (params)=>{
  const {product, workspace} = params
  await Workspace.findByIdAndUpdate(workspace,{$pull:{products:product}})
  console.log('Product-Removed-From-Workspace');

}

const addServiceWorkspace = async (params)=>{
  const {service,workspace} = params;
  await Workspace.findByIdAndUpdate(workspace,{$push:{services:service}})
  console.log('Service-Added-Into-Workspace');
} 

const removeServiceWorkspace = async (params)=>{
  const {service,workspace} = params;
  await Workspace.findByIdAndUpdate(workspace,{$pull:{services:service}});
  console.log('Service-Removed-From-Workspace');
} 



module.exports = {
  addCollectionInUser,
  addArtworkInUser,
  addArtworkInCollection,
  saveBidInAuction,
  openArtworkAuction,
  updateArtworkHistory,
  createNotification,
  createTransaction,
  updateUserHistory,
  updateHistory,
  addCauseOrganization,
  addFeedOrganization,
  removeFeedOrganization,
  removeCauseOrganization,
  //-----------------------
  addWorkspaceUser,
  removeWorkspaceUser,
  addProductWorkspace,
  removeProductWorkspace,
  addServiceWorkspace,
  removeServiceWorkspace,


};
