
const ROLES = {
  USER : 'user',
  ADMIN : 'admin'
};

const SEARCH_FILTERS = {
  USERS: 'users',
  ARTWORKS: 'artworks',
  AUCTIONS: 'auctions',
  RAFFLES: 'raffles'
};

const HISTORY_TYPE = {
  PRODUCT_CREATED: 'productCreated',
  PRODUCT_DELETED: 'productDeleted',
  AUCTION_STARTED: 'auctionStarted',
  AUCTION_END: 'auctionEnd',
  BID_PLACED: 'bidPlaced',
  CART_CHECKOUT:'cartCheckout',
  RAFFLE_STARTED:'raffleStarted',
  RAFFLE_ENDED:'raffleEnded',
  RAFFLE_ANNOUNCED:'raffleAnnounced',
  RAFFLE_USER_ADDED:'raffleUserAdded'
};

const TRANSACTION_TYPE = {
  DEBIT: 'debit',
  CREDIT: 'credit',
};

const NOTIFICATION_TYPE = {
  NEW_FOLLOWER: 'newFollower',
  NEW_BID: 'newBid',
  AUCTION_TIMEOUT: 'auctionTimeout',
  AUCTION_END: 'auctionEnd',
  AUCTION_WIN: 'auctionWin',
  RAFFLE_WIN:'raffleWin'
};

const ANIMALS_AND_WILDLIFE = {
  ANIMAL_WELFARE : 'animal_welfare',
  WILDLIFE_SUPPORT : 'wildlife_support',
  ANIMALS_SUPPORTING_PEOPLE: 'animals_supporting_people',
  DISASTER_RESPONSE_ANIMALS : 'disaster_response_animals'
}

const ENVIRONMENT_AND_CONSERVATION = {
  HABITAT_CONSERVATION : 'habitat_conservation',
  PARKS_AND_FORESTS : 'parks_and_forests',
  FLORA_REGENERATION_TREE_PLANTING : 'flora_regeneration_tree_planting',
  ENVIRONMENTAL_CAUSES : 'environmental_causes'
}

const PEOPLE_AND_COMMUNITY = {
  AGED_CARE_AND_SENIORS : 'aged_care_and_seniors',
  CHILDRENS_CHARITIES : 'childrens_charities',
  HOMELESSNESS_AND_AFFORDABLE_HOUSING : 'homelessness_and_affordable_housing',
  DOMESTIC_AND_FAMILY_VIOLENCE : 'domestic_and_family_violence',
  DISABILITY_SUPPORT : 'disability_support',
  ASYLUM_SEEKERS_AND_REFUGEES : 'asylum_seekers_and_refugees',
  YOUTH_AND_YOUNG_PEOPLE : 'youth_and_young_people',
  EMPLOYMENT_SERVICES : 'employment_services',
  FAMILIES : 'families',
  INDIGENOUS : 'indigenous',
  LAW_JUSTICE_AND_HUMAN_RIGHTS : 'law_justice_and_human_rights',
  LGBTIQ_PLUS : 'lgbtiq+',
  MEN:'men',
  VETERANS_ExSERVICE_MEN_AND_WOMEN : 'veterans_exservice_men_and_women',
  FOOD_SERVICES_AND_SUPPORT : 'food_services_and_support',
  SPORTING_FACILITIES_AND_COMMUNITY_CLUBS : 'sporting_facilities_and_community_clubs' 
}

const HEALTH_AND_MEDICAL = {
  MEDICAL_AND_CANCER_RESEARCH : 'medical_and_cancer_research',
  MENTAL_HEALTH : 'mental_health',
  HEALTH_AND_ILLNESS_SERVICES : 'health_and_illness_services',
  DISABILITY_AND_MEDICAL_SUPPORT : 'disability_and_medical_support',
  CHILDRENS_HEALTH_AND_MEDICAL_SUPPORT : 'childrens_health_and_medical_support',
  BLINDNESS_AND_DEAFNESS : 'blindness_and_deafness',
  DIABETES : 'diabetes',
  DRUG_ALCOHOL_AND_ADDICTION : 'drug_alcohol_and_addiction',
  HOSPITALS_AND_MEDICAL_CENTRES : 'hospitals_and_medical_centres',
  HEART_AND_LUNG_DISEASE : 'heart_and_lung_disease',
  HIV_AND_AIDS : 'hiv_and_aids',
  PALLIATIVE_CARE : 'palliative_care',
  SAFETY_RESCUE_AND_FIRST_AID : 'safety_rescue_and_first_aid'
}

const DISASTER_RESPONSE = {
  BUSHFIRE_RELIEF_AND_RECOVERY : 'bushfire_relief_and_recovery',
  FLOOD_RELIEF_AND_RECOVERY : 'flood_relief_and_recovery',
  EARTHQUAKE_RESPONSE_AND_RECOVERY : 'earthquake_response_and_recovery',
  DROUGHT_RESPONSE_AND_RECOVERY : 'drought_response_and_recovery'
}

const ARTS_AND_CULTURE = {
  LIBRARIES_AND_MUSEUMS : 'libraries_and_museums',
  ARTS : 'arts',
  CULTURE : 'culture',
  SPORT_AND_RECREATIONY : 'sport_and_recreationy',
  SCIENCE_AND_TECHNOLOGY : 'science_and_technology',
  SOCIAL_ENTERPRISE : 'social_and_enterprise'
}

const RELIGION_AND_RELIGIOUS_GROUPS = {
  CATHOLIC : 'catholic',
  ORTHODOX_CHRISTIAN : 'orthodox_christian',
  OTHER_CHRISTIAN : 'other_christian',
  ISLAM : 'islam',
  BUDDHISM : 'buddhism',
  HINDUISM : 'hinduism'
}

const OVERSEAS_AID_AND_DEVELOPMENT = {
  DISASTER_RELIEF : 'disaster_relief',
  ENVIRONMENT_AND_CONSERVATION : 'environment_and_conservation',
  ANIMALS_AND_WILDLIFE_SUPPORT : 'animals_and_wildlife_support',
  PEOPLE : 'people',
  HEALTH : 'health',
  ARTS_AND_CULTURE : 'arts_and_culture',
  RELIGION_AND_RELIGIOUS_GROUPS : 'religion_and_religious_groups'
}

const concatSubCategoryObjectValues = Object.values(ANIMALS_AND_WILDLIFE)
                                        .concat(Object.values(PEOPLE_AND_COMMUNITY),
                                        Object.values(ENVIRONMENT_AND_CONSERVATION),
                                        Object.values(HEALTH_AND_MEDICAL),
                                        Object.values(DISASTER_RESPONSE),
                                        Object.values(ARTS_AND_CULTURE),
                                        Object.values(RELIGION_AND_RELIGIOUS_GROUPS),
                                        Object.values(OVERSEAS_AID_AND_DEVELOPMENT)
                                        );

module.exports = {
  ROLES,
  SEARCH_FILTERS,
  HISTORY_TYPE,
  TRANSACTION_TYPE,
  NOTIFICATION_TYPE,
  ANIMALS_AND_WILDLIFE,
  ENVIRONMENT_AND_CONSERVATION,
  PEOPLE_AND_COMMUNITY,
  HEALTH_AND_MEDICAL,
  DISASTER_RESPONSE,
  ARTS_AND_CULTURE,
  RELIGION_AND_RELIGIOUS_GROUPS,
  OVERSEAS_AID_AND_DEVELOPMENT,
  concatSubCategoryObjectValues
};
