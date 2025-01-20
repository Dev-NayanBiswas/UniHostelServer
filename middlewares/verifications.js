const verifyToken = (req,res,next)=>{
    console.log('inside verify token',req.headers)
    next()
}


module.exports = {
    verifyToken
}