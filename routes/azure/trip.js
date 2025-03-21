const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const TripController = require("../controllers/tripController"); 
const tripController = new TripController(
  db.cosmosClient,
  db.databaseId,
  "trips" 
);

router.post("/", (req, res, next) =>
  tripController.createTrip(req, res).catch(next)
);

router.put("/:id", (req, res, next) =>
  tripController.updateTrip(req, res).catch(next)
);

router.delete("/:id", (req, res, next) =>
  tripController.deleteTrip(req, res).catch(next)
);

router.get("/:id", (req, res, next) =>
  tripController.getTripById(req, res).catch(next)
);

router.get("/", (req, res, next) =>
  tripController.getTripsByParentId(req, res).catch(next)
);

module.exports = router;
