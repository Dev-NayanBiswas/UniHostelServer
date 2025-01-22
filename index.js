const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();


const app = express();
const PORT = process.env.CUSTOM_PORT || 8000;


app.use(express.json());
app.use(cookieParser());
app.use(cors());


const CustomErrors = require('./Errors/CustomErrors');
const GlobalErrorController = require('./Errors/GlobalErrorController.js');
const studentsRouters = require('./Routers/students.js');
const subscriptionsRouter = require('./Routers/subscriptions.js');
const mealsRouters = require('./Routers/meals.js');
const tokenRouters = require('./Routers/accessToken.js');
const adminRouters = require('./Routers/admin.js');
const isStudentRouters = require('./Routers/student.js');
const paymentRoute = require('./Routers/payment.js');
const transactionsRouters = require('./Routers/transactions.js')




app.use("/students", studentsRouters);
app.use("/subscriptions", subscriptionsRouter);
app.use("/meals",mealsRouters);
app.use("/token",tokenRouters);
app.use("/admin",adminRouters);
app.use("/isStudent",isStudentRouters);
app.use("/payment",paymentRoute);
app.use("/transactions",transactionsRouters)



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
