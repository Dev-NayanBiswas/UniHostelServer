const express = require('express');
const {students,meals,requestedMeals, ObjectId} = require("../Config/dataBase.js");
const {verifyToken, verifyStudent} = require('../middlewares/verifications.js')
const CustomErrors = require('../Errors/CustomErrors.js');
const router = express.Router();

router.route("/:email")
.delete(verifyToken,verifyStudent,async(req,res,next)=>{
    const {email} = req.params;
    const {id} = req.query;
    // console.log("from Delete",id, email)
    try{
        const deleteRequest = await requestedMeals.deleteOne({_id:new ObjectId(id)});
    res.status(200).send({message:"Requested Meal Deleted Successfully", result:deleteRequest});
    }catch(error){
        next(new CustomErrors("Error in Deleting Requested meal", 500))
    }
})



.post(verifyToken,verifyStudent,async(req,res,next)=>{
    const {email} =req.params;
    const data = req.body;
    // console.log("email from student Meals", email);
    try{
        const result = await requestedMeals.insertOne(data);
    res.status(200).send({message:"Meal Requested", result:result})
    }catch(error){
        next(new CustomErrors("Error in sending Request for meals", 500))
    }
})
.get(verifyToken,verifyStudent,async(req,res,next)=>{
    const {email} = req.params;
    const studentMeals = await requestedMeals.find({email:email, status:"requested"}).toArray();
    const mealIDs = studentMeals.map(({mealID})=> (mealID));
    res.status(200).send({message:"all Requested meal ID fetched",mealIDs:mealIDs});
})

router.route("/pendingMeals/:email")
.get(verifyToken,verifyStudent,async(req,res,next)=>{
    const {email} = req.params;
    try{
        const userMealData = await requestedMeals.find({email:email}).toArray();
    const statusAndObjectID = userMealData.map(({mealID, status,_id})=>({_id:new ObjectId(mealID), status:status, requestID:_id}));
    const onlyMealWithIDs = statusAndObjectID.map(({_id})=>_id);

    const pendingMeals = await meals.find({_id:{$in:onlyMealWithIDs}}).toArray();
    const pendingMealsWithStatus = pendingMeals.map((meal)=>{
        const {status, requestID} = statusAndObjectID.find(
            (requestedMeal)=>requestedMeal._id.equals(meal._id));
        return {...meal,status,requestID}
    })



    res.status(200).send({message:"Pending Meals fetched from Database", result:pendingMealsWithStatus})
    }catch(error){
        next(new CustomErrors("Error in Fetching Pending Meals", 500))
    }

})



module.exports = router;