const mongoose = require('mongoose');


const fishAndAquaticsSchema = mongoose.Schema({

    name:{type:String},
    category:{
        type:String,
        enum:['eatable','decoration/aesthetic','astrology'] //like that
    },
    productId:{
        type:mongoose.Types.ObjectId,
        ref:'Product'
    },
    breed:{type:String},
    size:[String],
    age:[String],
    colors:[String],
    weight:[String],
    packageType:{type:String},

})

const FishAndAquatics = mongoose.model('FishAndAquatics',fishAndAquaticsSchema);

module.exports = {FishAndAquatics,fishAndAquaticsSchema};


