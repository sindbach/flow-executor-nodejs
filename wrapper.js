const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {useUnifiedTopology:true});

// Database Name
const dbName = 'flow';
const collName = 'node';

async function run() {
  try {
    await client.connect(); 
    const db = client.db(dbName);
    const collection = db.collection(collName);
    console.log("Connected correctly to server");

    // Print out inserted docs (findOne)
    try {
      let result = await collection.findOne({}); 
      console.log(result); 
    } catch (err){
      console.error(`Encountered an error: ${err}`);
    }

  } finally {
    await client.close(); 
  }
}
run().catch(console.dir);