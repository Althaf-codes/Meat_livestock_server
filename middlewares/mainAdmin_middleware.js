const jwt = require("jsonwebtoken");
const {MainAdmin} = require('../models/mainAdminSchema');

const mainAdminMiddleware = async (req, res, next) => {
  try {
    const token = req.header("x-mainAdminauth-token");
    if (!token)
      return res.status(401).json({ msg: "No auth token, access denied" ,"isTrue":false,});

    const verified = jwt.verify(token, "mainAdminPasswordKey");
    if (!verified)
      return res
        .status(401)
        .json({"msg": "Token verification failed, authorization denied.", "isTrue":false,});
    const mainAdminDetails = await MainAdmin.findById(verified.id);
    if (mainAdminDetails==''||mainAdminDetails==null) {
      return res.status(401).json({ "msg": "You don't have admin account !" ,"isTrue":false,});
    }
    req.mainAdmin = verified.id;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = mainAdminMiddleware;