const jwt = require("jsonwebtoken");
const {ServiceTeam} = require("../models/serviceTeamSchema");

const serviceTeamAdmin = async (req, res, next) => {
  try {
    const token = req.header("x-serviceTeamAdmin-token");
    if (!token)
      return res.status(401).json({ msg: "No auth token, access denied" });

    const verified = jwt.verify(token, "serviceTeamAdminPasswordKey");
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });
    const serviceTeamAdmin = await ServiceTeam.findById(verified.id);
    if (serviceTeamAdmin === ""||serviceTeamAdmin==null) {
      return res.status(401).json({ msg: "You are not an ServiceTeamAdmin!" });
    }
    req.serviceTeamAdmin = verified.id;
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = serviceTeamAdmin;