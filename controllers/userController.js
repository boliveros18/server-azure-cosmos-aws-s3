const bcrypt = require("bcrypt");
require("dotenv").config({ path: "config.env" });

class UserController {
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

  async auth(req, res) {
    try {
      const { email, password } = req.body;
      const querySpec = {
        query: `SELECT * FROM root r WHERE r.email=@email`,
        parameters: [
          {
            name: "@email",
            value: email,
          },
        ],
      };
      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();
      if (!resources[0]) return res.send({});
      if (!bcrypt.compareSync(password, resources[0].password))
        return res.send({});
      const { id, name, lastname, role } = resources[0];
      return res.send({
        id,
        name,
        lastname,
        email,
        role,
      });
    } catch (error) {
      console.error("Error authenticating user:", error);
      return res.status(500).send({ error: "Internal Server Error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const querySpec = {
        query: `SELECT * FROM root r WHERE r.email=@email`,
        parameters: [
          {
            name: "@email",
            value: email,
          },
        ],
      };
      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();

      if (!resources[0]) {
        return res.status(400).json({ message: "Correo invalido" });
      }
      if (!bcrypt.compareSync(password, resources[0].password)) {
        return res.status(400).json({ message: "Contraseña invalida" });
      }

      res.status(201).json({
        message: "Login successful",
      });
    } catch (error) {
      console.error("Error login user:", error);
      res.status(500).json({ error: "Error login user" });
    }
  }

  async register(req, res) {
    try {
      const item = req.body;
      const { email, password } = req.body;
      const querySpec = {
        query: `SELECT * FROM root r WHERE r.email=@email`,
        parameters: [
          {
            name: "@email",
            value: email,
          },
        ],
      };
      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();
      if (resources[0]) {
        return res.status(400).json({
          message: "Este correo esta en uso",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      await this.container.items.create({
        ...item,
        password: hash,
      });
      res.status(201).json({
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Error registering user" });
    }
  }

  async updateUser(req, res) {
    try {
      const itemId = req.params.id;
      const item = req.body;
      item.completed = true;
      item.password = bcrypt.hashSync(item.password, 10);
      await this.container.item(itemId, undefined).replace(item);
      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Error updating user" });
    }
  }

  async deleteUser(req, res) {
    try {
      const itemId = req.params.id;
      await this.container.item(itemId, undefined).delete();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Error deleting user" });
    }
  }

  async getUserById(req, res) {
    try {
      const itemId = req.params.id;
      const { resource } = await this.container.item(itemId, undefined).read();
      res.status(200).json(resource);
    } catch (error) {
      console.error("Error fetching user by id:", error);
      res.status(500).json({ error: "Error fetching user by id" });
    }
  }

  async getUsersByRole(req, res) {
    try {
      const { role } = req.query;
      const querySpec = {
        query: `SELECT * FROM root r WHERE r.role=@role`,
        parameters: [
          {
            name: "@role",
            value: role,
          },
        ],
      };
      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching users by role:", error);
      res.status(500).json({ error: "Error fetching users by role" });
    }
  }

  async getUsers(res) {
    try {
      const querySpec = {
        query: `SELECT * FROM root r WHERE r.role!='super'`,
      };
      const { resources } = await this.container.items
        .query(querySpec)
        .fetchAll();
      res.status(200).json(resources);
    } catch (error) {
      console.error("Error fetching all users by role:", error);
      res.status(500).json({ error: "Error fetching all users by role" });
    }
  }
}

module.exports = UserController;
