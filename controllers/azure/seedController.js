class SeedController {
  constructor(cosmosClient, databaseId, containerId) {
    this.client = cosmosClient;
    this.databaseId = databaseId;
    this.containerId = containerId;
    this.container = null;
    this.init();
  }

  async init() {
    try {
      const { container } = await this.client
        .database(this.databaseId)
        .containers.createIfNotExists({
          id: this.containerId,
        });
      this.container = container;
    } catch (error) {
      console.error("Error initializing container:", error);
    }
  }

  async createSeed(req, res) {
    try {
      const item = req.body;
      await this.container.items.create(item);
      res.status(201).json({ message: "Seed created successfully" });
    } catch (error) {
      console.error("Error creating seed:", error);
      res.status(500).json({ error: "Error creating seed" });
    }
  }

  async updateSeed(req, res) {
    try {
      const itemId = req.params.id;
      const item = req.body;
      item.completed = true;
      await this.container.item(itemId, undefined).replace(item);
      res.status(200).json({ message: "Seed updated successfully" });
    } catch (error) {
      console.error("Error updating seed:", error);
      res.status(500).json({ error: "Error updating seed" });
    }
  }

  async deleteSeed(req, res) {
    try {
      const itemId = req.params.id;
      await this.container.item(itemId, undefined).delete();
      res.status(200).json({ message: "Seed deleted successfully" });
    } catch (error) {
      console.error("Error deleting seed:", error);
      res.status(500).json({ error: "Error deleting seed" });
    }
  }

  async getSeedById(req, res) {
    try {
      const itemId = req.params.id;

      const { resource } = await this.container.item(itemId, undefined).read();
      res.status(200).json(resource);
    } catch (error) {
      console.error("Error fetching seed by id:", error);
      res.status(500).json({ error: "Error fetching seed by id" });
    }
  }

  async getSeedsByParentId(req, res) {
    try {
      const { parent_id } = req.query;
      const querySpec = {
        query: `SELECT * FROM root r WHERE r.parent_id=@id`,
        parameters: [
          {
            name: "@id",
            value: parent_id,
          },
        ],
      };
      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching seeds by parent id:", error);
      res.status(500).json({ error: "Error fetching seeds by parent id" });
    }
  }
}

module.exports = SeedController;
