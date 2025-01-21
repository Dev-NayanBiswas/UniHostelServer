const express = require('express')
const jwt = require("jsonwebtoken");
require('dotenv').config();

const router = express.Router();

router.route("/")
.post(async(req,res)=>{
    const userCred = req.body;
    const token = jwt.sign(userCred, process.env.CLIENT_SECRET, {expiresIn:'1h'});
    res.status(200).send({message:"Successfully Logged in", result:token})
})


module.exports = router;
