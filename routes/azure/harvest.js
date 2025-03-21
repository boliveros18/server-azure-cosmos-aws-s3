const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const HarvestController = require("../controllers/harvestController");
const harvestController = new HarvestController(
  db.cosmosClient,
  db.databaseId,
  "harvests"
);

router.post("/", (req, res, next) =>
  harvestController.createHarvest(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  harvestController.updateHarvest(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  harvestController.deleteHarvest(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  harvestController.getHarvestById(req, res).catch(next)
);
router.get("/", (req, res, next) =>
  harvestController.getHarvestsByParentId(req, res).catch(next)
);

module.exports = router;
