const express = require('express');
const {meals, ObjectId} = require("../Config/dataBase.js");
const CustomErrors = require('../Errors/CustomErrors.js')
const router = express.Router();


router.route("/")
.get(async(req,res,next)=>{
    console.log("Get All Data")
})
.post(async(req,res,next)=>{
    
    const mealData = req.body;

    try{
        const result = await meals.insertOne(mealData);
        res.status(200).send({
            message:"Meal added Successfully",
            result:result,
        })
    }catch(error){
        next(new CustomErrors("Error in posting Meal", 500))
    }
})

module.exports = router;