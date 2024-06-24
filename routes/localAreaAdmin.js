const express= require('express');
const localAreaAdminRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth_middleware');
const localAreaAdminMiddleWare = require('../middlewares/localAreaAdmin_middleware');
const {User} = require('../models/userSchema');
const {LocalAreaAdmin} = require('../models/localAreaAdminSchema');


localAreaAdminRouter.post('/api/localAreaAdminSignUp',auth,async(req,res)=>{

    try {  
        const {localAreaAdminName,location,phoneNumber,password,certificates,drivingLicense,aadharCardImg}=req.body;

        let user1 = await User.findById(req.user);
        let isAlreadylocalAreaAdmin = user1.isLocalAreaAdmin;
        console.log(`the isAlreadylocalAdmin is ${isAlreadylocalAreaAdmin}`);
        if(isAlreadylocalAreaAdmin){
            return res.status(400).json({'msg':"You already have localAreaAdmin account. try to SignIn or try changing the existing phoneNumber"});
        }else{
            let existingUser=  await LocalAreaAdmin.findOne({'phoneNumber':phoneNumber});
      
            console.log(`the existing user is ${existingUser}`);

            if(existingUser==''||existingUser ==null){
                bcrypt.hash(password, 8,async function(err, hashedPassword){
                     if(err){
                         return res.status(400).json({ "msg": "error occurred" });
                       }

                       const localAreaAdmin = LocalAreaAdmin({
                        'localAreaAdminName':localAreaAdminName,
                        'phoneNumber':phoneNumber,
                        'password':hashedPassword,
                        'location':location,
                        'aadharCardImg':aadharCardImg,
                        'certificates':certificates,
                        'drivingLicense':drivingLicense,
                        'userID':req.user
                    });


                    await localAreaAdmin.save().then((data)=>{
                        console.log(`the localAreaAdmin is ${data}`);
                    });

                    console.log(`the localAreaAdmin id is ${localAreaAdmin.id}`);
             
                    let user = await User.findByIdAndUpdate(req.user,{   
                     'isLocalAreaAdmin':true,
                     'type':'localAreaAdmin',
                     'LocalAreaAdminID':localAreaAdmin._id      
             });


             console.log(`the user is ${user}`); 
             user.save().then((data)=>{
                 if(data!=''&& data!= null){
                     console.log(`the updated user is ${data}`);
                 }else{
                     console.log(`the error in api/localAreaAdminSignUp is `);
                     return res.status(400).json({ "msg": "error occurred" });
                 }
                 const token = jwt.sign({ id: localAreaAdmin._id },"localAreaAdminPasswordKey");
                 console.log(`the token is ${token}`);
                 
             return res.status(200).json({'user':data,'token':token,'localAreaAdmin':localAreaAdmin});


                    });
                
                })
        }else{
        
            return res.status(400).json({msg:"User with same phone number already exists please signIn"});
    
          }
    
    }
        
    } catch (e) {
        console.log(`the error is ${e}`);
        return res.status(400).json({ "msg": e.message });
    }
});



localAreaAdminRouter.post('/api/localAreaAdminSignIn',async(req,res)=>{


    try {
        
        const {phoneNumber,password} = req.body;
        console.log(`the phone is : ${phoneNumber}, , password :${password} `);
        let localAreaAdmin = await LocalAreaAdmin.findOne({'phoneNumber':phoneNumber});
        
        console.log(`the localAreaAdmin is ${localAreaAdmin}`);
        
    if(localAreaAdmin!=''&& localAreaAdmin!=null){

        const isMatch = await bcrypt.compare(password,localAreaAdmin.password);
           console.log(`the ismatch is ${isMatch}`);
           if(!isMatch){
            return res.status(400).json({ msg: "Incorrect password." });
           }
           
           const token = jwt.sign({ id: localAreaAdmin._id }, "localAreaAdminPasswordKey");
           console.log(`the token is ${token}`);
           console.log(`the user is ${localAreaAdmin}`);
         
         res.status(200).json({ "token":token,"localAreaAdmin":localAreaAdmin})
    }else{
        return res
        .status(400)
        .json({ msg: "User with this phoneNumber does not exist!.Create an account " });
    }
     
        
    } catch (e) {
        console.log(`the error is ${e}`);
        return res.status(400).json({ "msg": e.message });
    }
});



localAreaAdminRouter.get('/api/getLocalAreaAdminByToken',localAreaAdminMiddleWare,async(req,res)=>{

    try {
        const localAreaAdminDetails = await LocalAreaAdmin.findById(req.localAreaAdmin);
        return res.status(200).json({ "localAreaAdmin":localAreaAdminDetails._doc });
        

    } catch (e) {
        console.log(`the error is ${e}`);
        return res.status(400).json({ "msg": e.message });
    }
});

module.exports = localAreaAdminRouter;