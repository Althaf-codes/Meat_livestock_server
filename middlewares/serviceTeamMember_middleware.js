const jwt = require("jsonwebtoken");
const {ServiceTeam} = require("../models/serviceTeamSchema");


const serviceTeamMember = async (req, res, next) => {
    try {
      const token = req.header("x-serviceTeamMember-token");
      if (!token)
        return res.status(401).json({ msg: "No auth token, access denied. try sigining in " });
  
      const verified = jwt.verify(token, "serviceTeamMemberPasswordKey");
      if (!verified)
        return res
          .status(401)
          .json({ msg: "Token verification failed, authorization denied." });
         
      console.log(`the verified id is ${verified.id}`)
      let serviceTeamDetails =  await ServiceTeam.findOne({"teamMembers":{$elemMatch:{"_id":verified.id}}});
      
        
      var serviceTeamMember = serviceTeamDetails.teamMembers.filter(function(el){
        return el._id==verified.id;
    });
   
      if (serviceTeamMember === ""||serviceTeamMember==null) {
        return res.status(401).json({ msg: "You are not an ServiceTeamMember!" });
      }
      req.serviceTeamMember = verified.id;
      req.token = token;
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  module.exports = serviceTeamMember;