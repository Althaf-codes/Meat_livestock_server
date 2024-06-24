const mongoose = require('mongoose');
const {Product,productSchema} = require('./productSchema');

const orderSchema= mongoose.Schema({
    product:{
        type:productSchema,
        ref:'Product'
       },
       isDiscount:{
        type:Boolean,
        default:false
       },
       discount:{
        type:String,
        default:''
       },
       orderedDate:Date,
       deliveryDate:Date,
       orderStatus:{
        type:String,
        enum:['orderRequest','orderPlaced','shipped','unShipped','cancelled','invoiceUnconfirmed','delivered',''],
        default:'orderRequest'
       },
       sellerID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Seller'
       },
       localAreaAdminID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'LocalAreaAdmin'
       },
       meatSellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'MeatSeller'
       },
       customerID:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
       }],
       quantity:{
        type:Number,
        default:''
       },
       location:{
        "coordinates":[String],
        "address":String,
        "pincode":Number
    },
},{ timestamps: true });


const Order = mongoose.model('Order',orderSchema);

module.exports = {Order,orderSchema};

