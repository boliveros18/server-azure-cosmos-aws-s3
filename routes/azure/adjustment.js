const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const AdjustmentController = require("../controllers/adjustmentController");
const adjustmentController = new AdjustmentController(
  db.cosmosClient,
  db.databaseId,
  "adjustments"
);

router.post("/", (req, res, next) =>
  adjustmentController.createAdjustment(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  adjustmentController.updateAdjustment(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  adjustmentController.deleteAdjustment(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  adjustmentController.getAdjustmentById(req, res).catch(next)
);
router.get("/", (req, res, next) =>
  adjustmentController.getAdjustmentsByParentId(req, res).catch(next)
);

module.exports = router;
