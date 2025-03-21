const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const SensorController = require("../../controllers/azure/sensorController");
const sensorController = new SensorController(
  db.cosmosClient,
  db.databaseId,
  "sensors"
);

router.post("/", (req, res, next) =>
  sensorController.createSensor(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  sensorController.updateSensor(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  sensorController.deleteSensor(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  sensorController.getSensorById(req, res).catch(next)
);
router.get("/", (req, res, next) =>
  sensorController.getSensorsByParentId(req, res).catch(next)
);

module.exports = router;
