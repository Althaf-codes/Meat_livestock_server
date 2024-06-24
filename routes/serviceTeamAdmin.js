const mongoose = require('mongoose');
const express = require('express');
const serviceTeamAdminRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {ServiceTeam}  = require('../models/serviceTeamSchema');
const serviceTeamAdmin = require('../middlewares/serviceTeamAdmin_middleware');

serviceTeamAdminRouter.post('/api/serviceTeamAdminSignIn',async(req,res)=>{

    const {phoneNumber,password} = req.body;
    console.log(`the phone is : ${phoneNumber}, , password :${password} `);
    try {

        let serviceTeamAdmin = await ServiceTeam.findOne({'teamAdminPhoneNumber':phoneNumber});

        console.log(`the serviceTeamAdmin datas are ${serviceTeamAdmin}`);

        if(serviceTeamAdmin!=''&& serviceTeamAdmin!=null){
            const isMatch = await bcrypt.compare(password,serviceTeamAdmin.teamAdminPassword);
            console.log(`the ismatch is ${isMatch}`);
            if(!isMatch){
             return res.status(400).json({ msg: "Incorrect password." });
            }
            
            const token = jwt.sign({ id: serviceTeamAdmin._id }, "serviceTeamAdminPasswordKey");
            console.log(`the token is ${token}`);
            console.log(`the user is ${serviceTeamAdmin}`);
          
          res.status(200).json({ "token":token,"serviceTeamAdmin":serviceTeamAdmin})
        
        }else{
            return res
            .status(400)
            .json({ msg: "User with this phoneNumber does not exist!.Create an account " });
        }

    } catch (e) {
        return res.status(500).json({ "error": e.message });
    }
});
serviceTeamAdminRouter.post('/api/serviceTeamAdmin/AddNewMember',serviceTeamAdmin,async(req,res)=>{

    try {
        const{memberName,memberPassword,memberPhoneNumber} = req.body;
        const serviceTeamAdminId =  req.serviceTeamAdmin;
        const serviceTeamDetails = await ServiceTeam.findById(req.serviceTeamAdmin);
        let existingUser=  await ServiceTeam.findOne({'teamMembers.memberPhoneNumber':memberPhoneNumber});
        console.log(`the existing user is ${existingUser}`);
        if(existingUser==''||existingUser ==null){
            console.log(`the serivce teamdetails are ${serviceTeamDetails}`);
            let teamMembersLength = serviceTeamDetails.teamMembers.length;
            console.log(`the teamMembersLength is ${teamMembersLength}`);
         
          bcrypt.hash(memberPassword, 8, async function(err, hashedPassword){
              if(err){
                  return res.status(400).json({ "msg": "error occurred" });
                }
        let teamMember = await ServiceTeam.findByIdAndUpdate(serviceTeamAdminId,{
            "$push":{
            "teamMembers":{
                "memberName":memberName,
                "memberPassword":hashedPassword ,
                "memberPhoneNumber":memberPhoneNumber
            }    
            }
        }).then(async(data)=>{
            if(data!=null||data!=""){
                console.log(`the saved datas are ${data}`);
                
                const token = jwt.sign({ id:teamMember._id },"serviceTeamPasswordKey");
                      
                 console.log(`token is ${token}`);

                return res.status(200).json({"token":token,"serviceTeamMember":data.teamMembers});
            }else{
            console.log(`the error in api/serviceTeamAdmin/AddNewMember `);
            return res.status(400).json({ "msg": "error occurred" });
        }
        });

    });
}else{
        
    return res.status(400).json({msg:"User with same phone number already exists please signIn or try changing the phonenumber"});

  }


    } catch (e) {
        return res.status(500).json({ "error": e.message });
    }
})


module.exports = serviceTeamAdminRouter;
