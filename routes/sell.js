const express= require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Seller} = require('../models/sellerSchema');
const {User} = require('../models/userSchema');
const {Product}= require('../models/productSchema'); 
const {Animal} = require('../models/animalSchema');
const {Feed} =require('../models/feedSchema');
const {Toy} = require('../models/toySchema');
const {Meat} =require('../models/meatSchema');
const {Accessory}= require('../models/accessorySchema');
const {FishAndAquatics} = require('../models/fishAndAquaticsSchema');
const auth = require('../middlewares/auth_middleware');
const sellerMiddleware = require('../middlewares/seller_middleware');
const { Collection } = require('mongoose');
const sellerRouter = express.Router();

sellerRouter.post('/api/sellerSignUp',auth,async(req,res)=>{
    const {sellerName,companyName,location,specializedCategory,password,phoneNumber}=req.body;

    try {
        let user1 = await User.findById(req.user);
        let isAlreadySeller = user1.isSeller;
        console.log(`the isAlreadySeller is ${isAlreadySeller}`);
        if(isAlreadySeller){
            return res.status(400).json({'msg':"You already have seller account. try to SignIn or try changing the existing phoneNumber"});
        }else{

        let existingUser=  await Seller.findOne({'phoneNumber':phoneNumber});
      
      console.log(`the existing user is ${existingUser}`);
      if(existingUser==''||existingUser ==null){
          bcrypt.hash(password, 8,async function(err, hashedPassword){
               if(err){
                   return res.status(400).json({ "msg": "error occurred" });
                 }
          
             console.log('its coming before');
             const seller = Seller({
                 'sellerName':sellerName,
                 'userID':req.user,
                 'phoneNumber':phoneNumber,
                 'password':hashedPassword,
                 'companyName':companyName,
                 'location':location,
                 'specializedCategory':specializedCategory,
                 'userID':req.user
             });
             
             console.log('its coming after');
             await seller.save().then((data)=>{
                 console.log(`the seller is ${data}`);
             });
       
             console.log(`the seller id is ${seller.id}`);
             let user = await User.findByIdAndUpdate(req.user,{
                
                     'isSeller':true,
                     'type':'normalSeller',
                     'sellerID':seller._id      
             });
             console.log(`the user is ${user}`); 
              user.save().then((data)=>{
                  if(data!=''&& data!= null){
                      console.log(`the updated user is ${data}`);
                  }else{
                      console.log(`the error in api/sellerLogin is `);
                      return res.status(400).json({ "msg": "error occurred" });
                  }
                  const token = jwt.sign({ id: seller._id },"sellerPasswordKey");
                  console.log(`the token is ${token}`);
                  
              return res.status(200).json({'user':data,'token':token,'seller':seller});

              })
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

sellerRouter.post('/api/sellerSignIn',async(req,res)=>{

    const {phoneNumber,password} = req.body;
    console.log(`the phone is : ${phoneNumber}, , password :${password} `);
 
    
    try {
    let seller = await Seller.findOne({'phoneNumber':phoneNumber});

    console.log(`the seller is ${seller}`);

    if(seller!=''&& seller!=null){

        const isMatch = await bcrypt.compare(password,seller.password);
           console.log(`the ismatch is ${isMatch}`);
           if(!isMatch){
            return res.status(400).json({ msg: "Incorrect password." });
           }
           
           const token = jwt.sign({ id: seller._id }, "sellerPasswordKey");
           console.log(`the token is ${token}`);
           console.log(`the user is ${seller}`);
         
         res.status(200).json({ "token":token,"seller":seller})
    }else{
        return res
        .status(400)
        .json({ msg: "User with this phoneNumber does not exist!.Create an account " });
    }
    
} catch (e) {
    console.log(`the error is ${e}`);
    return res.status(400).json({ "msg": e.message })
}
});


sellerRouter.get('/api/getSellerById',sellerMiddleware,async(req,res)=>{
    const seller = await Seller.findById(req.seller);
    console.log(`the seller in getSellerById is ${seller}`);
    res.json({...seller._doc ,"token":req.token1});
})



sellerRouter.post('/api/postProduct',sellerMiddleware,async(req,res)=>{
    const seller = await Seller.findById(req.seller);
    const {
        productName,
        description,
        highlightDescription,
        elaborateDescription,
        images,
        quantity,
        price,
        categoryName,
        deliverablespan,
        isHavingStock,
        stockQuantity,
        isDiscountable,
        discount} = req.body.product;

    const {
        subCategoryType,
        breedType,
        color,
        gender,
        milkCapacityPerMilking,
        milkCapacityPerday,
        teeth,
        age,
        approximateHeight,
        approximateLength,
        approximateWeight,
        numberOfOffSpring,
        isPregnant,
        pregnancyMonth,
        isSellingWithOffspring,
        numberOfBirthGiven} = req.body.animal;

    
    const {
    feedBrandName,
    includedIngredients,
    feedWeight,
    targetSpecies,
    feedSizes,
    flavour,
    itemForm,
    ageRange,
    packageType} = req.body.feed;
    
const{
    toyBrandName,
    toyCategory,
    toyType,
    toyUsage,
    toyColors,
    toySizes,
    toyWeight,
    toyDimensions,
    toyMaterial,
    toyCountryOfOrigin} = req.body.toy

       
const{
    accessoryBrandName,
    accessoryCategory,
    accessoryType,
    accessoryUsage,
    accessoryColors,
    accessorySizes,
    accessoryWeight,
    accessoryDimensions,
    accessoryMaterial,
    accessoryCountryOfOrigin} = req.body.accessory


    const{
        AquaticName,
        AquaticCategory,
        AquaticBreed,
        AquaticSize,
        AquaticAge,
        AquaticColors,
        AquaticWeight,
        AquaticPackageType} = req.body.fishAndAquatics


    const{
        meatBrandName,
        meatMeatName,
        meatParts,
        meatWeight,
        meatPackageType,
        meatDeliveryCharge}=req.body.meat;
        

try {
     let isPet = false;
     let isCattle = false;
     let isAnimal =false;
     let isBirds = false;
     let isFishAndAquatics = false;
     let isPoultry = false;
     let isAccessories = false;
     let isMedicine = false;
     let isToy = false;
     let isMeat = false;
     let isFeed = false;

    switch (categoryName) {
        case 'pet':
            isPet = true
            isAnimal = true;
            break;
        case 'cattle':
            isCattle = true;
            isAnimal = true;
            break;
        case 'birds':
            isBirds = true;
            break;
         case 'fishAndAquatics':
             isFishAndAquatics =true;
             break;
        case 'poultry':
             isPoultry = true;
             break;
        case 'accessories':
            isAccessories = true
            break;
        case 'medicine':
            isMedicine = true;
            break;

        case 'toy':
            isToy =true;
            break;
        case 'meat':
            isMeat = true;
            break;
        case 'feed':
            isFeed = true;
            break;
         default:
             break;
    };

    
    let product = Product({
        'productName':productName,
        'description':description,
        'highlightDescription':highlightDescription,
        'elaborateDescription':elaborateDescription,
        'images':images,
        'quantity':quantity,
        'price':price,
        'sellerID':req.seller,
        'deliverablespan':deliverablespan,
        'isHavingStock':isHavingStock,
        'stockQuantity':stockQuantity,
        'isDiscountable':isDiscountable,
        'discount':discount,
        
    });

   let savedProductCategory ;
   let savedProduct= await product.save();

   console.log(`the saved product id is ${savedProduct._id}`);

    if(isAnimal){

    const animal = Animal({
        'subCategoryType':subCategoryType,
        'breedType':breedType,
        'color':color,
        'gender':gender,
        'milkCapacityPerday':milkCapacityPerday,
        'milkCapacityPerMilking':milkCapacityPerMilking,
        'teeth':teeth,
        'age':age,
        'numberOfOffSpring':numberOfOffSpring,
        'isPregnant':isPregnant,
        'pregnancyMonth':pregnancyMonth,
        'numberOfBirthGiven':numberOfBirthGiven,
        'approximateWeight':approximateWeight,
        'approximateHeight':approximateHeight,
        'approximateLength':approximateLength,
        'isSellingWithOffspring':isSellingWithOffspring,
        'productId':savedProduct._id

        
        });
        
        


        savedProductCategory =  await animal.save();
  
        console.log(`savedProductCategory._id from animal is ${savedProductCategory._id}`);
        let updatedProduct;
        if(isCattle){
            updatedProduct= await Product.findByIdAndUpdate(savedProduct._id,{
                "category":{
                    "categoryName":'cattle',
                    "cattle":savedProductCategory._id
                 } 
                
                });
        }
        if(isPet){
            updatedProduct= await Product.findByIdAndUpdate(savedProduct._id,{
                "category":{
                    "categoryName":'pet',
                    "pet":savedProductCategory._id
                 } 
                
                });
        }
        
                 
    await updatedProduct.save().then(async(data)=>{
        console.log(`the product finally saved : ${data}`);
        await Seller.findByIdAndUpdate(req.seller,{
            $push:{"products":{

                "category":isPet?"pet":isCattle?"cattle":"errorinanimal",
                "productID":data._id,}}
        })
        // updatedSeller.save().then(()=>{
        //     console.log('seller updated successfully');
        // });
    });


       
    
}

        if(isFeed){
            const feed = Feed({
                'brandName':feedBrandName,
                'includedIngredients':includedIngredients,
                'weight':feedWeight,
                'targetSpecies':targetSpecies,
                'sizes':feedSizes,
                'flavour':flavour,
                'itemForm':itemForm,
                'ageRange':ageRange,
                'packageType':packageType,
            //   'productId':
            });
            savedProductCategory =  await feed.save();
            console.log(`savedProductCategory._id from feed is ${savedProductCategory._id}`);
            const updatedProduct= await Product.findByIdAndUpdate(savedProduct._id,{
       
            "category":{
                "categoryName":'feed',
                "feed":savedProductCategory._id
            } 
        });
            

    await updatedProduct.save().then(async(data)=>{
        console.log(`the product finally saved : ${data}`);
      
        await Seller.findByIdAndUpdate(req.seller,{
            $push:{"products":{
    
                "category":"feed",
                "productID":data._id,}}
        });

        // updatedSeller.save().then(()=>{
        //     console.log('seller updated successfully');
        // });
    });
 

        }

        if(isToy){


            const toy = Toy({
                'brandName':toyBrandName,
                'category':toyCategory,
                'type':toyType,
                'usage':toyUsage,
                'colors':toyColors,
                'sizes':toySizes,
                'weight':toyWeight,
                'dimensions':toyDimensions,
                'material':toyMaterial,
                'countryOfOrigin':toyCountryOfOrigin
                //   'productId':
            });
            savedProductCategory =  await toy.save();
            console.log(`savedProductCategory._id from toy is ${savedProductCategory._id}`);

            const updatedProduct= await Product.findByIdAndUpdate(savedProduct._id,{
                "category":{
                    "categoryName":'toy',
                    "toy":savedProductCategory._id
                } 
                
            });

    await updatedProduct.save().then(async(data)=>{
        console.log(`the product finally saved : ${data}`);

        await Seller.findByIdAndUpdate(req.seller,{
            $push:{"products":{
    
                "category":"toy",
                "productID":data._id,}}
        })
        // updatedSeller.save().then(()=>{
        //     console.log('seller updated successfully');
        // });

    });


        }

        if(isAccessories){



            const accessory = Accessory({
                'brandName':accessoryBrandName,
                'category':accessoryCategory,
                'type':accessoryType,
                'usage':accessoryUsage,
                'colors':accessoryColors,
                'sizes':accessorySizes,
                'weight':accessoryWeight,
                'dimensions':accessoryDimensions,
                'material':accessoryMaterial,
                'countryOfOrigin':accessoryCountryOfOrigin
                //   'productId':
            });
            savedProductCategory =  await accessory.save();
            console.log(`savedProductCategory._id from accessory is ${savedProductCategory._id}`);

            const updatedProduct= await Product.findByIdAndUpdate(savedProduct._id,{
                "category":{
                    "categoryName":'accessories',
                    "accessories":savedProductCategory._id
                } 
            });
    

    await updatedProduct.save().then(async(data)=>{
        console.log(`the product finally saved : ${data}`);
     

        await Seller.findByIdAndUpdate(req.seller,{
            $push:{"products":{
    
                "category":"accessories",
                "productID":data._id,}}
        })

        // updatedSeller.save().then(()=>{
        //     console.log('seller updated successfully');
        // });
    });


        }  
            
        if(isFishAndAquatics){
            const fishAndAquatics = FishAndAquatics({
                'name':AquaticName,
                'category':AquaticCategory,
                'breed':AquaticBreed,
                'size':AquaticSize,
                'age':AquaticAge,
                'colors':AquaticColors,
                'weight':AquaticWeight,
                'packageType':AquaticPackageType

            });
            savedProductCategory =  await fishAndAquatics.save();
           
            console.log(`savedProductCategory._id from fishAndAquatics is ${savedProductCategory._id}`);

            const updatedProduct= await Product.findByIdAndUpdate(savedProduct._id,{
                "category":{
                    "categoryName":'fishAndAquatics',
                    "fishAndAquatics":savedProductCategory._id
                } 
            });
    

    await updatedProduct.save().then(async(data)=>{
        console.log(`the product finally saved : ${data}`);
        await Seller.findByIdAndUpdate(req.seller,{
            $push:{"products":{
    
                "category":"fishAndAquatics",
                "productID":data._id,}}
        })
        // updatedSeller.save().then(()=>{
        //     console.log('seller updated successfully');
        // });
    });
        } 

        if(isMeat){
            const meat =Meat({
                'brandName': meatBrandName,
                'meatName': meatMeatName,
                'parts':meatParts,
                'weight':meatWeight,
                'packageType': meatPackageType,
                'cutAt':Date.now(),
                'deliveryCharge': meatDeliveryCharge

            });
            savedProductCategory =  await meat.save();

        
            console.log(`savedProductCategory._id from meat is ${savedProductCategory._id}`);

            const updatedProduct= await Product.findByIdAndUpdate(savedProduct._id,{
                "category":{
                    "categoryName":'meat',
                    "meat":savedProductCategory._id
                } 
            });
    

        await updatedProduct.save().then(async(data)=>{
            console.log(`the product finally saved : ${data}`);
        //    let updatedSeller =  await Seller.findByIdAndUpdate(req.seller,{
        //         "products":{'ProductID':savedProduct._id,"category":"fishAndAquatics"}
        //     });

        await Seller.findByIdAndUpdate(req.seller,{
            $push:{"products":{
    
                "category":"meat",
                "productID":data._id,}}
        });
    });
   
        }
return res.status(200).json({"msg":"Product posted suucessfully"});
//   console.log(`savedProductCategory._id is ${savedProductCategory._id}`);

//   product = Product({
//     "category":{
//         "categoryName":isPet?'pet':isCattle?'cattle':isBirds?'birds':isFishAndAquatics?'fishAndAquatics':isAccessories?'accessories':isFeed?'feed':isMedicine?'medicine':isMeat?'meat':isPoultry?'poultry':isToy?'toy':'noneCategory'
        
    
//   })


     
} catch (e) {
    console.log(`the error is ${e}`);
    return res.status(400).json({ "msg": e.message })
}


})


sellerRouter.get('/api/seller/getProductsId',sellerMiddleware,async(req,res)=>{
    try {
        const seller = await Seller.findById(req.seller);
      //  console.log(`the seller in getSellerById is ${seller}`);

        // let allProducts=[]

        // let prodlen = seller.products.length;

        // for(let i=0;i<prodlen;i++){

            
        // }
        console.log(`the prods are ${seller.products}`)

return res.status(200).json({"productsID":seller.products});


    } catch (e) {
        console.log(`the error is ${e}`);
    return res.status(400).json({ "msg": e.message })
    }
})


sellerRouter.post('/api/seller/getProductDetailsById',sellerMiddleware,async(req,res)=>{
    try {

        let allProdArr =[];
        let categoryDetailsArr =[];

        const {productsId}=req.body;
console.log(`the productsID is ${productsId}`)

        for(let i=0;i<productsId.length;i++){
            let prodDetails = await Product.findById(productsId[i]).then(async(data)=>{
                console.log(`the data is ${data}`)
                console.log(`the prodDetails of ${i+1} is ${data} `);
                allProdArr.push(data);
                if(data.category.categoryName=='cattle'){
            let animalDetails = await Animal.findById(data.category.cattle).then((cattleData)=>{
                        if(cattleData==null){
                            categoryDetailsArr.push('');
                        }
                        categoryDetailsArr.push(cattleData);
                    })
                }
                if(data.category.categoryName=='pet'){
                    let petDetails = await Animal.findById(data.category.pet).then((petData)=>{
                                if(petData==null){
                                    categoryDetailsArr.push('');
                                }else{

                                    categoryDetailsArr.push(petData);
                                }
                            })
                        }
                if(data.category.categoryName=='meat'){
                    let meatDetails = await Meat.findById(data.category.meat).then((meatData)=>{
                                if(meatData==null){
                                    categoryDetailsArr.push('');
                                }else{

                                    categoryDetailsArr.push(meatData);
                                }
                            })
                        }
                if(data.category.categoryName=='fishAndAquatics'){
                    let fishAndAquaticsDetails = await Meat.findById(data.category.fishAndAquatics).then((fishAndAquaticsData)=>{
                                if(fishAndAquaticsData==null){
                                    categoryDetailsArr.push('');
                                }else{

                                    categoryDetailsArr.push(fishAndAquaticsData);
                                }
                            })
                        }
                if(data.category.categoryName=='toy'){
                    let toyDetails = await Toy.findById(data.category.toy).then((toyData)=>{
                                if(toyData==null){
                                    console.log('the toy data is null')
                                    categoryDetailsArr.push('');
                                }else{
                            console.log(`the toy data is ${toyData}`);
                                    categoryDetailsArr.push(toyData);
                                }
                            })
                        }
                if(data.category.categoryName=='accessories'){
                    let accessoriesDetails = await Accessory.findById(data.category.accessories).then((accessoriesData)=>{
                                if(accessoriesData==null){
                                    categoryDetailsArr.push('');
                                }else{

                                    categoryDetailsArr.push(accessoriesData);
                                }
                            })
                        }
                if(data.category.categoryName=='feed'){
                    let feedDetails = await Feed.findById(data.category.feed).then((feedData)=>{
                                if(feedData==null){
                                    categoryDetailsArr.push('');
                                }else{

                                    categoryDetailsArr.push(feedData);
                                }
                            })
                        }
            });
        }

        console.log(`the allProdArr is ${allProdArr}`);
        console.log(`the category arr is ${categoryDetailsArr}`)

        return res.status(200).json({'allProdArr':allProdArr,'categoryDetailsArr':categoryDetailsArr})

    } catch (e) {
        console.log(`the error is ${e}`);
        return res.status(400).json({ "msg": e.message })
    }
})
sellerRouter.get('/api/test',async(req,res)=>{
    
      
    const {
        feedBrandName,
        includedIngredients,
        feedWeight,
        targetSpecies,
        feedSizes,
        flavour,
        itemForm,
        ageRange,
        packageType} = req.body.feed;
        
    const{
        toyBrandName,
        toyCategory,
        toyType,
        toyUsage,
        toyColors,
        toySizes,
        toyWeight,
        toyDimensions,
        toyMaterial,
        toyCountryOfOrigin} = req.body.toy


        console.log(`the feed data is ${req.body.feed}`);
        
        console.log(`the feed ageRange  is ${ageRange}`);

        
        console.log(`the toy data is ${req.body.toy}`);
        
        console.log(`the toy material  is ${toyMaterial}`);
        res.status(200).json({msg:"passed successfully"});
});
module.exports = sellerRouter;







// {
//     "product":{
//         "productName":"jimmy",
//         "description":"description of first product",
//         "highlightDescription":"highlightDescription of first product",
//         "elaborateDescription":"elaborateDescription of first product",
//         "images":["image1","image2","image3"],
//         "quantity":1,
//         "price":"75000",
//         "categoryName":"pet",
//         "deliverablespan":["TamilNadu","kerala","Andhra"],
//         "isHavingStock":false,
//         "stockQuantity":1,
//         "isDiscountable":false,
//         "discount":10
//     },
//     "animal":{
//          "subCategoryType":"dog",
//         "breedType":"roteweiler",
//         "color":"brown",
//         "gender":"male",
//         "teeth":2,
//          "age":2,
//         "approximateWeight":15,
//         "approximateHeight":5,
//         "approximateLength":5
//      },
//       "toy":{
//     "toyBrandName":"toybrand2",
//     "toyCategory":"activity toy",
//     "toyType":"chewable",
//     "toyUsage":"increases playfullness",
//     "toyColors":["blue","red","purple"],
//     "toySizes":[10,12,13],
//     "toyWeight":[1,1.5,1.8],
//     "toyDimensions":["2'2'3","2'3'4","2'4'5"],
//     "toyMaterial":"soft plastic",
//     "toyCountryOfOrigin":"India"
// },
//       "feed":{
    // "feedBrandName" :"feedBrand1",
    // "includedIngredients" :["ragi","rice","maize","starch"],
    // "feedWeight" :[25,50,75],
    // "targetSpecies" :["cow","buffalo","horse"],
    // "feedSizes" :["1'2'3","1'3'3","1'4'5"],
    // "flavour" :"sweet",
    // "itemForm" :"dry",
    // "ageRange" :["3 months","upto 5 years"],
    // "packageType" :"sack"
    //  },
//     "accessory":{
//     "accessoryBrandName":"accessoryBrand1",
//     "accessoryCategory":"wearables",
//     "accessoryType":"belt",
//     "accessoryUsage":"used as a collar belt ",
//     "accessoryColors":["red","blue","purple","black"],
//     "accessorySizes":[20,12,18],
//     "accessoryWeight":[1,2,3],
//     "accessoryDimensions":["13'2'6","14'3'7","9'6'4"],
//     "accessoryMaterial":"leather",
//     "accessoryCountryOfOrigin":"India"
//  },
//      "fishAndAquatics":"",
//      "meat":{{
    //      "meatBrandName":"meatBrand1",
    //      "meatMeatName":"chicken",
    //      "meatParts":["breast","leg","wings","neck"],
    //      "meatWeight":[1,2,3,0.5],
    //      "meatPackageType":["box","bag"],
    //      "meatDeliveryCharge":10
    //   }}
     

// }