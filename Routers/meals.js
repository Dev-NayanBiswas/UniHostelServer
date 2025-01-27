const express = require("express");
const { mealState,meals,students, ObjectId } = require("../Config/dataBase.js");
const CustomErrors = require("../Errors/CustomErrors.js");
const {verifyAdmin,verifyToken} = require('../middlewares/verifications.js')
const router = express.Router();

router
  .route("/")
  .patch(verifyToken,verifyAdmin,async (req, res, next) => {
    try{
      const {id} = req.body;
      const updateStatus = await meals.updateOne({_id: new ObjectId(id)},{$set:{state:'published'}});
      res.status(200).send({message:"Meal Published", result:updateStatus})
    }catch(error){
      next( new CustomErrors('Error in meal Publishing', 500))
    }
  })
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
      const result = await meals.find(query).sort({likes:-1}).toArray();
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
  let options = {};
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
  try{
    const {email, sortBy = "likes", search = "", page = 1, limit = 5 } = req.query;
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
    query.title = { $regex: search, $options: "i" };
  }

  const sortOptions = {};
  if (sortBy === "likes") {
    sortOptions.likes = -1; //desc
  } else if (sortBy === "reviewCount") {
    sortOptions.reviewCount = -1; // Desc
  }

  const skip = (page - 1) * limit;

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

  }catch(error){
    next(new CustomErrors('Error in Fetching Data', 500))
  }
})


//! Update meal by Admin 
router.route("/editMeal/:id")
.patch(async(req,res,next)=>{
  const {id} = req.params;
  const data = req.body;
  const options = {$set:{...data}};

  // res.send({id:id, options:options})
  try{
    const result = await meals.updateOne({_id:new ObjectId(id)}, options,{upsert:true});
    res.status(200).send({message:"Meals Updated by Admin", result:result});
  }catch(error){
    next(new CustomErrors('Error in updating Meal', 500))
  }
})
.delete(async(req,res,next)=>{
  const {id} = req.params;

  try{
    const result = await meals.deleteOne({_id:new ObjectId(id)});
    res.status(200).send({message:"Meal Deleted by Admin", result:result});
  }catch(error){
    next(new CustomErrors('Error in removing Meal', 500))
  }
})


module.exports = router;
