
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
const meals = UniHostel.collection("Meals");
const reviews = UniHostel.collection("Reviews");
const transactions = UniHostel.collection("Transactions");




module.exports = {
    meals,
    reviews,
    students,
    transactions,
    ObjectId,
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
