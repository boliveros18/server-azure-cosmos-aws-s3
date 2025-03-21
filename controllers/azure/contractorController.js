class ContractorController {
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

  async createContractor(req, res) {
    try {
      const item = req.body;
      await this.container.items.create(item);
      res.status(201).json({ message: "Contractor created successfully" });
    } catch (error) {
      console.error("Error creating contractor:", error);
      res.status(500).json({ error: "Error creating contractor" });
    }
  }

  async updateContractor(req, res) {
    try {
      const itemId = req.params.id;
      const item = req.body;
      item.completed = true;
      await this.container.item(itemId, undefined).replace(item);
      res.status(200).json({ message: "Contractor updated successfully" });
    } catch (error) {
      console.error("Error updating contractor:", error);
      res.status(500).json({ error: "Error updating contractor" });
    }
  }

  async deleteContractor(req, res) {
    try {
      const itemId = req.params.id;

      await this.container.item(itemId, undefined).delete();
      res.status(200).json({ message: "Contractor deleted successfully" });
    } catch (error) {
      console.error("Error deleting contractor:", error);
      res.status(500).json({ error: "Error deleting contractor" });
    }
  }

  async getContractorById(req, res) {
    try {
      const itemId = req.params.id;

      const { resource } = await this.container.item(itemId, undefined).read();
      res.status(200).json(resource);
    } catch (error) {
      console.error("Error fetching contractor by id:", error);
      res.status(500).json({ error: "Error fetching contractor by id" });
    }
  }

  async getContractorsByParentId(req, res) {
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
      console.error("Error fetching contractors by parent id:", error);
      res
        .status(500)
        .json({ error: "Error fetching contractors by parent id" });
    }
  }

  async getContractorsByParentIdAndWorkfield(req, res) {
    try {
      const { parent_id, work_field } = req.query;
      const querySpec = {
        query: `SELECT * FROM root r WHERE r.parent_id=@id AND r.work_field=@workfield`,
        parameters: [
          {
            name: "@id",
            value: parent_id,
          },
          {
            name: "@workfield",
            value: work_field,
          },
        ],
      };
      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching contractors by parent id:", error);
      res
        .status(500)
        .json({ error: "Error fetching contractors by parent id" });
    }
  }
}

module.exports = ContractorController;
