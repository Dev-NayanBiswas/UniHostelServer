const express = require('express');
const {meals, ObjectId} = require("../Config/dataBase.js");
const CustomErrors = require('../Errors/CustomErrors.js')
const router = express.Router();


router.route("/")
.get(async(req,res,next)=>{

    const {category} = req.query;

    const query = {state:"published"};
    
    if(category && category !== 'all'){
        query.category = category
    }

    try{
        const result = await meals.find(query).toArray();
        res.status(200).send({
            message:"Successfully fetched published meals",
            result:result
        })
    }catch(error){
        next(new CustomErrors("Error in fetching Published Meals"));
    }
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

router.route("/:id")
.get(async(req,res,next)=>{
    const {id} = req.params;
    try{
        const result = await meals.findOne({_id:new ObjectId(id)});
        res.status(200).send({
            message:"Details data fetched Successfully",
            result:result
        })
    }catch(error){
        next(new CustomErrors("Error in fetching Meal Details"))
    }
})

module.exports = router;