const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const FlightController = require("../controllers/flightController");
const flightController = new FlightController(
  db.cosmosClient,
  db.databaseId,
  "flights"
);

router.post("/", (req, res, next) =>
  flightController.createFlight(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  flightController.updateFlight(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  flightController.deleteFlight(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  flightController.getFlightById(req, res).catch(next)
);
router.get("/", (req, res, next) =>
  flightController.getFlightsByParentId(req, res).catch(next)
);

module.exports = router;
