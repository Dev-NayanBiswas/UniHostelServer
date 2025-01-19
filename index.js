const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();
const PORT = process.env.CUSTOM_PORT || 8000;


const corsOptions = {
    origin:["http://localhost:5173"],
    credentials:true,
    methods:["GET,HEAD,PUT,PATCH,POST,DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
}


app.use(express.json())
app.use(cookieParser());
app.use(cors(corsOptions))


const CustomErrors = require('./Errors/CustomErrors');
const GlobalErrorController = require('./Errors/GlobalErrorController.js');
const studentsRouters = require('./Routers/students.js');
const subscriptionsRouter = require('./Routers/subscriptions.js');
const mealsRouters = require('./Routers/meals.js');
const tokenRouters = require('./Routers/accessToken.js');




app.use("/students", studentsRouters);
app.use("/subscriptions", subscriptionsRouter);
app.use("/meals",mealsRouters);
app.use("/token",tokenRouters);



app.get("/", async(req,res,next)=>{
    res.send("UniHostel on the Air Now")
})


app.use((req,res,next)=>{
    const err = new CustomErrors(`Can't find ${req.originalUrl} on Server!`, 404);
    next(err);
})

//! Global Error 
app.use(GlobalErrorController)


app.listen(PORT,()=>{
    console.log(`UniHostel is running on port ${process.env.CUSTOM_PORT}`)
})
