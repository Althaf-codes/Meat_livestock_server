const mongoose = require('mongoose');
const sellerSchema = require('./sellerSchema');
const mainAdminSchema = mongoose.Schema({
    mainAdminName:{
        required:true,
        type:String,
    },
    mainAdminPhoneNumber:{
        required:true,
        type:String},
    mainAdminPassword1:{
        required:true,
        type:String},
    mainAdminPassword2:{
        required:true,
        type:String}
    // sellers:[{
    //     type:mongoose.Types.ObjectId,
    //     ref:'Seller'
    // }],
    // meatSellers:[{
    //     type:mongoose.Types.ObjectId,
    //     ref:'MeatSeller'
    // }],
    // localAreaAdmins:[{
    //     type:mongoose.Types.ObjectId,
    //     ref:'localAreaAdmin'
    // }],
    // deliveryBoys:[{
    //     type:mongoose.Types.ObjectId,
    //     ref:'deliveryBoy'
    // }],
    // shippers:[{
    //     type:mongoose.Types.ObjectId,
    //     ref:'Shipper'
    // }],
    // products:[{
    //     type:mongoose.Types.ObjectId,
    //     ref:'Product'
    // }],
    // orders:[{
    //     type:mongoose.Types.ObjectId,
    //     ref:'Order'
    // }],
   

},{ timestamps: true });

const MainAdmin = mongoose.model('MainAdmin',mainAdminSchema);

module.exports = {MainAdmin,mainAdminSchema};