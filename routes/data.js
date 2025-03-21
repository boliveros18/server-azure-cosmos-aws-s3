const express = require("express");
const router = express.Router();
const DataController = require("../controllers/dataController");
const dataController = new DataController();

router.get("/data", async (req, res, next) => {
    dataController.getSensorData(req, res).catch(next);
});

module.exports = router;
