const mongoose = require('mongoose');
const express = require('express');
const userRouter = express.Router();
const {Product} = require('../models/productSchema');
const auth = require('../middlewares/auth_middleware');
const {User} = require('../models/userSchema'); 

userRouter.get('/api/product',async(req,res)=>{

    try {
      //  console.log('its coming here');
        const allProducts = await Product.find({"isVerified":true});
     
        console.log(`allProducts are ${allProducts}`);
     
      return res.status(200).json({"allProducts":allProducts});
        
    } catch (e) {
        return res.status(500).json({ "error": e.message });
    }
});
userRouter.patch('/api/product/cart/add/:product_id',auth,async(req,res)=>
{
    try
    {
      const user=await User.findOne({_id:req.user});
      const product_id=req.params.product_id;

      const quantity=req.body.quantity;
    
      if(quantity===undefined)
      {
        return res.status(400).json({msg:"Required fields are missing!!"});
      }

      if(!user)
      {
          return res.status(400).json({msg:"User does not exists!!"});
      }


      const prdct=await Product.findOne({_id:product_id,isVerified:true});

      if(!prdct)
      {
        return res.status(400).json({msg:"Product does not exists!!"});
      }



      if(user.cart.find(obj=>{return obj.product.equals(product_id)})!==undefined)
      {
        return res.status(400).json({msg:"The product is already in your cart!!"});
      }
 await user.updateOne({$push:{
        "cart":{
          "product":req.params.product_id,
          "quantity":quantity
        }
      }});
console.log(`the cartDetails is ${cartDetails}`)

      res.status(200).json({msg:"The product has been added to the cart successfully",cart:user.cart});
    }
    catch(err)
    {
        console.log(`Error in add cart ${err}`);
        res.status(500).json({msg:"Internal Server Error",err:err});
    } 
});

//Get cart
userRouter.get('/api/product/cart/get',auth,async(req,res)=>{

  try
  {
    const user=await User.findById(req.user);
  
    if(!user)
    {
      return res.status(400).json({msg:"User does not exists!!"});
    }
    console.log(`the user is ${user}`)
    console.log(`the cart is ${user.cart}`)

    res.status(200).json({msg:"Items in the cart retrived successfully!!",cart:user.cart});
  }
  catch(err)
  {
    console.log(`Error in get cart ${err}`);
    res.status(500).json({msg:"Internal Server Error ",err:err});
  }

    
});


//Remove from cart
userRouter.patch('/api/product/cart/remove/:product_id',auth,async(req,res)=>{
  try
  {

      let user=await User.findById(req.user);
      
            if(!user)
            {
              return res.status(400).json({msg:"User does not exists!!"});
            }

     if(!user.cart.find(obj=>{return obj.product.equals(req.params.product_id)}))
      {
        return res.status(400).json({msg:"No such product in your cart!!"});
      }

  
       user=await User.findByIdAndUpdate(req.user,{
        $pull:
        {
          "cart":
          {
            product:req.params.product_id
          }
        }
      });

      res.status(200).json({msg:"Product removed from the cart successfully"});
  }
  catch(err)
  {
      console.log(`Error in remove from cart ${err}`);
      res.status(500).json({msg:"Internal Server Error"});
  }
});


module.exports = userRouter;
