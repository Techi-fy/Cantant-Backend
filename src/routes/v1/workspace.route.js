const express = require('express');
const {auth} = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
// const productValidation = require('../../validations/product.validation');
const workspaceController = require('../../controllers/workspace.controller');

const router = express.Router();

router.post('/create',
  // auth('manageUsers'), validate(userValidation.createUser),
   workspaceController.createWorkspace);
  
router.get('/getWorkspace',
  // [auth('manageUsers'), validate(userValidation.getUsers)],
   workspaceController.getWorkspace)

// router.route('/:userId').delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.getUser);
router.get('/details', 
// validate(userValidation.getUser),
   workspaceController.getWorkspace);

router.put('/update',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   workspaceController.updateWorkspace);

   router.delete('/delete',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   workspaceController.deleteWorkspace);
 
   router.post('/addProductCategory',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   workspaceController.addProductCategory);
   
   router.post('/removeProductCategory',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   workspaceController.removeProductCategory);

   router.post('/removeServiceCategory',
//  [auth('manageUsers'), validate(userValidation.updateUser)],
   workspaceController.removeServiceCategory);

   
//   router.post('/addOption',
// //  [auth('manageUsers'), validate(userValidation.updateUser)],
//    workspaceController.addOption);
  
//    router.put('/editOption',
// //  [auth('manageUsers'), validate(userValidation.updateUser)],
//    workspaceController.editOption);

//    router.put('/removeOption',
// //  [auth('manageUsers'), validate(userValidation.updateUser)],
//    workspaceController.removeOptionValue);
  
//    router.put('/deleteOption',
// //  [auth('manageUsers'), validate(userValidation.updateUser)],
//    workspaceController.deleteOption);
  
//    router.post('/addVariation',
// //  [auth('manageUsers'), validate(userValidation.updateUser)],
//    workspaceController.addVariation);

//    router.put('/deleteVariation',
// //  [auth('manageUsers'), validate(userValidation.updateUser)],
//    workspaceController.deleteVariation);

//   router.post('/saveExcelData',workspaceController.saveExcelData)
   
module.exports = router;
