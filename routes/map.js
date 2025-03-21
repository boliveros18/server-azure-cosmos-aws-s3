const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const MapController = require("../controllers/mapController");
const mapController = new MapController();

router.post("/parcel", async (req, res, next) => {
  mapController.getMapsByParcelId(req, res).catch(next);
});

router.get("/map", async (req, res, next) => {
  mapController.getMap(req, res).catch(next);
});

router.post("/coordinates", async (req, res, next) => {
  mapController.getCoordinates(req, res).catch(next);
});

router.get("/color", async (req, res, next) => {
  mapController.getBarColorMaps(req, res).catch(next);
});

router.post("/bucket", async (req, res, next) => {
  mapController.createBucket(req, res).catch(next);
});

router.post("/upload", upload.array("files"), async (req, res, next) => {
  mapController.uploadMaps(req, res).catch(next);
});

module.exports = router;
