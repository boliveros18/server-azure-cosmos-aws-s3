class EmployeeController {
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

  async createEmployee(req, res) {
    try {
      const item = req.body;
      await this.container.items.create(item);
      res.status(201).json({ message: "Employee created successfully" });
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ error: "Error creating employee" });
    }
  }

  async updateEmployee(req, res) {
    try {
      const itemId = req.params.id;
      const item = req.body;
      item.completed = true;
      await this.container.item(itemId, undefined).replace(item);
      res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ error: "Error updating employee" });
    }
  }

  async deleteEmployee(req, res) {
    try {
      const itemId = req.params.id;
      await this.container.item(itemId, undefined).delete();
      res.status(200).json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ error: "Error deleting employee" });
    }
  }

  async getEmployeeById(req, res) {
    try {
      const itemId = req.params.id;

      const { resource } = await this.container.item(itemId, undefined).read();
      res.status(200).json(resource);
    } catch (error) {
      console.error("Error fetching employee by id:", error);
      res.status(500).json({ error: "Error fetching employee by id" });
    }
  }

  async getEmployeesByParentId(req, res) {
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
      console.error("Error fetching employees by parent id:", error);
      res.status(500).json({ error: "Error fetching employees by parent id" });
    }
  }
}

module.exports = EmployeeController;
