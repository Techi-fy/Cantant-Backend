const express = require('express');
const { generalController } = require('../../controllers');
const {auth} = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { generalValidation } = require('../../validations');

const router = express.Router();

router.get('/search', generalController.handleSearch);
router.get('/getAppActivity', validate(generalValidation.getActivityVS), generalController.getAppActivity);

router.get(
  '/getNotifications',
  [auth('manageUsers'), validate(generalValidation.getActivityVS)],
  generalController.getNotifications
);

router.get(
  '/userHistory',
  [auth('manageUsers'),validate(generalValidation.getUserHistoryVS)],
  generalController.getUserHistory );

router.get('/getSettings',[auth('manageUsers')],generalController.getSettings)
router.post('/updateSettings',[auth('manageUsers'),validate(generalValidation.getSettingsVS)],generalController.updateSettings)

module.exports = router;
