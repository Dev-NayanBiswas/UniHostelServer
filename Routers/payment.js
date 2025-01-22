const express = require('express');
const CustomErrors = require('../Errors/CustomErrors');
const { verifyToken } = require('../middlewares/verifications');
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);
const router = express.Router();


router.route("/")
.post(verifyToken,async(req,res,next)=>{
    const {price} = req.body;
    const amount = parseFloat(price * 100);
    console.log(price)
    try{
        const paymentIntent = await stripe.paymentIntents.create({
            amount:amount,
            currency:"usd",
            payment_method_types: ["card"],
        });
        res.send({clientSecret:paymentIntent.client_secret})

    }catch(error){
        next(new CustomErrors("Error in Payment", 500))
    }
})

module.exports = router;
