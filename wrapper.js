const MongoClient = require('mongodb').MongoClient;

// Connection URL
const uri = process.env.MONGODB_URI;
const graphId = process.env.GRAPH_ID; 
const nodeId = process.env.NODE_ID;
const client = new MongoClient(uri, {useUnifiedTopology:true});

const dbName = 'flow';
const collName = 'node';

async function run() {
  try {
    await client.connect(); 
    const db = client.db(dbName);
    const collection = db.collection(collName);

    // Get node information 
    let node = null; 
    try {
      node = await collection.findOne({"graphid": graphId, "id": nodeId});
    } catch (err){
      console.error(`Encountered an error while fetching a node: ${err}`);
    }
    // Get ports
    let ports = {"in": {}, "out": {}};
    try {
      // If node has a parent, get all inputs 
      if (node.hasparent === true) {
        let listofports = Object.keys(node.portin);
        let parents = await collection.find({"graphid": graphId, "id":{"$in": listofports}}).toArray();
        // For each of port inputs retrieve the value from the parent port outputs
        for (let i=0; i<node.ports.length; i++) {
          let p = node.ports[i];
          let value = []; 
          if (p.in === true) {
            for (let i=0; i<parents.length; i++){
              let parent = parents[i]; 
              value.push(parent.portout[node.portin[parent.id]["source"]]);
            }
            if (value.length === 0) {
              ports.in[p.name] = "";
            }
            else if (value.length === 1){
              ports.in[p.name] = value[0];
            } else {
              ports.in[p.name] = value; 
            }
          }
        }
      }
    } catch (err){
      console.error(`Encountered an error while retrieving ports values: ${err}`);
    }
    try {
      let fn = Function("ports", node.code + "Node(ports);"); 
      fn(ports);
    } catch (err){
      console.error(`Encountered an error while executing node: ${err}`);
    }
    console.log(node);
    try {
      if (node.portout === null) {
        node.portout = {};
      }
      let listOfPortOuts = Object.keys(ports.out);
      for (let i=0; i<listOfPortOuts.length; i++) {
        let port = node.ports.find(port => port.name === listOfPortOuts[i]);
        node.portout[port.id] = ports.out[listOfPortOuts[i]];
      }
      let result = await collection.updateOne({"graphid": graphId, "id": nodeId}, {"$set":{"portout": node.portout}}); 
      console.log(JSON.stringify(result));
    } catch (err) {
      console.error(`Encountered an error while storing results: ${err}`);
    }
  } finally {
    await client.close(); 
  }
}
run().catch(console.dir);