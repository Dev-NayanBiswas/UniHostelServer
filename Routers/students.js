const express = require('express');
const {students, ObjectId} = require("../Config/dataBase.js");
const {verifyToken, verifyAdmin} = require('../middlewares/verifications.js')
const CustomErrors = require('../Errors/CustomErrors.js')
const router = express.Router();


router.route("/")
//! Adding User to database 
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
.get(verifyToken,verifyAdmin,async(req,res,next)=>{
    const email = req.user.email;
    const query = {email:{$ne:email}}
    try{
        const allUsers = await students.find(query).toArray();
        res.status(200).send({
            message:"Successfully fetched users",
            result:allUsers
        })
    }catch(error){
        next(new CustomErrors("Error in loading Users",500))
    }
})



//! Updating Roles 
router.route("/:id")
.patch(verifyToken,verifyAdmin,async(req,res,next)=>{
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

router.route("/badge/:email")
.patch(verifyToken, async(req,res,next)=>{
    const {email} = req.params;
    const data = req.body;
    const options = {
        $set:{
            badge:data.badge,
            color:data.color,
        }
    }
    try{
        const result = await students.updateOne({email:email},options, {upsert:true});
        res.status(200).send({message:'Badge Updated', result:result});
    }catch(error){
        next(new CustomErrors("Error in updating Badge", 500))
    }

})





module.exports = router;