const express = require('express');
const {reviews, meals, ObjectId} = require("../Config/dataBase.js");
const CustomErrors = require('../Errors/CustomErrors.js');
const {verifyToken, verifyStudent} = require('../middlewares/verifications.js');
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

router.route("/studentReviews/:email?")
.patch(verifyToken, verifyStudent,async(req,res,next)=>{
    const {email} = req.params;
    const {reviewID,comment,rating, mealID} = req.body;
    console.log(mealID)
    const options = {$set:{comment,rating}};
    try{
        const result = await reviews.updateOne({_id:new ObjectId(reviewID)}, options,{upsert:true});
        if(result.modifiedCount > 0){
            await meals.updateOne({_id : new ObjectId(mealID)},{$inc:{rating:- rating}})
        };
    res.status(200).send({message:"Review Updated", result:result})
    }catch(error){
        next(new CustomErrors("Error in Updating Review", 500))
    }
})
.delete(verifyToken,async(req,res,next)=>{
    const {reviewID, mealID, myRating} = req.query;
    const result = await reviews.deleteOne({_id:new ObjectId(reviewID)});
    if(result.deletedCount){
        await meals.updateOne({_id:new ObjectId(mealID)},{$inc:{reviewCount: - 1, rating: - myRating}});
    }
    res.status(200).send({message:"Review Deleted", result:result})
})



.get(verifyToken,async(req,res,next)=>{
    

    try{
        const {email} = req.params;

    const searchQuery = email ? {email} : {};
    // if(email){
    //     searchQuery.email = email;
    // }
        const userReviews = await reviews.find(searchQuery).toArray();
    const reviewIdAndObjectID = userReviews.map(({mealID, _id, comment, rating})=>({_id:new ObjectId(mealID), reviewID:_id, comment:comment, myRating:rating}));
    const onlyIDs = reviewIdAndObjectID.map(({_id})=>_id);

    const reviewMeals = await meals.find({_id:{$in:onlyIDs}}).toArray();

    const reviewsWithReviewID = reviewMeals.map((meal)=>{
        const {reviewID,comment,myRating} = reviewIdAndObjectID.find(
            (rMeals)=>rMeals._id.equals(meal._id));
        return {...meal,reviewID, comment,myRating}
    })
    res.status(200).send({message:"Reviews fetched from Database", result:reviewsWithReviewID})
    }catch(error){
        next(new CustomErrors("Error in Fetching My Reviews", 500))
    }
})

module.exports = router;