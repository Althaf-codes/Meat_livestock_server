const express = require('express');
const serviceTeamMemberRouter = express.Router();
const {ServiceTeam}  = require('../models/serviceTeamSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const serviceTeamMember = require('../middlewares/serviceTeamMember_middleware');

serviceTeamMemberRouter.post('/api/serviceTeamMember/SignIn',async(req,res)=>{
    
    const {phoneNumber,password} = req.body;
    console.log(`the phone is : ${phoneNumber}, , password :${password} `);


    try {
        let serviceTeamDetails = await ServiceTeam.findOne({"teamMembers":{$elemMatch:{"memberPhoneNumber":phoneNumber}}});
        

        //ServiceTeam.findOne({'teamMembers':{'memberPhoneNumber':phoneNumber}});
        console.log(`the serviceTeamDetails datas are ${serviceTeamDetails}`);
        
        
        
        var serviceTeamMember = serviceTeamDetails.teamMembers.filter(function(el){
            return el.memberPhoneNumber==phoneNumber
        });
       
      
        console.log(`the service TeamMember's password is ${serviceTeamMember[0].memberPassword}`);

        if(serviceTeamMember!=''&& serviceTeamMember!=null){
            const isMatch = await bcrypt.compare(password,serviceTeamMember[0].memberPassword);
            console.log(`the ismatch is ${isMatch}`);
            if(!isMatch){
             return res.status(400).json({ msg: "Incorrect password." });
            }
              
            const token = jwt.sign({ id: serviceTeamMember[0]._id }, "serviceTeamMemberPasswordKey");
            console.log(`the token is ${token}`);
          
        return res.status(200).json({ "token":token,"serviceTeamMember":serviceTeamMember});

        }else{
            return res
            .status(400)
            .json({ msg: "User with this phoneNumber does not exist!.Create an account " });
        }
       

    } catch (e) {
        return res.status(500).json({ "error": e.message });
    }
});


serviceTeamMemberRouter.get('/api/serviceTeamMemberDetails',serviceTeamMember,async(req,res)=>{

    try {
        console.log(`id is ${req.serviceTeamMember}`)
   let ServiceTeamDetails =  await ServiceTeam.findOne({"teamMembers":{$elemMatch:{"_id":req.serviceTeamMember}}});
   
        console.log(`the data is ${ServiceTeamDetails}`);

        return res.status(200).json({"data":ServiceTeamDetails});



} catch (e) {
    return res.status(500).json({ "error": e.message });
}
});

module.exports = serviceTeamMemberRouter;
