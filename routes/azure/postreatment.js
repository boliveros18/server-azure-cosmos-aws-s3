const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const PostreatmentController = require("../controllers/postreatmentController");
const postreatmentController = new PostreatmentController(
  db.cosmosClient,
  db.databaseId,
  "postreatments"
);

router.post("/", (req, res, next) =>
  postreatmentController.createPostreatment(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  postreatmentController.updatePostreatment(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  postreatmentController.deletePostreatment(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  postreatmentController.getPostreatmentById(req, res).catch(next)
);
router.get("/", (req, res, next) =>
  postreatmentController.getPostreatmentsByParentId(req, res).catch(next)
);

module.exports = router;
