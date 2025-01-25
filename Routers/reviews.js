const express = require('express');
const {reviews, meals, ObjectId} = require("../Config/dataBase.js");
const CustomErrors = require('../Errors/CustomErrors.js');
const {verifyToken} = require('../middlewares/verifications.js');
const router = express.Router();


router.route("/")
.get(async(req,res,next)=>{
    const {mealID, email} = req.query;
    let query = {}
    if(mealID){
        query ={mealID:mealID}
    }
    if(email){
        query = {email:email}
    }
    try{
        const mealReviews = await reviews.find(query).toArray();
        res.status(200).send({message:"Meal Reviews Loaded Successfully", result:mealReviews});
    }catch(error){
        next(new CustomErrors("Error in fetching Reviews"))
    }
})
.post(verifyToken,async(req,res,next)=>{
    const userReview = req.body;
    const id = userReview.mealID;
    const options = {
        $inc:{
            reviewCount:1,
            rating:userReview.rating,
          }
    }
    try{
        await meals.updateOne({_id:new ObjectId(id)}, options,{upsert:true});
    const result = reviews.insertOne(userReview);
    res.status(200).send({message:'Review Added Successfully', result:result})
    }catch(error){
        next(new CustomErrors("Error in adding Reviews", 500))
    }
})

module.exports = router;