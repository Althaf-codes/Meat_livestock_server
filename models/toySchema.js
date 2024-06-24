const mongoose = require('mongoose');


const toySchema = mongoose.Schema({
    brandName:{
        required:true,
        type:String,
    },
    category:{
        required:true,
        type:String,
    },
    type:{
        required:true,
        type:String,
    },
    usage:String,
    productId:{
        type:mongoose.Types.ObjectId,
        ref:'Product'
    },
    colors:[String],
    sizes:[String],
    weight:[Number],
    dimensions:[String],
    material:String,
    countryOfOrigin:String

},{ timestamps: true });
        
        
    

const Toy = mongoose.model('Toy',toySchema);

module.exports = {Toy,toySchema};