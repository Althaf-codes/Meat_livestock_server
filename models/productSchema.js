const mongoose = require("mongoose");
const ratingSchema = require("./ratingSchema");

const {animalSchema} =require('./animalSchema');
const {toySchema} = require('./toySchema');
const {accessorySchema} = require('./accessorySchema');
const {feedSchema}  = require('./feedSchema');
const {meatSchema} = require('./meatSchema');
const {fishAndAquaticsSchema} = require('./fishAndAquaticsSchema');
const productSchema = new  mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    
  },
  highlightDescription: {
    type: String,
    required: true,
   
  },
  elaborateDescription:{
    type:String
  },
  images: [
    {
      type:[ String],
      required: true,
    },
  ],
  quantity: {
    type: Number,
    required: true,
  },
  isHavingStock:{
    type:Boolean,
    default:false
  },
  stockQuantity:{
    type:Number,
  },
  price: {
    type: Number,
    required: true,
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  sellerID:{
    type:mongoose.Types.ObjectId,
    ref:'Seller' 
 },
  buyers:[{
    type:mongoose.Types.ObjectId,
    ref:'User'
  }],
  isDiscountable:{
    type:Boolean,
    default:false
  },
  discount:{
    type:Number
  },
  category: {
    categoryName:{
      type:String,
      enum:['pet','cattle','birds','fishAndAquatics','poultry','accessories','medicine','toy','meat','feed'],
     default:'pet'
      },
    pet:{
       type: mongoose.Types.ObjectId,
       ref:'Pet'
     },
    cattle:{
        type: mongoose.Types.ObjectId,
        ref:'Animal'
     },
    accessories:{
        type: mongoose.Types.ObjectId,
        ref:'Accessory'
     },
    toy:{
        type: mongoose.Types.ObjectId,
        ref:'Toy'
    },
    meat:{
        type: mongoose.Types.ObjectId,
        ref:'Meat'
    },
    feed:{
       type: mongoose.Types.ObjectId,
        ref:'Feed'
    },
    birds:{},
    fishAndAquatics:{
       type: mongoose.Types.ObjectId,
       ref:'FishAndAquatics'
    },
     poultry:{},
     medicine:{},

  //    pet:{
  //     type:animalSchema,
  //     ref:'Animal'
  //    },
  //    cattle:{
  //     type:animalSchema,
  //     ref:'Animal'
  //    },
  //    accessories:{
  //     type:accessorySchema,
  //     ref:'Accessory'
  //    },
  //       toy:{
  //        type:toySchema,
  //        ref:'Toy'
  //       },
  //       meat:{
  //        type:meatSchema,
  //        ref:'Meat'
  //       },
  //       feed:{
  //        type:feedSchema,
  //        ref:'Feed'
  //       },
  //       birds:{},
  //  fishAndAquatics:{
  //   type:fishAndAquaticsSchema,
  //   ref:'FishAndAquatics'
  // },
  //  poultry:{},
  //  medicine:{},
  },
  ratings: {
    "rating":[ratingSchema],
    "overalRating":{
      type:Number,
      default:0
    }},
  feedback:[{
    userId:{
      type:mongoose.Types.ObjectId,
      ref:'User'
    },
    comment:{
      type:String
    },
  
  images:[{
    type:String
  }],
  
}],
isDeliverable:{type:Boolean,default:false},
deliverablespan:[String],
  
    
  
},{ timestamps: true });

const Product = mongoose.model("Product", productSchema);
module.exports = {Product,productSchema};