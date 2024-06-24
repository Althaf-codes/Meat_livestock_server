const mongoose = require('mongoose');
const {Order,orderSchema} = require('./orderSchema');
const {Product,productSchema} = require('./productSchema');
const {mainAdminSchema,MainAdmin} = require('./mainAdminSchema');
const ratingSchema = require("./ratingSchema");
const sellerSchema = mongoose.Schema(
    {
        sellerName:{
            required:true,
            type:String,
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
        isPremiumSeller:{
            type:Boolean,
            default:false
        },
        companyName:{
            required:true,
            type:String,
        },
        location:{
            required:true,
            type:String,
        },
        specializedCategory:[String],
        orders:[{
            order:{
            type:orderSchema,
            ref:'Order'}
        }],
        //********** (OR)*********//
        // orders:[{
        //     order:{
        //         type:mongoose.Types.ObjectId,
        //         ref:'Order'
        //     },
        // }]
        // products:[{
        //     product:{
        //         type: productSchema,
        //          ref:'Product'
        //        },
        // }],
        products:[{
            productID:{ 
                type:mongoose.Types.ObjectId,
                ref:'Product'
            },
            category:String
        }],
        ratings: [ratingSchema],
        isNewSeller:{type:Boolean,default:true},
        isActive:{type:Boolean,default:false}
    
        
    },{ timestamps: true }
);


// sellerSchema.pre("save",async(doc)=>{
// console.log(`the seller id in pre save is ${doc._id}`);
// let seller = Seller.findById(doc._id);
// if(seller==''||seller==null){
//     let admin = MainAdmin({
//         sellers: doc._id
//     });

//     admin.save();
//     console.log(`admin saved in pre`);
// }
//    // let exisitingSeller = mainAdmin.findOne({'_id':sellerSchema.id});
// });


// sellerSchema.post("save",async(doc)=>{
//     console.log(`the seller id in post save is ${doc._id}`);
//     let seller = await Seller.findById(doc._id);
    
    
//     console.log(`the seller is ${seller}`);
//     let isNewSeller = seller.isNewSeller;

//     if(isNewSeller){

//         let admin = MainAdmin({
//             sellers: doc._id
//         });
    
//         admin.save();
//         await Seller.findByIdAndUpdate(doc._id,{
//             'isNewSeller':false
//         },(err,data)=>{
//         if(err){
//             console.log(`the err in post save is ${err}`);
//         }
//             console.log(`the post save saved data is ${data}`);
//         })
      
//         console.log(`admin saved in post`);
//     }
    
//     });


const Seller = mongoose.model('Seller',sellerSchema);

module.exports={Seller,sellerSchema};