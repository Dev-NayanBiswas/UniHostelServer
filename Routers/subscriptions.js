const express = require('express');
const {subscriptions, ObjectId} = require("../Config/dataBase.js");
const CustomErrors = require('../Errors/CustomErrors.js')
const router = express.Router();



router.route("/")
.get(async(req,res,next)=>{
    try{
        const result = await subscriptions.find().toArray();
        res.status(200).send({
            message:"Subscriptions data fetched Successfully",
            result:result,
        })
    }catch(error){
        next( new CustomErrors("Error in fetching Subscription Data", 500))
    }
})
router.route("/:id")
.get(async(req,res,next)=>{
    const {id} = req.params;
    try{
        const result = await subscriptions.findOne({_id:new ObjectId(id)});
        res.status(200).send({
            message:"Subscriptions data fetched Successfully",
            result:result,
        })
    }catch(error){
        next( new CustomErrors("Error in fetching Subscription Data", 500))
    }
})


module.exports = router;