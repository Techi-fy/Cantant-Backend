const Joi = require('joi');
const { password, objectId } = require('./custom.validation');
const {ANIMALS_AND_WILDLIFE,
  ENVIRONMENT_AND_CONSERVATION,
  PEOPLE_AND_COMMUNITY,
  HEALTH_AND_MEDICAL,
  DISASTER_RESPONSE,
  ARTS_AND_CULTURE,
  RELIGION_AND_RELIGIOUS_GROUPS,
  OVERSEAS_AID_AND_DEVELOPMENT
  } = require('../utils/enums')

const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    phone_number: Joi.string().required(),
    date_of_join:Joi.date().optional(),
    password: Joi.string().required().custom(password),
    recent_round_up: Joi.string(),
    isblock:Joi.boolean().optional(),
    address:Joi.string(),
    city:Joi.string(),
    state:Joi.string(),
    country:Joi.string(),
    profile_pic:Joi.string(),
    role: Joi.string().required().valid('user','admin')
  })
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    bio: Joi.string().optional(),
    profilePic: Joi.string().optional(),
    name: Joi.string().optional(),
    phone_number: Joi.string().optional(),
    date_of_join:Joi.date().optional(),
    recent_round_up: Joi.string(),
    isblock:Joi.boolean().optional(),
    address:Joi.string(),
    city:Joi.string(),
    state:Joi.string(),
    country:Joi.string(),
    profile_pic:Joi.string(),
    category:Joi.object().keys({
      animals_and_wildlife:Joi.array().items(Joi.string().valid(...Object.values(ANIMALS_AND_WILDLIFE))),
      environment_and_conservation:Joi.array().items(Joi.string().valid(...Object.values(ENVIRONMENT_AND_CONSERVATION))),
      people_and_community:Joi.array().items(Joi.string().valid(...Object.values(PEOPLE_AND_COMMUNITY))),
      health_and_medical:Joi.array().items(Joi.string().valid(...Object.values(HEALTH_AND_MEDICAL))),
      disaster_response:Joi.array().items(Joi.string().valid(...Object.values(DISASTER_RESPONSE))),
      arts_and_culture:Joi.array().items(Joi.string().valid(...Object.values(ARTS_AND_CULTURE))),
      religion_and_religious_groups:Joi.array().items(Joi.string().valid(...Object.values(RELIGION_AND_RELIGIOUS_GROUPS))),
      overseas_aid_and_development:Joi.array().items(Joi.string().valid(...Object.values(OVERSEAS_AID_AND_DEVELOPMENT)))
    })
  })
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getUserFollowers = {
  query: Joi.object().keys({
    userId: Joi.string().required(),
    page: Joi.string().required(),
    perPage: Joi.string().required(),
  }),
};

const getUserFollowing = {
  query: Joi.object().keys({
    userId: Joi.string().required(),
    page: Joi.string().required(),
    perPage: Joi.string().required(),
  }),
};

const followUser = {
  body: Joi.object().keys({
    otherUserId: Joi.string().required(),
  }),
};

const unfollowUser = {
  body: Joi.object().keys({
    otherUserId: Joi.string().required(),
  }),
};

const addCategoryVS = {
  query: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    category:Joi.object().keys({
      animals_and_wildlife:Joi.array().items(Joi.string().valid(...Object.values(ANIMALS_AND_WILDLIFE))),
      environment_and_conservation:Joi.array().items(Joi.string().valid(...Object.values(ENVIRONMENT_AND_CONSERVATION))),
      people_and_community:Joi.array().items(Joi.string().valid(...Object.values(PEOPLE_AND_COMMUNITY))),
      health_and_medical:Joi.array().items(Joi.string().valid(...Object.values(HEALTH_AND_MEDICAL))),
      disaster_response:Joi.array().items(Joi.string().valid(...Object.values(DISASTER_RESPONSE))),
      arts_and_culture:Joi.array().items(Joi.string().valid(...Object.values(ARTS_AND_CULTURE))),
      religion_and_religious_groups:Joi.array().items(Joi.string().valid(...Object.values(RELIGION_AND_RELIGIOUS_GROUPS))),
      overseas_aid_and_development:Joi.array().items(Joi.string().valid(...Object.values(OVERSEAS_AID_AND_DEVELOPMENT)))
    })
  })
}

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  unfollowUser,
  followUser,
  getUserFollowing,
  getUserFollowers,
  addCategoryVS
};
