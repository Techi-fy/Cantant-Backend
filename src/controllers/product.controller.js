const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { productService } = require('../services');
const { uploadToAws } = require('../utils/helpers');
var excelToJson = require('convert-excel-to-json')
const fs = require('fs');
const EVENT = require('../triggers/custom-events').customEvent;
const { NOTIFICATION_TYPE } = require('../utils/enums');
const {roleAuthorization}=require('../middlewares/auth');
const { Product } = require('../models');

const createProduct = catchAsync(async(req,res)=>{
    const body = req.body;
    var imgData ;
    var location ;
    // if(files){
    //   if(files.length > 0){
    //       for(var i=0;i<files.length;i++){
    //           if (files[i].mimetype == 'image/jpg' || files[i].mimetype == 'image/png' || files[i].mimetype == 'image/jpeg' ||
    //          files[i].mimetype == 'video/mp4' || files[i].mimetype == 'video/mpeg'){
    //           const ext = files[i].originalname.split('.').pop();
    //           imgData[i] = await uploadToAws(files[i].buffer,`${Date.now}-product-pic.${ext}`)
    //           location[i] = imgData[i].Location    
    //       }
    //       }
    //       body.image=location
    //   }
    // }
    if(body.image){
      var buf = Buffer.from(req.body.image.replace(/^data:image\/\w+;base64,/, ""),'base64')
      const type = body.image.split(';')[0].split('/')[1];
      if (type == 'jpg' ||type == 'gif' || type == 'png' || type == 'jpeg' || type == 'mp4' || type == 'mpeg'){
        imgData = await uploadToAws(buf,`${Date.now}-product-pic.${type}`);
        location = imgData.Location
      }
    }
    body.image=location
    const product = await productService.createProduct(body);
    EVENT.emit('add-product-workspace',{
      productId:product._id,
      workspace:product.workspace
    });
    res.status(httpStatus.CREATED).send({message:"Successfull",product})
  })


const getProducts = catchAsync(async (req, res) => {
      const filter = pick(req.query, ['name', 'category']);
      const options = pick(req.query, ['sortBy', 'limit', 'page']);
      const result = await productService.queryProducts(filter, options);
      res.status(httpStatus.OK).send(result);
  });
  
const getProduct = catchAsync(async (req, res) => {
    const product = await productService.getProductById(req.query.productId);
    if (!product) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
    }
    res.send({ status: true, message: 'Successfull', product });
});

const updateProduct = catchAsync(async (req, res) => {
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
    var buf = Buffer.from(req.body.image.replace(/^data:image\/\w+;base64,/, ""),'base64')
    const type = body.image.split(';')[0].split('/')[1];
    if (type == 'jpg' ||type == 'gif' || type == 'png' || type == 'jpeg' || type == 'mp4' || type == 'mpeg'){
      imgData = await uploadToAws(buf,`${Date.now}-product-pic.${type}`);
      location = imgData.Location
    }
  }
  body.image=location
  console.log(body.image)
  const product = await productService.updateProductById(req.query.productId, body);
  res.send(product);
});

const deleteProduct = catchAsync(async (req, res) => {
  if(req.body.productIds.length){
    await productService.deleteProducts(req.body.productIds);
  }
  const product = await productService.deleteProductById(req.query.productId);
  EVENT.emit('remove-product-workspace',{
    productId:product._id,
    workspace:product.workspace
  });
  res.status(httpStatus.NO_CONTENT).send('Product Deleted Successfully!');
});

const addOption = catchAsync(async (req,res)=>{
  const optionAdded = await productService.addOption(req.query.productId,req.body)
  res.status(httpStatus.OK).send({message:'Successful', optionAdded})
})

const editOption = catchAsync(async(req,res)=>{
  const edited = await productService.editOption(req.query,req.body.option_value)
  res.status(httpStatus.OK).send({message:'Successful', edited })
})

const removeOptionValue = catchAsync(async(req,res)=>{
  const edited = await productService.removeOptionValue(req.query,req.body.option_value)
  res.status(httpStatus.OK).send({message:'Successful', edited })
})

const deleteOption = catchAsync(async(req,res)=>{
  const deleted = await productService.deleteOption(req.query)
  res.status(httpStatus.OK).send({message:'Successful', deleted })
})

const addVariation = catchAsync(async (req,res)=>{
  const variationAdded = await productService.addVariation(req.query.productId,req.body)
  res.status(httpStatus.OK).send({message:'Successful', optionAdded: variationAdded})
})

const deleteVariation = catchAsync(async (req,res)=>{
  const variationAdded = await productService.deleteVariation(req.query,req.body)
  res.status(httpStatus.OK).send({message:'Successful', optionAdded: variationAdded})
})

const saveExcelData = catchAsync(async (req,res)=>{
  const excelFile = req.files[0];
  const ext = req.files[0].originalname.split('.').pop();
  if(ext == 'xls' || ext == 'xlsx'){
    const excelData = excelToJson({
      source:  excelFile.buffer,
      sheets:[{
      // Excel Sheet Name
      name: 'Sheet1',
      // Header Row -> be skipped and will not be present at our result object.
      header:{
      rows: 1
      },
      // Mapping columns to keys
      columnToKey: {
      A: 'No',
      B: 'name',
      C: 'option1_name',
      D: 'option1_value',
      E: 'option2_name',
      F: 'option2_value',
      G: 'category',
      H: 'sku',
      I: 'barcode',
      J: 'selling_price',
      K: 'image'
      }
      }]
      });
      // -> Log Excel Data to Console
      // Insert Json-Object to MongoDB
      excelData.Sheet1.forEach(eachObj=>{
        if(eachObj.option1_name){
          eachObj.options=[
            {
            option_name:eachObj.option1_name,
            option_value:eachObj.option1_value,
          },
        ]
        if(eachObj.option2_name){
          eachObj.options.push({ 
            option_name:eachObj.option2_name,
            option_value:eachObj.option2_value
          })
        }
        }
      })
      const products = await productService.createManyProducts(excelData.Sheet1)
      if(products){
        res.status(httpStatus.CREATED).send({message:'Successfull',products});
      }
      ;
       
  }
});

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    addOption,
    editOption,
    removeOptionValue,
    deleteOption,
    addVariation,
    deleteVariation,
    saveExcelData,

  };
  