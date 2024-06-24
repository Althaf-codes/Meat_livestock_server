const mongoose = require('mongoose');
const ratingSchema = require("./ratingSchema");
const meatSellerSchema = mongoose.Schema({
    
    sellerName:{
        required:true,
        type:String
    },
    userID:{
        required:true,
        type:mongoose.Types.ObjectId,
        ref:'User'
    },
    contactNumber:{
        type: Number,
        required:true
    },
    meatShopName:{
        type:String
    },
    location:{
        "coordinates":[String],
        "address":String,
        "pincode":Number
    },
    isNewMeatSeller:{type:Boolean,default:true},
    isActive:{type:Boolean,default:false},
    timings:{
        "openingTime":String,
        "closingTime":String,
        "noOfOpenDays":Number

    },
    products:{
        type:[{
            "categoryName":String,
            "maxKg":Number,
            "minKg":Number,
            "maxKgLimitPerDay":Number,
            "productID":{ 
                type:mongoose.Types.ObjectId,
                ref:'Product'
            },
        }],
        
    },
    ratings: [ratingSchema],
    orders:[{
        type:mongoose.Types.ObjectId,
        ref:"Order"
    }]

    // products:[{
    //     "meatType":"",
    //     ""

    // }]


},{timestamps:true})

