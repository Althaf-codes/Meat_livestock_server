const mongoose = require('mongoose');

const feedSchema = mongoose.Schema({
    brandName:{
        type:String
    },
    includedIngredients:[String],          
    weight:[{
        type:Number,
    }],
    targetSpecies:[String],
    sizes:[String],
    productId:{
        type:mongoose.Types.ObjectId,
        ref:'Product'
    },
    flavour:{type:String},
    itemForm:{type:String},       //dry or wet
    ageRange:[String],
    packageType:{type:String}       //bag or box..like that


},{ timestamps: true });


const Feed= mongoose.model('Feed',feedSchema);

module.exports = {Feed,feedSchema};