const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { servicesService } = require('../services');
const { uploadToAws } = require('../utils/helpers');
const EVENT = require('../triggers/custom-events').customEvent;
const { NOTIFICATION_TYPE } = require('../utils/enums');
var excelToJson = require('convert-excel-to-json')


const createService = catchAsync(async(req,res)=>{
    const body = req.body;
    const service = await servicesService.createService(body);
    EVENT.emit('add-service-workspace',{
      product:service._id,
      workspace:service.workspace
    })
    res.status(httpStatus.CREATED).send({message:"Successfull",service})
  })


const getServices = catchAsync(async (req, res) => {
      const filter = pick(req.query, ['name', 'category','location','duration']);
      const options = pick(req.query, ['sortBy', 'limit', 'page']);
      const result = await servicesService.queryServices(filter, options);
      res.status(httpStatus.OK).send(result);
  });
  
const getService = catchAsync(async (req, res) => {
    const service = await servicesService.getServiceById(req.query.serviceId);
    if (!service) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
    }
    res.send({ status: true, message: 'Successfull', service });
});

const updateService = catchAsync(async (req, res) => {
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
  const service = await servicesService.updateServiceById(req.query.serviceId, body);
  res.send(service);
});

const deleteService = catchAsync(async (req, res) => {
  if(Array.isArray( req.query.serviceId)){
    const servicesDeleted = await servicesService.deleteServices(req.query.serviceId);
    if(!servicesDeleted){
        res.status(httpStatus.BAD_REQUEST).send('some Services not found!');
    }
  }else{
    await servicesService.deleteServiceById(req.query.serviceId);
  }
  res.status(httpStatus.NO_CONTENT).send();
});

// const addOption = catchAsync(async (req,res)=>{
//   const optionAdded = await productService.addOption(req.query.productId,req.body)
//   res.status(httpStatus.OK).send({message:'Successful', optionAdded})
// })

// const editOption = catchAsync(async(req,res)=>{
//   const edited = await productService.editOption(req.query,req.body.option_value)
//   res.status(httpStatus.OK).send({message:'Successful', edited })
// })

// const removeOptionValue = catchAsync(async(req,res)=>{
//   const edited = await productService.removeOptionValue(req.query,req.body.option_value)
//   res.status(httpStatus.OK).send({message:'Successful', edited })
// })

// const deleteOption = catchAsync(async(req,res)=>{
//   const deleted = await productService.deleteOption(req.query)
//   res.status(httpStatus.OK).send({message:'Successful', deleted })
// })

// const addVariation = catchAsync(async (req,res)=>{
//   const variationAdded = await productService.addVariation(req.query.productId,req.body)
//   res.status(httpStatus.OK).send({message:'Successful', optionAdded: variationAdded})
// })

// const deleteVariation = catchAsync(async (req,res)=>{
//   const variationAdded = await productService.deleteVariation(req.query,req.body)
//   res.status(httpStatus.OK).send({message:'Successful', optionAdded: variationAdded})
// })
const saveExcelData = catchAsync(async (req,res)=>{
  const excelFile = req.files[0];
  const ext = req.files[0].originalname.split('.').pop();
  if(ext == 'xls' || ext == 'xlsx'){
    const excelData = excelToJson({
      source:  excelFile.buffer,
      sheets:[{
      // Excel Sheet Name
      name: 'Sheet2',
      // Header Row -> be skipped and will not be present at our result object.
      header:{
      rows: 1
      },
      // Mapping columns to keys
      columnToKey: {
      A: 'No',
      B: 'service_name',
      C: 'category',
      D: 'location',
      E: 'assign',
      F: 'duration',
      G: 'tax',
      H: 'price_type',
      I: 'price',
      J: 'consumable_name',
      K: 'consumable_variation',
      L: 'consumable_quantity',
      M: 'unit',
      N: 'consumable_price'
      }
      }]
      });
      // -> Log Excel Data to Console
      // Insert Json-Object to MongoDB
  let dataBody = excelData.Sheet2;

      dataBody.forEach(service=>{
        service.consumables = [{
          product:service.consumable_name,
          variation:[service.consumable_variation],
          quantity:service.consumable_quantity,
          unit:service.unit,  
          price:service.consumable_price,
        }]
      })
      console.log(dataBody);
      const services = await servicesService.createManyServices(dataBody);
      res.status(httpStatus.CREATED).send({message:'Successfull',services});
  }
});

module.exports = {
    createService,
    getServices,
    getService,
    updateService,
    deleteService,
    // addOption,
    // editOption,
    // removeOptionValue,
    // deleteOption,
    // addVariation,
    // deleteVariation
    saveExcelData
  };
  