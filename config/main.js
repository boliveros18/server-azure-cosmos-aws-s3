const CosmosClient = require("@azure/cosmos").CosmosClient;
const debug = require("debug")("todo:main");

class Main {
  /**
   * Manages reading, adding, and updating Tasks in Azure Cosmos DB
   * @param {CosmosClient} cosmosClient
   * @param {string} databaseId
   */
  constructor(cosmosClient, databaseId) {
    this.client = cosmosClient;
    this.databaseId = databaseId;
    this.database = null;
    this.init();
  }

  async init() {
    try {
      debug("Setting up the database...");
      const dbResponse = await this.client.databases
        .createIfNotExists({
          id: this.databaseId,
        })
        .catch((err) => {
          console.error(err);
          console.error(
            "Shutting down because there was an error setting up the database."
          );
          process.exit(1);
        });
      this.database = dbResponse.database;
      debug("Setting up the database...done!");
    } catch (error) {
      console.error(err);
    }
  }
}

module.exports = Main;
