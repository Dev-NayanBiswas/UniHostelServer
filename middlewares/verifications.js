const jwt = require("jsonwebtoken");
const { students } = require("../Config/dataBase");

//! Verify Token 
const verifyToken = (req,res,next)=>{
    // console.log("at Top",req.headers);
    if(!req.headers.authorization){
        // console.log("Inside If")
        return res.status(401).send({message:"Unauthorized Access"})
    }
    const token = req.headers.authorization.split(" ").pop();
    // console.log(!token, "Got token")
    jwt.verify(token, process.env.CLIENT_SECRET,(err,decoded)=>{
        if(err){
            // console.log("Inside Err")
            return res.status(401).send({message:"Unauthorized Access . . ."})
        }
        req.user = decoded;
        next()
    })
}

//! Verify Admins 
const verifyAdmin = async(req,res,next)=>{
    const {email} = req.user;
    const query = {email:email};
    const userData = await students.findOne(query);
    const isAdmin = userData?.role === 'admin';
    if(!isAdmin){
        return res.status(403).send({message:"Forbidden Access"})
    }
    next();
}

//! Verify same student or not 
const verifyStudent = async(req,res,next)=>{
    // console.log("from verify student", req.params.email);
    const {email} = req.user;
    const query = {email:email};
    const studentData = await students.findOne(query);
    const isStudent = studentData?.role === 'student';
    if(!isStudent){
        return res.status(403).send({message:"Forbidden Access"})
    }
    if(email !== req.params.email){
        return res.status(403).send({message:"Forbidden Access"})
    }
    // console.log("valid or Not?",email === req.params.email)
    next();
}


module.exports = {
    verifyAdmin,
    verifyToken,
    verifyStudent
}