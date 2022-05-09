const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const bankSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref:'User',
    },
    bank_account:{
        type:String,
        required:false,
        trim:true
    },
    account_number:{
        type:String,
        required:false,
        trim:true
    },
    expire_on:{
        type:String,
        required:false
    },
    isblock: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
bankSchema.plugin(toJSON);
bankSchema.plugin(paginate);


/**
 * @typedef User
 */
const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;
