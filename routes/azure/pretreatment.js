const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const PretreatmentController = require("../controllers/pretreatmentController");
const pretreatmentController = new PretreatmentController(
  db.cosmosClient,
  db.databaseId,
  "pretreatments"
);

router.post("/", (req, res, next) =>
  pretreatmentController.createPretreatment(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  pretreatmentController.updatePretreatment(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  pretreatmentController.deletePretreatment(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  pretreatmentController.getPretreatmentById(req, res).catch(next)
);
router.get("/", (req, res, next) =>
  pretreatmentController.getPretreatmentsByParentId(req, res).catch(next)
);

module.exports = router;