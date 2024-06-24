const express = require('express');
const app = express();
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const sellerRouter = require('./routes/sell');
const userRouter = require('./routes/user');
const mainAdminRouter = require('./routes/mainAdmin');
const serviceTeamAdminRouter = require('./routes/serviceTeamAdmin');
const serviceTeamMemberRouter = require('./routes/serviceTeamMember');
const localAreaAdminRouter = require('./routes/localAreaAdmin');
const bodyparser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({path:'.env'});


app.use(express.json());
app.use(cors({
    origin:"*",}
));
//app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.urlencoded({extended:true}))

mongoose.connect(process.env.DB,{useNewUrlParser:true}).then(()=>{
    console.log(`DB connected successfully`);
})

app.use(authRouter);
app.use(sellerRouter);
app.use(userRouter);
app.use(mainAdminRouter);
app.use(serviceTeamAdminRouter);
app.use(serviceTeamMemberRouter);
app.use(localAreaAdminRouter);

app.listen(process.env.PORT,()=>{
    
console.log(process.env.PORT,process.env.DB);
    console.log(`Server listening at port ${PORT}`);
})



    