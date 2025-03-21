const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const PhytosanitaryController = require("../controllers/phytosanitaryController");
const phytosanitaryController = new PhytosanitaryController(
  db.cosmosClient,
  db.databaseId,
  "phytosanitaries"
);

router.post("/", (req, res, next) =>
  phytosanitaryController.createPhytosanitary(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  phytosanitaryController.updatePhytosanitary(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  phytosanitaryController.deletePhytosanitary(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  phytosanitaryController.getPhytosanitaryById(req, res).catch(next)
);
router.get("/", (req, res, next) =>
  phytosanitaryController.getPhytosanitariesByParentId(req, res).catch(next)
);

module.exports = router;
