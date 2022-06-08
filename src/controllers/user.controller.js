const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const { uploadToAws } = require('../utils/helpers');
const EVENT = require('../triggers/custom-events').customEvent;
const { NOTIFICATION_TYPE } = require('../utils/enums');
const {roleAuthorization}=require('../middlewares/auth')


const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  // const user =await userService.getUserById(req.query.requestId);
  // console.log(flag);
  // if(user.role == 'admin'){
    const filter = pick(req.query, ['name', 'role']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await userService.queryUsers(filter, options);
    res.status(httpStatus.OK).send(result);
  // }else{
  //   res.status(httpStatus.UNAUTHORIZED).send('Not accessible due to restriction in role')
  // }
});

const getUser = catchAsync(async (req, res) => {
    const user = await userService.getUserById(req.params.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    res.send({ status: true, message: 'Successfull', user });
});

const updateUser = catchAsync(async (req, res) => {
  if (req.files !== undefined && req.files.length > 0 ) {
    let img = await uploadToAws(req.files[0].buffer, `${req.params.userId}/${req.params.userId}-profile-pic.png`);
    req.body.profilePic = img.Location;
  }
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send({status:true,user});
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const followUser = catchAsync(async (req, res) => {
  const { otherUserId } = req.body;
  const user = req.user;
  await userService.followOtherUser(user._id, otherUserId);

  EVENT.emit('send-and-save-notification', {
    receiver: user._id,
    type: NOTIFICATION_TYPE.NEW_FOLLOWER,
    extraData: {
      follower: otherUserId,
    },
  });

  res.status(httpStatus.OK).send({
    status: true,
    message: 'user followed successfully',
  });
});

const unfollowUser = catchAsync(async (req, res) => {
  const { otherUserId } = req.body;
  const user = req.user;

  await userService.unFollowUser(user._id, otherUserId);
  res.status(httpStatus.OK).send({
    status: true,
    message: 'user unfollowed successfully',
  });
});

const getUserFollowers = catchAsync(async (req, res) => {
  const { page, perPage, userId } = req.query;

  const followers = await userService.getUserFollowers(userId, page, perPage);
  res.status(httpStatus.OK).send({
    status: true,
    message: 'successfull',
    data: followers,
  });
});

const getUserFollowing = catchAsync(async (req, res) => {
  const { page, perPage, userId } = req.query;

  const following = await userService.getUserFollowing(userId, page, perPage);
  res.status(httpStatus.OK).send({
    status: true,
    message: 'successfull',
    data: following,
  });
});

const addUserCategory = catchAsync(async (req,res)=>{
  const categories = req.body.category;
  const userId = req.query.userId
  let selectedSubCategoryPercentage = [];
  for(let category in categories){
    const length = categories[category].length;
    // console.log(category+':'+categories[category],"length=>",length);
    var maxPossibleVal;
    switch(category){
      case 'animals_and_wildlife':
      case 'environment_and_conservation':
      case 'disaster_response':
        maxPossibleVal = 4
        break;
      case 'arts_and_culture':
      case 'religion_and_religious_groups':
        maxPossibleVal = 6
        break;
      case 'overseas_aid_and_development':
        maxPossibleVal = 7
        break;
      case 'people_and_community':
        maxPossibleVal = 16
        break;
      case 'health_and_medical':
        maxPossibleVal = 13
        break;
        default:
          maxPossibleVal = 0
    }
    const percentage = (length/maxPossibleVal)*100;
    selectedSubCategoryPercentage.push({[category] : percentage})
  }
  console.log(selectedSubCategoryPercentage);
  const category =await userService.addCategories(userId,categories,selectedSubCategoryPercentage);
  res.status(httpStatus.OK).send({message:'Sucessfull',info:'UPDATED SUCESSFULLY',category})
})

const verifyNuban = catchAsync(async (req,res)=>{
  
})


module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  followUser,
  unfollowUser,
  getUserFollowing,
  getUserFollowers,
  addUserCategory,
  
};
