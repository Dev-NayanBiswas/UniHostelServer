const express = require('express')
const cors = require('cors');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
require('dotenv').config();

const router = express.Router();

router.route("/")
.post(async(req,res)=>{
    const userCred = req.body;
    const token = jwt.sign(userCred, process.env.CLIENT_SECRET, {expiresIn:'1h'});

    res.cookie('Client-Token', token, {
        httpOnly:true,
        secure:process.env.NODE_ENV === 'production',
        sameSite:'strict',
        maxAge: 60*60*1000
    });

    res.status(200).send({message:"Successfully Logged in"})
})

.get(async(req,res)=>{
    res.clearCookie("Client-Token",{
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:'strict',
        path:"/",
    })

    res.status(200).send({message:'Successfully Logged out'})
})

module.exports = router;
