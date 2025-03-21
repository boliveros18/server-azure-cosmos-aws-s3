class EquipmentController {
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

  async createEquipment(req, res) {
    try {
      const item = req.body;
      await this.container.items.create(item);
      res.status(201).json({ message: "Equipment created successfully" });
    } catch (error) {
      console.error("Error creating equipment:", error);
      res.status(500).json({ error: "Error creating equipment" });
    }
  }

  async updateEquipment(req, res) {
    try {
      const itemId = req.params.id;
      const item = req.body;
      item.completed = true;
      await this.container.item(itemId, undefined).replace(item);
      res.status(200).json({ message: "Equipment updated successfully" });
    } catch (error) {
      console.error("Error updating equipment:", error);
      res.status(500).json({ error: "Error updating equipment" });
    }
  }

  async deleteEquipment(req, res) {
    try {
      const itemId = req.params.id;
      await this.container.item(itemId, undefined).delete();
      res.status(200).json({ message: "Equipment deleted successfully" });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      res.status(500).json({ error: "Error deleting equipment" });
    }
  }

  async getEquipmentById(req, res) {
    try {
      const itemId = req.params.id;

      const { resource } = await this.container.item(itemId, undefined).read();
      res.status(200).json(resource);
    } catch (error) {
      console.error("Error fetching equipment by id:", error);
      res.status(500).json({ error: "Error fetching equipment by id" });
    }
  }

  async getEquipmentsByParentId(req, res) {
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
      console.error("Error fetching equipments by parent id:", error);
      res.status(500).json({ error: "Error fetching equipments by parent id" });
    }
  }
}

module.exports = EquipmentController;
