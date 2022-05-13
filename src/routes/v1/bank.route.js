const express = require('express');
const {auth} = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
// const productValidation = require('../../validations/product.validation');
const bankController = require('../../controllers/bank.controller');

const router = express.Router();

router.post('/create',
  // auth('manageUsers'), validate(userValidation.createUser),
   bankController.addBankAccount);
  
router.get('/all',
  // [auth('manageUsers'), validate(userValidation.getUsers)],
   bankController.getBanks)

router.get('/details', 
// validate(userValidation.getUser),
   bankController.getBank);

router.put('/update',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   bankController.updateBank);

 router.delete('/delete',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   bankController.deleteBank);

   
module.exports = router;
