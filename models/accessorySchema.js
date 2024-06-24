const mongoose = require('mongoose');


const accessorySchema =mongoose.Schema({
    brandName:{
        type:String,
    },
    category:{
        type:String,
    },
    type:{
        type:String
    },
    usage:String,
    productId:{
        type:mongoose.Types.ObjectId,
        ref:'Product'
    },
    colors:[String],
    sizes:[Number],
    weight:[Number],
    dimensions:[String],
    material:String,
    countryOfOrigin:String
},{ timestamps: true });

const Accessory = mongoose.model('Accessory',accessorySchema);

module.exports = {Accessory,accessorySchema};