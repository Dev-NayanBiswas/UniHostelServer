const express = require("express");
const { mealState,meals,students, ObjectId } = require("../Config/dataBase.js");
const CustomErrors = require("../Errors/CustomErrors.js");
const {verifyAdmin,verifyToken} = require('../middlewares/verifications.js')
const router = express.Router();

router
  .route("/")

//! Get all Meals & By Categories   
  .get(async (req, res, next) => {
    const { category, status } = req.query;

    const query = { state: "published" };

    if (category && category !== "all") {
      query.category = category;
    }

    if(status){
        query.state = status
    }

    try {
      const result = await meals.find(query).toArray();
      res.status(200).send({
        message: "Successfully fetched published meals",
        result: result,
      });
    } catch (error) {
      next(new CustomErrors("Error in fetching Published Meals"));
    }
  })


//! Add Meal   
  .post(verifyToken,verifyAdmin,async (req, res, next) => {
    const mealData = req.body;

    try {
      const result = await meals.insertOne(mealData);
      res.status(200).send({
        message: "Meal added Successfully",
        result: result,
      });
    } catch (error) {
      next(new CustomErrors("Error in posting Meal", 500));
    }
  });


//! Get Meal by ID 
router.route("/:id")
.patch(verifyToken,async (req, res, next)=>{
  const {id} = req.params;
  const {like} = req.body;
  // console.log(id, like)
  // const mealData = await meals.findOne({_id:new ObjectId(id)});
  let options = {};
  // console.log(typeof mealData?.likes, mealData?.likes)
  // console.log(typeof like, like)
  if(like){
    options = {
      $inc:{
        likes:1
      }
    }
  }
  try{
    const result = await meals.updateOne({_id:new ObjectId(id)}, options,{upsert:true});
    mealState(id);
    res.status(200).send({message:"Like Count Updated", result:result});
  }catch(error){
    next(new CustomErrors('Error in updating likes', 500))
  }
})

//! Get Card Details 
.get(async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await meals.findOne({ _id: new ObjectId(id) });
    res.status(200).send({
      message: "Details data fetched Successfully",
      result: result,
    });
  } catch (error) {
    next(new CustomErrors("Error in fetching Meal Details"));
  }
});

//! All Meals of students for Admin
router.route("/studentMeals/adminDashboard")
.get(verifyToken,async(req,res,next)=>{
  const {email, sortBy = "likes", search = "", page = 1, limit = 10 } = req.query;
  const query = {};

  if(email){
    query.email = email;
    const result = await meals.find(query).toArray();
    const adminData = await students.findOne(query);
    const adminDataWithContribution = {...adminData,contribution:result.length};
    res.status(200).send({ message: "Admin data fetched Successfully", result:adminDataWithContribution });
    return;
  }
  if (search) {
    query.title = { $regex: search, $options: "i" }; // Case-insensitive search
  }

  const sortOptions = {};
  if (sortBy === "likes") {
    sortOptions.likes = -1; // Descending order
  } else if (sortBy === "reviewCount") {
    sortOptions.reviewCount = -1; // Descending order
  }

  const skip = (page - 1) * limit;

  // Rename 'meals' to 'mealResults' to avoid conflict
  const mealResults = await meals.find(query)
    .sort(sortOptions)
    .skip(skip)
    .limit(parseInt(limit))
    .toArray();

  const totalItems = await meals.countDocuments(query);

  res.status(200).send({
    message: "Meals fetched successfully",
    result: mealResults,
    totalItems,
    currentPage: page,
    totalPages: Math.ceil(totalItems / limit),
  });
})


module.exports = router;
