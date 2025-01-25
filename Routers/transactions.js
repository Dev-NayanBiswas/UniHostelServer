const express = require("express");
const { transactions, ObjectId } = require("../Config/dataBase.js");
const CustomErrors = require("../Errors/CustomErrors.js");
const {verifyToken, verifyStudent} = require('../middlewares/verifications.js')
const router = express.Router();


router.route("/")
.post(verifyToken,async(req,res,next)=>{
    const TXData = req.body;
    try{
        const result = await transactions.insertOne(TXData);
        res.status(200).send({message:"Transaction Succeeded", result:result})
    }catch(error){
        next(new CustomErrors("Error in update Transaction history"))
    }
})
router.route("/studentTransactions/:email")
.get(verifyToken, verifyStudent,async(req,res,next)=>{
    const {email} = req.params;
    try{
        const studentTransactions = await transactions.find({email}).toArray();
    res.status(200).send({message:"Transaction History", result:studentTransactions}); 
    }catch(error){
        next(new CustomErrors("Error in Loading Student's Payment History", 500))
    }
    
})

module.exports = router;
