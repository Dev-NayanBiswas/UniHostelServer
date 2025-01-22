
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const UniHostel = client.db("UniHostel");
const students = UniHostel.collection("Students");
const subscriptions = UniHostel.collection("Subscriptions");
const meals = UniHostel.collection("Meals");
const reviews = UniHostel.collection("Reviews");
const transactions = UniHostel.collection("Transactions");
const requestedMeals = UniHostel.collection("RequestedMeals");


const mealState = async(id)=>{
  const data = await meals.findOne({_id:new ObjectId(id)});
  if(data.state==="upcoming"){
    const options = {
      $set:{
        state:"published"
      }
    };

    data.likes === 10 && await meals.updateOne({_id:new ObjectId(id)},options)
  }
  return;
}





module.exports = {
  subscriptions,
    meals,
    reviews,
    students,
    transactions,
    requestedMeals,
    ObjectId,
    mealState,
}


// async function run() {
//   try {
//     await client.connect();
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);
