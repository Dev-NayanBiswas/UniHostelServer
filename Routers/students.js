const express = require('express');
const {students, ObjectId} = require("../Config/dataBase.js");
const {verifyToken} = require('../middlewares/verifications.js')
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


//! All Students 
.get(verifyToken,async(req,res,next)=>{
    try{
        const allUsers = await students.find().toArray();
        res.status(200).send({
            message:"Successfully fetched users",
            result:allUsers
        })
    }catch(error){
        next(new CustomErrors("Error in loading Users",500))
    }
})


router.route("/:id")
.patch(async(req,res,next)=>{
    const {id} = req.params;
    const query = {_id:new ObjectId(id)}
    const user = await students.findOne(query);
    const switchRole = {
        $set:{
            role:user.role === 'student' ? 'admin' : 'student'
        }
    }

    try{
        const updateRole = await students.updateOne(query,switchRole,{upsert:true});
    res.status(200).send({message:'Role Updated', result:updateRole})
    }catch(error){
        next(new CustomErrors("Error in updating Role", 500))
    }
})


module.exports = router;