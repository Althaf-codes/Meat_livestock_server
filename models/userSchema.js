const mongoose = require('mongoose');
const {productSchema} = require('./productSchema');
const {sellerSchema} =require('./sellerSchema');
const userSchema =  mongoose.Schema({
    userName:{
        required:true,
        type:String,
        //trim:true
    },
    phoneNumber:{
        required:true,
        type:String,
        unique:true,
     //   trim:true  
    },
    password:{
        required:true,
        type:String
    },
address:{
    type:String,
    default:''
},
 cart:[
    {
       product:{
         type:mongoose.Types.ObjectId   ,
         ref:'Product'
        },
       quantity: {
        type: Number,
        default:''
      //  required: true,
      },
    }
    
 ],


 wishlist:[
    {
        product:{
            type:productSchema,
            ref:'Product'
           },
    quantity: {
     type: Number,
     default:''
    // required: true,
   },
 }
],

orders:[{
    product:{
        type:productSchema,
        ref:'Product'
       },
    quantity: {
     type: Number,
     default:''
     //required: true,
}}],


profileImage:{
    type:String,
    default:''
},
isPremiumSeller:{
    type:Boolean,
  //  default:false
},
isSeller:{
    type:Boolean,
 //   default:false
},
isPremiumSeller:{
    type:Boolean,
  //  default:false
},
isLocalAreaAdmin:{
    type:Boolean,
   // default:false
},
isMainAdmin:{
    type:Boolean,
  //  default:false
},
isMeatSeller:{
    type:Boolean,
  //  default:false
},
type:{
type:String,
enum:['user','premiumUser','normalSeller','premiumSeller','mainAdmin','serviceTeam','meatSeller','localAreaAdmin','deliverBoy','Shipper'],
default:'user'
},

chats:{
    type:String,
    default:''
},
sellerID:{
    type:mongoose.Types.ObjectId,
    ref:'Seller'
},
LocalAreaAdminID:{
    type:mongoose.Types.ObjectId,
    ref:'LocalAreaAdmin'
    
},
MeatSellerID:{
    type:mongoose.Types.ObjectId,
    ref:'MeatSeller'
},
MainAdminID:{
    type:mongoose.Types.ObjectId,
    ref:'MainAdmin'
},

},
{ timestamps: true });  

const User = mongoose.model("User", userSchema);

module.exports = {User,userSchema}  ;