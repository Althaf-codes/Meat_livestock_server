const jwt = require("jsonwebtoken");
const {User} = require("../models/userSchema");

const localAreaAdminMiddleWare = async (req, res, next) => {
  try {
    const token1 = req.header("x-localAreaAdminAuth-token");
    const token2 = req.header("x-auth-token");

    if (!token1){
      
      return res.status(401).json({ msg: "No localAreaAdminAuth token1, access denied, please signIn again into your seller account" });
    }
      if(!token2){
      
        return res.status(401).json({ msg: "No auth token2, access denied, please signIn again" });
      }
    const verified1 = jwt.verify(token1, "localAreaAdminPasswordKey");
    const verified2 = jwt.verify(token2, "passwordKey");
    
    console.log(`the verified 1 is ${verified1}`);
    
    console.log(`the verified 2 is ${verified2}`);
    if (!verified1)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied for localAreaAdmin." });
        if (!verified2)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied for user." });
    const user = await User.findById(verified2.id);
    if (user.type ==="localAreaAdmin") {
        req.localAreaAdmin = verified1.id;
        req.user = verified2.id
        req.token1 = token1;
        req.token2 = token2;
    }else{
        return res.status(401).json({ msg: "You are not an localAreaAdmin!" })
    };
    next();
  }catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = localAreaAdminMiddleWare;
