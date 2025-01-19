const express = require('express');
const {students, ObjectId} = require("../Config/dataBase.js");
const CustomErrors = require('../Errors/CustomErrors.js')
const router = express.Router();


router.route("/")
.post(async(req,res,next)=>{
    const data = req.body;
    const isExisted = await students.findOne({email:data.email});
    if(isExisted){
        res.status(200).send({
            message:"Welcome Back to UniHostel 😃"
        })
        return;
    }
    try{
        const withRole = {...data, role:"student"}
        const result = await students.insertOne(withRole);
        res.send({
            message:"Welcome to UniHostel",
            result:result
        })
    }catch(error){
        next( new CustomErrors("Error in posting Student data", 500))
    }
})


module.exports = router;