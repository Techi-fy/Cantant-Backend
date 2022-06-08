const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const transactionSchema = mongoose.Schema({
    user:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
    },
    bank:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Bank',
    },
    transaction_type:{type:String,
                        enum:['bank','cash']},
    amount:{
        type:Number
    },
    date:String,
    time:String,
    product:String,
    service:String,
    category:String,
    cashIn:{type:Boolean,default:false},
    cashOut:{type:Boolean,default:false},
    

},{
    timestamps : true
});

transactionSchema.plugin(toJSON)
transactionSchema.plugin(paginate)

const Transaction = mongoose.model('Transaction',transactionSchema);

module.exports = Transaction