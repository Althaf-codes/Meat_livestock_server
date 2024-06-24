const express = require('express');
const {User} = require('../models/userSchema');
const authRouter = express.Router();
const bcryptjs = require('bcryptjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth_middleware')



// authRouter.post("/api/signup",async (req,res)=>{
//   //const {phoneNumber,userName,password} = req.body;
//    var phoneNumber = req.body.phoneNumber;
//    var userName =req.body.userName;
//    var password = req.body.password;
//   console.log(`the phone is : ${phoneNumber}, username : ${userName}, password :${password} `);
//  const existingUser = await User.find({"phoneNumber":phoneNumber});
//  console.log(`the existing user is${existingUser}`);
// try {
//       if(existingUser!=''&&existingUser!=null){
//         return res.status(400).json({msg:"User with same phone number already exists"})
    
//       }else{
//          const hashedPassword = await bcryptjs.hash(password, 8);
        
//           var user =new  User({
//            "userName": userName,
//            "phoneNumber": phoneNumber,
//            "password": hashedPassword
//           })
          
//           user = await user.save().then((data)=>{
//               console.log(`the user is ${data}`);
//              return res.status(200).json(user);
          
//           });
//       }
    
// } catch (e) {
//     console.log(`the error is ${e}`);
//     return res.status(400).json({ "msg": e.message })
// }

// });


// authRouter.post("/api/signIn", async(req,res)=>{
    
//     const {phoneNumber,password} = req.body;
//     console.log(`the phone is : ${phoneNumber}, , password :${password} `);

//     const user = await User.find({"phoneNumber":phoneNumber});

    
//     try {
        
//         if(user==''||user==null){
//             return res
//             .status(400)
//             .json({ msg: "User with this email does not exist!" });
//            }

//         let isMatch =  bcryptjs.compare(password,user.password);
//        console.log(`the ismatch is ${isMatch}`);
//        console.log(`the user.password is ${user.password}`);
//             if (!isMatch) {
//                 return res.status(400).json({ msg: "Incorrect password." });
//               }
        
//     const token = jwt.sign({ id: user._id }, "passwordKey");

//     console.log(`the token is ${token}`);
//     //console.log(`the user doc is ${user.doc}`);
//     res.json({ "token":token,"user":user});
            
        
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     } 

    
// })




authRouter.post("/api/signup",async (req,res)=>{
  //const {phoneNumber,userName,password} = req.body;
   var phoneNumber = req.body.phoneNumber;
   var userName =req.body.userName;
   var password = req.body.password;
  console.log(`the phone is : ${phoneNumber}, username : ${userName}, password :${password} `);
  try {
    let existingUser = await User.findOne({"phoneNumber":phoneNumber});
 
  
 console.log(`the existing user is ${existingUser}`);
      if( existingUser!=null){
        return res.status(400).json({msg:"User with same phone number already exists"})
    
      }else{
        // const hashedPassword = await bcrypt.hash(password, 8);
      await  bcrypt.hash(password, 8, async function(err, hashedPassword) {
           
            if(err){
              return res.status(400).json({ "msg": "error occurred" });
            }
            var user =new  User({
             "userName": userName,
             "phoneNumber": phoneNumber,
             "password": hashedPassword
            })
            
            user = await user.save().then((data)=>{
                console.log(`the user is ${data}`);
                const token = jwt.sign({ id: user._id }, "passwordKey");
                console.log(`the token is ${token}`);
              console.log(`the user is ${user}`);
              res.status(200).json({ "token":token,"user":user});
     
            
            });

        });
      }
    
    
    
} catch (e) {
    console.log(`the error is ${e}`);
    return res.status(400).json({ "msg": e.message })
}

});


authRouter.post("/api/signIn", async(req,res)=>{
    
    const {phoneNumber,password} = req.body;
    console.log(`the phone is : ${phoneNumber}, , password :${password} `);

    
    try {
        let user = await User.findOne({"phoneNumber":phoneNumber});
        
        if(user==''||user==null){
            return res
            .status(400)
            .json({ msg: "User with this phoneNumber does not exist!.Create an account " });
           }
        
           const isMatch = await bcrypt.compare(password,user.password);
           console.log(`the ismatch is ${isMatch}`);
     
     
           if(!isMatch){
             return res.status(400).json({ msg: "Incorrect password." });
            }
            
            const token = jwt.sign({ id: user._id }, "passwordKey");
            console.log(`the token is ${token}`);
          console.log(`the user is ${user}`);
          
          return res.status(200).json({ "token":token,"user":user});
     
     
     
             
         } catch (e) {
          return res.status(500).json({ error: e.message });
         } 

     
        
    


    
})



authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);
    const verified = jwt.verify(token, "passwordKey");
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


authRouter.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});


authRouter.get('/api/getbyid/:id',async( req,res)=>{
    let Id = req.params.id;
    console.log(`the id is ${Id}`);
    var user = await User.findById(Id);
      
    console.log(`the user is ${user}`);
try {
    if(user){
        console.log(`the user is ${user}`);
        return res.status(500).send(user);

    }else{
        return res.status(400).json({"msg":"no user with the id found"});
    }
} catch (e) {
    console.log(`the error is ${e}`);
    return res.status(400).json({ "msg": e.message })
}   

})
module.exports = authRouter;















// const express = require('express');
// const User = require('./models/userSchema');
// const authRouter = express.Router();
// const bcryptjs = require('bcryptjs');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const auth = require('./middlewares/auth_middleware')

