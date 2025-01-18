const express = require('express');
const {subscriptions} = require("../Config/dataBase.js");
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


module.exports = router;