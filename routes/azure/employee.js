const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const EmployeeController = require("../controllers/employeeController");
const employeeController = new EmployeeController(
  db.cosmosClient,
  db.databaseId,
  "employees"
);

router.post("/", (req, res, next) =>
  employeeController.createEmployee(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  employeeController.updateEmployee(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  employeeController.deleteEmployee(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  employeeController.getEmployeeById(req, res).catch(next)
);
router.get("/", (req, res, next) =>
  employeeController.getEmployeesByParentId(req, res).catch(next)
);

module.exports = router;