// authRouter.post("/api/signup",async (req,res)=>{
//   //const {phoneNumber,userName,password} = req.body;
//    var phoneNumber = req.body.phoneNumber;
//    var userName =req.body.userName;
//    var password = req.body.password;
//   console.log(`the phone is : ${phoneNumber}, username : ${userName}, password :${password} `);
//  const existingUser = await User.find({"phoneNumber":phoneNumber});
//  console.log(`the existing user is${existingUser}`);
// try {
//       if(existingUser!=''&&existingUser!=null){
//         return res.status(400).json({msg:"User with same phone number already exists"})
    
//       }else{
//         // const hashedPassword = await bcrypt.hash(password, 8);
//         bcrypt.hash(passwords, 8, function(err, hash) {
           
//         });
//           var user =new  User({
//            "userName": userName,
//            "phoneNumber": phoneNumber,
//            "password": hashedPassword
//           })
          
//           user = await user.save().then((data)=>{
//               console.log(`the user is ${data}`);
//              return res.status(200).json(user);
          
//           });
//       }
    
// } catch (e) {
//     console.log(`the error is ${e}`);
//     return res.status(400).json({ "msg": e.message })
// }

// });


// authRouter.post("/api/signIn", async(req,res)=>{
    
//     const {phoneNumber,password} = req.body;
//     console.log(`the phone is : ${phoneNumber}, , password :${password} `);

//     const user = await User.find({"phoneNumber":phoneNumber});

    
//     try {
        
//         if(user==''||user==null){
//             return res
//             .status(400)
//             .json({ msg: "User with this email does not exist!" });
//            }

//         let isMatch = await bcrypt.compare(password,user.password);
//        console.log(`the ismatch is ${isMatch}`);
//             if (!isMatch) {
//                 return res.status(400).json({ msg: "Incorrect password." });
//               }
        
//     const token = jwt.sign({ id: user._id }, "passwordKey");

//     console.log(`the token is ${token}`);
//     //console.log(`the user doc is ${user.doc}`);
//     res.json({ "token":token,"user":user});
            
        
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     } 

    
// })


// authRouter.post("/tokenIsValid", async (req, res) => {
//   try {
//     const token = req.header("x-auth-token");
//     if (!token) return res.json(false);
//     const verified = jwt.verify(token, "passwordKey");
//     if (!verified) return res.json(false);

//     const user = await User.findById(verified.id);
//     if (!user) return res.json(false);
//     res.json(true);
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// });


// authRouter.get("/", auth, async (req, res) => {
//   const user = await User.findById(req.user);
//   res.json({ ...user._doc, token: req.token });
// });


// authRouter.get('/api/getbyid/:id',async( req,res)=>{
//     let Id = req.params.id;
//     console.log(`the id is ${Id}`);
//     var user = await User.findById(Id);
      
//     console.log(`the user is ${user}`);
// try {
//     if(user){
//         console.log(`the user is ${user}`);
//         return res.status(500).send(user);

//     }else{
//         return res.status(400).json({"msg":"no user with the id found"});
//     }
// } catch (e) {
//     console.log(`the error is ${e}`);
//     return res.status(400).json({ "msg": e.message })
// }   

// })
// module.exports = authRouter;


















//*************************************using bcrypt *************************************/


authRouter.post("/api/signup",async (req,res)=>{
    //const {phoneNumber,userName,password} = req.body;
     var phoneNumber = req.body.phoneNumber;
     var userName =req.body.userName;
     var password = req.body.password;
    console.log(`the phone is : ${phoneNumber}, username : ${userName}, password :${password} `);
   const existingUser = await User.find({"phoneNumber":phoneNumber});
   console.log(`the existing user is${existingUser}`);
  try {
        if(existingUser!=''&&existingUser!=null){
          return res.status(400).json({msg:"User with same phone number already exists"})
      
        }else{
          // const hashedPassword = await bcrypt.hash(password, 8);
        await  bcrypt.hash(password, 8, async function(err, hashedPassword) {
             
              if(err){
  
              }
              var user =new  User({
               "userName": userName,
               "phoneNumber": phoneNumber,
               "password": hashedPassword
              })
              
              user = await user.save().then((data)=>{
                  console.log(`the user is ${data}`);
                 return res.status(200).json(user);
              
              });
          });
        }
      
  } catch (e) {
      console.log(`the error is ${e}`);
      return res.status(400).json({ "msg": e.message })
  }
  
  });
  
  
  authRouter.post("/api/signIn", async(req,res)=>{
      
      const {phoneNumber,password} = req.body;
      console.log(`the phone is : ${phoneNumber}, , password :${password} `);
  
      
      try {
          const user = await User.find({"phoneNumber":phoneNumber});
          console.log(`the user is ${user}`);
          
          if(user==''||user==null){
              return res
              .status(400)
              .json({ msg: "User with this email does not exist!" });
             }
          console.log(`the userpassword is ${user}`);
        //  let isMatch = await bcrypt.compare(password,user.password);
           bcrypt.compare( password,user.password, function(err, result) {
  
              if(err){
                  console.log(`the result is ${result}`);
                  console.log(`the err is ${err}`);
                  return res.status(400).json({ msg: "Incorrect password." });
              }else if(result==true){
  
                  const token = jwt.sign({ id: user._id }, "passwordKey");
  
                  console.log(`the token is ${token}`);
                  //console.log(`the user doc is ${user.doc}`);
                  res.json({ "token":token,"user":user});
              }
          });
  
      //    console.log(`the ismatch is ${isMatch}`);
      //         if (!isMatch) {
      //             return res.status(400).json({ msg: "Incorrect password." });
      //           }
          
      // const token = jwt.sign({ id: user._id }, "passwordKey");
  
      // console.log(`the token is ${token}`);
      // //console.log(`the user doc is ${user.doc}`);
      // res.json({ "token":token,"user":user});
              
          
      } catch (e) {
          res.status(500).json({ error: e.message });
      } 
  
      
  })
  