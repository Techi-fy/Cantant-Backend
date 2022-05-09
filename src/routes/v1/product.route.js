const express = require('express');
const {auth} = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
// const productValidation = require('../../validations/product.validation');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router.post('/create',
  // auth('manageUsers'), validate(userValidation.createUser),
   productController.createProduct);
  
router.get('/getProducts',
  // [auth('manageUsers'), validate(userValidation.getUsers)],
   productController.getProducts)

// router.route('/:userId').delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.getUser);
router.get('/details', 
// validate(userValidation.getUser),
   productController.getProduct);

router.put('/update',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   productController.updateProduct);

   router.delete('/delete',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   productController.deleteProduct);

   router.delete('/delete',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   productController.deleteProduct);
   
  router.post('/addOption',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   productController.addOption);
  
   router.put('/editOption',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   productController.editOption);

   router.put('/removeOption',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   productController.removeOptionValue);
  
   router.put('/deleteOption',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   productController.deleteOption);
  
   router.post('/addVariation',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   productController.addVariation);

   router.put('/deleteVariation',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   productController.deleteVariation);

  router.post('/saveExcelData',productController.saveExcelData)
   
module.exports = router;
