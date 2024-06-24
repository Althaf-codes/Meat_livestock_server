const express = require('express');
const mainAdminRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Product} = require('../models/productSchema');
const {ServiceTeam}  = require('../models/serviceTeamSchema');
const {MainAdmin} = require('../models/mainAdminSchema');
const mainAdminMiddleware = require('../middlewares/mainAdmin_middleware');
const {Seller} = require('../models/sellerSchema');

mainAdminRouter.post('/api/mainAdmin/signUp',async(req, res)=>{
try {
    const {mainAdminName,mainAdminPhoneNumber,mainAdminPassword1,mainAdminPassword2}=req.body;

    let existingAdmin=  await MainAdmin.findOne({'mainAdminPhoneNumber':mainAdminPhoneNumber});

    console.log(`the existing user is ${existingAdmin}`);
      if(existingAdmin==''||existingAdmin ==null){
    bcrypt.hash(mainAdminPassword1, 8,async function(err, hashedPassword1){
        if(err){
            return res.status(400).json({ "msg": "error occurred while hashing pass1" });
          }
          bcrypt.hash(mainAdminPassword2, 8,async function(err, hashedPassword2){
            if(err){
                return res.status(400).json({ "msg": "error occurred while hashing pass2" });
              }
    let mainAdmin = MainAdmin({
        'mainAdminName':mainAdminName,
        'mainAdminPhoneNumber':mainAdminPhoneNumber,
        'mainAdminPassword1':hashedPassword1,
        'mainAdminPassword2':hashedPassword2
    });


    mainAdmin.save().then(async(data)=>{

console.log(`the data is ${data}`);

    if(data!=''||data!=null){
        console.log(`the updated user is ${data}`);
    }else{
        console.log(`the error in api/mainAdmin/signUp is `);
        return res.status(400).json({ "msg": "error occurred" });
    }
    let token = jwt.sign({ id: data._id },"mainAdminPasswordKey");
    console.log(`the token is ${token}`);

    return res.status(200).json({'mainAdmin':mainAdmin,'token':token,});
})
    })
 })
}else{
        
    return res.status(400).json({msg:"MainAdmin already exists and you are not him"});

  }

} catch (e) {
    return res.status(500).json({ "error": e.message });
}
});


mainAdminRouter.post('/api/mainAdmin/signIn',async(req,res)=>{

    try {
        const {phoneNumber,password1,password2} = req.body;
        console.log(`the phone is : ${phoneNumber}, , password :${password1} ,${password2} `);


        const mainAdminDetails = await MainAdmin.findOne({'mainAdminPhoneNumber':phoneNumber});

        console.log(`the mainAdminDetails are ${mainAdminDetails}`);
        if(mainAdminDetails!=''&& mainAdminDetails!=null){

            const isMatch1 = await bcrypt.compare(password1,mainAdminDetails.mainAdminPassword1);
               console.log(`the ismatch1 is ${isMatch1}`);
               if(!isMatch1){
                return res.status(400).json({ msg: "Incorrect password1." });
               }else{
                const isMatch2 = await bcrypt.compare(password2,mainAdminDetails.mainAdminPassword2);
                console.log(`the ismatch2 is ${isMatch2}`);
                if(!isMatch2){
                 return res.status(400).json({ msg: "Incorrect password2." });
                }

                   const token = jwt.sign({ id: mainAdminDetails._id }, "mainAdminPasswordKey");
                   console.log(`the token is ${token}`);
                   console.log(`the user is ${mainAdminDetails}`);
                 
                 res.status(200).json({ "token":token,"mainAdminDetails":mainAdminDetails})

               }
               
        }else{
            return res
            .status(400)
            .json({ msg: "User with this phoneNumber does not exist!.Create an account " });
        }

    } catch (e) {
        return res.status(500).json({ "error": e.message });
    }
    
});
mainAdminRouter.get('/api/getmainAdminById',mainAdminMiddleware,async(req,res)=>{
    const mainAdmin = await MainAdmin.findById(req.mainAdmin);
    console.log(`the mainAdmin in getmainAdminById is ${mainAdmin}`);
    res.json({...mainAdmin._doc ,"isTrue":true,"token":req.token});
})
mainAdminRouter.get('/api/getUnverifiedProducts',mainAdminMiddleware,async(req,res)=>{
 
    try {
        const allProducts = await Product.find({"isVerified":false});
        console.log(`allProducts are ${allProducts}`);
     
      return res.status(200).json({"allProducts":allProducts});

    } catch (e) {
        return res.status(500).json({ "error": e.message });
    }

});

