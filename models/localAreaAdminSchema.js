const mongoose = require('mongoose');
const {Order,orderSchema} = require('./orderSchema');
const ratingSchema = require("./ratingSchema");
const {Product,productSchema} = require('./productSchema');
const localAreaAdminSchema = mongoose.Schema({

    localAreaAdminName:{
        type:String,
        required:true,  
    },
    userID:{
        required:true,
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    phoneNumber:{
        required:true,
        type:String,
        unique:true,
    },
    password:{
        required:true,
        type:String
    },
    location:{
        type:String,
        required:true
    },
    orders:[{
        order:{
            type:orderSchema,
            ref:'Order'}
    }],
    products:[{
        product:{
            type: productSchema,
            ref:'Product'
        },

    }],
    shipments:[{
        shipperId:{
            type:mongoose.Types.ObjectId,
            ref:'Shipper'
        },
        shipmentDetails:{}
    }],
    aadharCardImg:[String],
    certificates:[String],
    drivingLicense:[String],
    workersDetails:[
        {
        workerName:{type:String},
        workerPhoneNumber:{type:String},
        workerAadharCardImg:{type:String},

    }],
    feedStock:{
        type:String,
        enum:["No Stock","Having Stock","Stock Going To End Soon",],
        default:'Having Stock'
    },
    profitMade:String,
    totalMoneySpent:String,
    totalMoneySend:String,
    totalNoOfCattles:Number,

    ratings: [ratingSchema],
    customers:[{
        type:mongoose.Types.ObjectId,          // OR USE USER'S ID AND FETCH INFO ABOUT THEM
        ref:'User'
    }]

},{ timestamps: true });

const LocalAreaAdmin = mongoose.model('LocalAreaAdmin',localAreaAdminSchema);

module.exports = {LocalAreaAdmin,localAreaAdminSchema};