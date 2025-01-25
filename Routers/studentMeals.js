const express = require('express');
const {students,meals, ObjectId} = require("../Config/dataBase.js");
const {verifyToken, verifyStudent} = require('../middlewares/verifications.js')
const CustomErrors = require('../Errors/CustomErrors.js')
const router = express.Router();

router.route("/:email")
.get(verifyToken,verifyStudent,async(req,res,next)=>{
    const {email} =req.params;
    const {meals:studentMeal = []} = req.query;


    console.log(studentMeal);

    const allObjectId = studentMeal.map(mealId => new ObjectId(mealId));
    // console.log(email);
    // console.log("Student meals Hit the Client");
    const selectedMeals = await meals.find({_id:{$in:allObjectId}}).toArray();
    res.send(selectedMeals);

    // console.log(selectedMeals);
});


module.exports = router;