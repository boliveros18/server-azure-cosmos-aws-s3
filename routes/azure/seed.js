const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const SeedController = require("../controllers/seedController");
const seedController = new SeedController(
  db.cosmosClient,
  db.databaseId,
  "seeds"
);

router.post("/", (req, res, next) =>
  seedController.createSeed(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  seedController.updateSeed(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  seedController.deleteSeed(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  seedController.getSeedById(req, res).catch(next)
);
router.get("/", (req, res, next) =>
  seedController.getSeedsByParentId(req, res).catch(next)
);

module.exports = router;
