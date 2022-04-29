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
    amount:{
        type:String
    },
    date:String,
    time:String,
    product:String,
    service:String,
    category:String,
    cashIn:Boolean,
    cashOut:Boolean,

},{
    timestamps : true
});

transactionSchema.plugin(toJSON)
transactionSchema.plugin(paginate)

const Transaction = mongoose.model('Transaction',transactionSchema);

module.exports = Transaction