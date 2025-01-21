const express = require('express');
const {students, ObjectId} = require("../Config/dataBase.js");
const {verifyToken} = require('../middlewares/verifications.js')
const CustomErrors = require('../Errors/CustomErrors.js')
const router = express.Router();

//! IsAdmin or Not 
router.route("/:email")
.get(verifyToken,async(req,res,next)=>{
    const {email} = req.params;
    // console.log(email)
    try{
        if(email !== req.user.email){
            return res.status(403).send({message:"Forbidden Access"})
        }else{
            const result = await students.findOne({email:email});
            // console.log(result);
            let isAdmin = false;
            if(result.role === 'admin'){
                isAdmin = true;
            };
            // console.log(isAdmin)
            res.status(200).send(isAdmin);
        }
    }catch(error){
        next(new CustomErrors("Error in Checking roles", 500))
    }
})

module.exports = router;