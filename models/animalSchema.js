const mongoose = require('mongoose');

const animalSchema = mongoose.Schema({
    subCategoryType:{
        type:String,
        
    },
    breedType:{
        type:String,
        
    },
    color:{
        type:String,
        
    },
    gender:{
        type:String,
        
    },
    milkCapacityPerday:{
        type:Number,
        
    },
    milkCapacityPerMilking:{
        type:Number,
        
    },
    teeth:{
        type:Number,
        
    },
    age:{
        type:Number,
        
    },
    numberOfOffSpring:{
        type:Number,
        
    },
    approximateWeight:{
        type:Number
    },
    isPregnant:Boolean,
    pregnancyMonth:Number,
    numberOfBirthGiven:Number,
    approximateHeight:Number,
    approximateLength:Number,
    isSellingWithOffspring:Boolean,
    productID:{
        type:mongoose.Types.ObjectId,
        ref:'Product'
    }

    
},{ timestamps: true });

const Animal = mongoose.model('Animal',animalSchema);

module.exports = {Animal,animalSchema};

