const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const ParcelController = require("../controllers/parcelController");
const parcelController = new ParcelController(
  db.cosmosClient,
  db.databaseId,
  "parcels"
);

router.post("/", (req, res, next) =>
  parcelController.createParcel(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  parcelController.updateParcel(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  parcelController.deleteParcel(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  parcelController.getParcelById(req, res).catch(next)
);
router.get("/", (req, res, next) =>
  parcelController.getParcelsByParentId(req, res).catch(next)
);

module.exports = router;
