const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const ContractorController = require("../controllers/contractorController");
const contractorController = new ContractorController(
  db.cosmosClient,
  db.databaseId,
  "contractors"
);

router.post("/", (req, res, next) =>
  contractorController.createContractor(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  contractorController.updateContractor(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  contractorController.deleteContractor(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  contractorController.getContractorById(req, res).catch(next)
);
router.get("/", (req, res, next) => {
  const { parent_id, work_field } = req.query;
  switch (true) {
    case Boolean(parent_id && !work_field):
      contractorController.getContractorsByParentId(req, res).catch(next);
      break;
    case Boolean(parent_id && work_field):
      contractorController
        .getContractorsByParentIdAndWorkfield(req, res)
        .catch(next);
      break;
  }
});

module.exports = router;
