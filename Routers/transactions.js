const express = require("express");
const { transactions, ObjectId } = require("../Config/dataBase.js");
const CustomErrors = require("../Errors/CustomErrors.js");
const {verifyToken} = require('../middlewares/verifications.js')
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

module.exports = router;
