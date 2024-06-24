const mongoose = require('mongoose');
const {animalSchema} =require('./animalSchema');
const {toySchema} = require('./toySchema');
const {accessorySchema} = require('./accessorySchema');
const {feedSchema}  = require('./feedSchema');
const {meatSchema} = require('./meatSchema');
const categorySchema = mongoose.Schema({
    categoryName:{
    type:String,
    enum:['pets','cattle','birds','fishAndAquatics','poultry','accessories','medicine','toy','meat','feed'],
   default:'pets'
},
   pet:{
    type:animalSchema,
    ref:'Animal'
   },
   cattle:{
    type:animalSchema,
    ref:'Animal'
   },
   accessories:{
    type:accessorySchema,
    ref:'Accessory'
   },
      toy:{
       type:toySchema,
       ref:'Toy'
      },
      meat:{
       type:meatSchema,
       ref:'Meat'
      },
      feed:{
       type:feedSchema,
       ref:'Feed'
      },
   
   
},{ timestamps: true });

// const Category = mongoose.model('Category',categorySchema);
// module.exports = {Category,categorySchema};


// birds:{},
//    fishAndAquatics:{},
//    poultry:{},
//    medicine:{},