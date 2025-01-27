const express = require('express');
const {students,meals,requestedMeals, ObjectId} = require("../Config/dataBase.js");
const {verifyToken, verifyStudent,verifyAdmin} = require('../middlewares/verifications.js')
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
.get(verifyToken,async(req,res,next)=>{
    const {email} = req.params;
   try{
    const studentMeals = await requestedMeals.find({email:email, status:"requested"}).toArray();
    const mealIDs = studentMeals.map(({mealID})=> (mealID));
    res.status(200).send({message:"all Requested meal ID fetched",mealIDs:mealIDs});
   }catch(error){
    next(new CustomErrors("Error in fetching Requested IDs", 500))
   }
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


//! Admin API 
router.route("/requestedMeals/admin")
.get(verifyToken,verifyAdmin,async(req,res,next)=>{
    const email = req.user;
    const {search, category} = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 5; 
    const skip = (page - 1) * limit;

    const query = {
        email:{$ne:email},
        $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
    }
    if(category){
        query.status = category;
      }

    try{
        const totalMeals = await requestedMeals.countDocuments(query);
        const totalPages = Math.ceil(totalMeals / limit);
        const pendingMeals = await requestedMeals.find(query).skip(skip).limit(limit).toArray()
        res.status(200).send({
            message:"Successfully fetched users",
            result:pendingMeals,
            totalPages,
        })
    }catch(error){
        next(new CustomErrors("Error in loading Users",500))
    }
})
//! Serving Meals 
.patch(verifyToken,verifyAdmin,async(req,res,next)=>{
    try{
        const {id} = req.query;
    const updateMealStatus = await requestedMeals.updateOne({_id: new ObjectId(id)},{$set:{status:"served"}});
    res.status(200).send({message:"Meal Served Successfully", result:updateMealStatus})
    }catch(error){
        next(new CustomErrors("Error in updating meal Status", 500))
    }
})



module.exports = router;