require('dotenv').config({ path: 'config.env'});
const db = {};

db.host = process.env.HOST || "[the endpoint URI of your Azure Cosmos DB account]";
db.authKey =
  process.env.AUTH_KEY || "[the PRIMARY KEY value of your Azure Cosmos DB account";
db.databaseId = "agronative";

if (db.host.includes("https://localhost:")) {
  console.log("Local environment detected");
  console.log("WARNING: Disabled checking of self-signed certs. Do not have this code in production.");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log(`Go to http://localhost:${process.env.PORT || '4000'} to try the sample.`);
}

const CosmosClient = require("@azure/cosmos").CosmosClient;
const cosmosClient = new CosmosClient({
  endpoint: db.host,
  key: db.authKey,
});

db.cosmosClient = cosmosClient

module.exports = db;