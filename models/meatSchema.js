const mongoose = require('mongoose');

const meatSchema =  mongoose.Schema({
    //Don't know why brandname is. might remove in future
    brandName:{
        type:String
    },
    meatName:{
        type:String
    },
    parts:[{
        type:String
    }],
    weight:[{
        type:Number
    }],
    productId:{
        type:mongoose.Types.ObjectId,
        ref:'Product'
    },
    packageType:[{type:String}] ,
    cutAt:{type:Date},
    deliveryCharge:Number,
    meatSellerId:{
        type:mongoose.Types.ObjectId,
        ref:'MeatSeller'
    }


},{ timestamps: true });

const Meat = mongoose.model('Meat',meatSchema);

module.exports = {Meat,meatSchema};