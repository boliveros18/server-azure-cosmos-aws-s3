class NotebookController {
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

  async createNotebook(req, res) {
    try {
      const item = req.body;
      await this.container.items.create(item);
      res.status(201).json({ message: "Notebook created successfully" });
    } catch (error) {
      console.error("Error creating notebook:", error);
      res.status(500).json({ error: "Error creating notebook" });
    }
  }

  async updateNotebook(req, res) {
    try {
      const itemId = req.params.id;
      const item = req.body;
      item.completed = true;
      await this.container.item(itemId, undefined).replace(item);
      res.status(200).json({ message: "Notebook updated successfully" });
    } catch (error) {
      console.error("Error updating notebook:", error);
      res.status(500).json({ error: "Error updating notebook" });
    }
  }

  async deleteNotebook(req, res) {
    try {
      const itemId = req.params.id;
      await this.container.item(itemId, undefined).delete();
      res.status(200).json({ message: "Notebook deleted successfully" });
    } catch (error) {
      console.error("Error deleting notebook:", error);
      res.status(500).json({ error: "Error deleting notebook" });
    }
  }

  async getNotebookById(req, res) {
    try {
      const itemId = req.params.id;

      const { resource } = await this.container.item(itemId, undefined).read();
      res.status(200).json(resource);
    } catch (error) {
      console.error("Error fetching notebook by id:", error);
      res.status(500).json({ error: "Error fetching notebook by id" });
    }
  }

  async getNotebooksByParentId(req, res) {
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
      console.error("Error fetching notebooks by parent id:", error);
      res.status(500).json({ error: "Error fetching notebooks by parent id" });
    }
  }

  async getNotebooksByClientId(req, res) {
    try {
      const { client_id } = req.query;
      const querySpec = {
        query: `SELECT * FROM root r WHERE r.client_id=@id`,
        parameters: [
          {
            name: "@id",
            value: client_id,
          },
        ],
      };
      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching notebooks by client id:", error);
      res.status(500).json({ error: "Error fetching notebooks by client id" });
    }
  }

  async getNotebooks(res) {
    try {
      const querySpec = {
        query: "SELECT * FROM root r",
      };
      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching notebooks by super role:", error);
      res.status(500).json({ error: "Error fetching notebooks by super role" });
    }
  }
}

module.exports = NotebookController;
