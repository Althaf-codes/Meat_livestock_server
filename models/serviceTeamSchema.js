const mongoose = require('mongoose');


const serviceTeamSchema = mongoose.Schema({
    teamAdminName:{
         type:String
        },

    teamAdminPassword:{type:String},
    teamAdminPhoneNumber:{
        required:true,
        type:String,
        unique:true
      
    },
   teamRole:{type:String},
   teamMembers:[
        {
        memberName:{type:String},
        memberPassword:{type:String},
        memberPhoneNumber:{type:String,unique:true}
    }],

},{ timestamps: true });

const ServiceTeam= mongoose.model('ServiceTeam',serviceTeamSchema);

module.exports = {ServiceTeam,serviceTeamSchema};



// teamMembers:[{
//     memberName:{type:String},
//     memberId:{
//         type:mongoose.Types.ObjectId.generate(),
        
//     },
//     memberPassword:{type:String},
//     memberPhoneNumber:{  
//         type:String,
//         required:false
//     }
// }],