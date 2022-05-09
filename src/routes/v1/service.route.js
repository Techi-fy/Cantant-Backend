const express = require('express');
const {auth} = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
// const productValidation = require('../../validations/product.validation');
const serviceController  = require('../../controllers/service.controller');

const router = express.Router();

router.post('/create',
  // auth('manageUsers'), validate(userValidation.createUser),
   serviceController.createService);
  
router.get('/query',
  // [auth('manageUsers'), validate(userValidation.getUsers)],
  serviceController.getServices)

// router.route('/:userId').delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.getUser);
router.get('/detail', 
// validate(userValidation.getUser),
  serviceController.getService);

router.put('/update',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
  serviceController.updateService);

router.delete('/delete',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
  serviceController.deleteService);
   
  

  router.post('/saveExcelData',serviceController.saveExcelData)
   
module.exports = router;