mainAdminRouter.get('/api/getVerifiedProducts',mainAdminMiddleware,async(req,res)=>{
 
    try {
        const allProducts = await Product.find({"isVerified":true});
        console.log(`allProducts are ${allProducts}`);
     
      return res.status(200).json({"allProducts":allProducts});

    } catch (e) {
        return res.status(500).json({ "error": e.message });
    }

});

mainAdminRouter.patch('/api/productVerification/product-id',mainAdminMiddleware,async(req,res)=>{

    try {
        var id = req.query.productId; 
        
        await Product.findByIdAndUpdate(id,{
            $set:{
                'isVerified':true
            }
        }).then(()=>{
            console.log('verification process successful');
            return res.status(200).json({"msg":"verification successful"})
        })

    } catch (e) {
        return res.status(500).json({ "error": e.message });
    }
});


mainAdminRouter.get('/api/getAllServiceTeam',mainAdminMiddleware,async(req,res)=>{

    try {
        
      let allServiceTeam =  await ServiceTeam.find({});

      if(allServiceTeam==''||allServiceTeam==null){
        return res.status(400).json({"msg":"No ServiceTeam found"});
      }
      console.log(`allServiceTeam is ${allServiceTeam}`);

        return res.status(200).json({"allServiceTeam":allServiceTeam});



    } catch (e) {
        return res.status(500).json({ "error": e.message }); 
    }
})

mainAdminRouter.post('/api/addNewServiceTeam',mainAdminMiddleware,async(req,res)=>{
    try {

        const {adminName,password,teamRole,phoneNumber} = req.body;
        
        let existingUser=  await ServiceTeam.findOne({'teamAdminPhoneNumber':phoneNumber});
      
      console.log(`the existing user is ${existingUser}`);
      if(existingUser==''||existingUser ==null){
        console.log(`the datas are ${adminName}, ${password}, ${teamRole} ${phoneNumber}`);
        bcrypt.hash(password, 8, async function(err, hashedPassword){
            if(err){
                return res.status(400).json({ "msg": "error occurred" });
              }
        console.log('its coming1');
          
        const serviceTeam = new ServiceTeam({
            "teamAdminName":adminName,
            "teamAdminPassword":hashedPassword,
            "teamAdminPhoneNumber":phoneNumber,
            "teamRole":teamRole,
            // "teamMembers":{"memberName":"","memberPassword":"","memberPhoneNumber":""}
          
        });
       console.log(`the service team is ${serviceTeam}`);
        console.log(`hashed password is ${hashedPassword}`);
                
        console.log('its coming2');


         serviceTeam.save().then(async(data)=>{
        // if(err){
        //     console.log(`the err is ${err}`)
        //     return res.status(400).json({ "msg": "error occurred while saving serviceTeam" ,"err":err});
        // }
        if(data!=null||data!=""){

        
            console.log('New service team saved successfully');
            console.log(`the saved datas are ${data}`);
            const token = jwt.sign({ id:data._id },"serviceTeamAdminPasswordKey");
                  console.log(`the token is ${token}`);
                  console.log(`token is ${token}`);
            return res.status(200).json({"token":token,"serviceTeam":data});
        }else{
            console.log(`the error in api/addserviceteam `);
            return res.status(400).json({ "msg": "error occurred" });
        }
       })

    });
      }else{
        
        return res.status(400).json({msg:"User with same phone number already exists please signIn"});

      }

    } catch (e) {
        return res.status(500).json({ "error": e.message }); 
    }
});


mainAdminRouter.get('/api/allSellers',mainAdminMiddleware,async(req,res)=>{
    
    
    try {
        const seller = await Seller.find({});
    
        return res.status(200).json({'sellers':seller});
        
    } catch (e) {
        console.log(`the error is ${e}`);
        return res.status(400).json({ "msg": e.message })
    }
})


module.exports =  mainAdminRouter;
