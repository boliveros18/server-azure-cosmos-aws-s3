class AdjustmentController {
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

  async createAdjustment(req, res) {
    try {
      const item = req.body;
      await this.container.items.create(item);
      res.status(201).json({ message: "Adjustment created successfully" });
    } catch (error) {
      console.error("Error creating adjustment:", error);
      res.status(500).json({ error: "Error creating adjustment" });
    }
  }

  async updateAdjustment(req, res) {
    try {
      const itemId = req.params.id;
      const item = req.body;
      item.completed = true;
      await this.container.item(itemId, undefined).replace(item);
      res.status(200).json({ message: "Adjustment updated successfully" });
    } catch (error) {
      console.error("Error updating adjustment:", error);
      res.status(500).json({ error: "Error updating adjustment" });
    }
  }

  async deleteAdjustment(req, res) {
    try {
      const itemId = req.params.id;
       await this.container
        .item(itemId, undefined)
        .delete();
      res
        .status(200)
        .json({ message: "Adjustment deleted successfully"});
    } catch (error) {
      console.error("Error deleting adjustment:", error);
      res.status(500).json({ error: "Error deleting adjustment" });
    }
  }

  async getAdjustmentById(req, res) {
    try {
      const itemId = req.params.id;
      const { resource } = await this.container.item(itemId, undefined).read();
      res.status(200).json(resource);
    } catch (error) {
      console.error("Error fetching adjustment by id:", error);
      res.status(500).json({ error: "Error fetching adjustment by id" });
    }
  }

  async getAdjustmentsByParentId(req, res) {
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
      console.error("Error fetching adjustments by parent id:", error);
      res
        .status(500)
        .json({ error: "Error fetching adjustments by parent id" });
    }
  }
}

module.exports = AdjustmentController;
