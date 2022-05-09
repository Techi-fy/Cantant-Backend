const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { workspaceService } = require('../services');
const { uploadToAws } = require('../utils/helpers');
var excelToJson = require('convert-excel-to-json')
const fs = require('fs');
const EVENT = require('../triggers/custom-events').customEvent;
const { NOTIFICATION_TYPE } = require('../utils/enums');
const {roleAuthorization}=require('../middlewares/auth');
const { Product } = require('../models');

const createWorkspace = catchAsync(async (req,res)=>{
    const body = req.body;
    const {userId} = req.query
    body.user = userId
    const workspace = await workspaceService.createWorkspace( body );
    EVENT.emit('add-workspace-user',{
        userId,
        workspace : workspace._id
    })
    res.status(httpStatus.CREATED).send({message:'Successful',workspace});
})

const getWorkspaces = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['fullname', 'business_type','workspace']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await productService.queryProducts(filter, options);
    res.status(httpStatus.OK).send(result);
});

const getWorkspace = catchAsync(async (req, res) => {
  const workspace = await workspaceService.getWorkspaceById(req.query.workspaceId);
  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found');
  }
  res.send({ status: true, message: 'Successfull', workspace });
});

const getWorkspaceByUser = catchAsync(async (req, res) => {
  const workspace = await workspaceService.getWorkspaceByUser(req.query.userId);
  if (!workspace) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Workspace not found');
  }
  res.status(httpStatus.OK).send({ status: true, message: 'Successfull', workspace });
});

const updateWorkspace = catchAsync(async (req, res) => {
  const body = req.body;
  // const files=req.files;
  var imgData ;
  var location ;
// if (req.files !== undefined && req.files.length > 0 ) {
//   const ext = files[i].originalname.split('.').pop();
//   let img = await uploadToAws(req.files[0].buffer, `${Date.now}-product-pic.${ext}`);
//   body.image = img.Location;
// }
if(body.image){
  var buf = Buffer.from(req.body.image.replace(/^data:image\/\w+;base64,/, ""),'base64');
  const type = body.image.split(';')[0].split('/')[1];
  if (type == 'jpg' ||type == 'gif' || type == 'png' || type == 'jpeg' || type == 'mp4' || type == 'mpeg'){
    imgData = await uploadToAws(buf,`${Date.now}-product-pic.${type}`);
    location = imgData.Location
  }
}
body.image=location
const product = await workspaceService.updateWorkspaceById(req.query.workspaceId, body );
res.send(product);
});

const deleteWorkspace = catchAsync(async (req, res) => {
const workspace = await workspaceService.deleteWorkspaceById(req.query.workspaceId);
EVENT.emit('remove-workspace-user',{
  workspace:workspace._id,
  user:workspace.user
});
res.status(httpStatus.NO_CONTENT).send();
});

const addProductCategory = catchAsync(async (req,res)=>{
    const {workspaceId} = req.query
    const productCategory = await workspaceService.addProductCategory( workspaceId, req.body );
    res.status(httpStatus.OK).send({message:'Successfull',productCategory})
})

const removeProductCategory = catchAsync(async (req,res)=>{
  const {workspaceId,categoryId} = req.query;
  const removedCategory = await workspaceService.removeProductCategory(workspaceId,categoryId)
  res.status(httpStatus.OK).send({message:'Successfull',removedCategory})
})

const addServiceCategory = catchAsync(async (req,res)=>{
    const {workspaceId} = req.query
    const serviceCategory = await workspaceService.addServiceCategory( workspaceId, req.body);
    res.status(httpStatus.OK).send({message:'Successfull', serviceCategory})
})

const removeServiceCategory = catchAsync(async (req,res)=>{
  const {workspaceId,categoryId} = req.query;
  const removedCategory = await workspaceService.removeServiceCategory(workspaceId,categoryId)
  res.status(httpStatus.OK).send({message:'Successfull',removedCategory})
})

module.exports = {
    createWorkspace,
    getWorkspaces,
    getWorkspace,
    getWorkspaceByUser,
    updateWorkspace,
    deleteWorkspace,
    addProductCategory,
    addServiceCategory,
    removeProductCategory,
    removeServiceCategory,

}
