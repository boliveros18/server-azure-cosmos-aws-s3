const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const EquipmentController = require("../controllers/equipmentController");
const equipmentController = new EquipmentController(
  db.cosmosClient,
  db.databaseId,
  "equipments"
);

router.post("/", (req, res, next) =>
  equipmentController.createEquipment(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  equipmentController.updateEquipment(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  equipmentController.deleteEquipment(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  equipmentController.getEquipmentById(req, res).catch(next)
);
router.get("/", (req, res, next) =>
  equipmentController.getEquipmentsByParentId(req, res).catch(next)
);

module.exports = router;
