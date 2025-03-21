const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const NotebookController = require("../controllers/notebookController");
const notebookController = new NotebookController(
  db.cosmosClient,
  db.databaseId,
  "notebooks"
);

router.post("/", (req, res, next) =>
  notebookController.createNotebook(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  notebookController.updateNotebook(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  notebookController.deleteNotebook(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  notebookController.getNotebookById(req, res).catch(next)
);
router.get("/", (req, res, next) => {
  const { parent_id, client_id } = req.query;
  switch (true) {
    case Boolean(parent_id):
      notebookController.getNotebooksByParentId(req, res).catch(next);
      break;
    case Boolean(client_id):
      notebookController.getNotebooksByClientId(req, res).catch(next);
      break;
    default:
      notebookController.getNotebooks(res).catch(next);
  }
});

module.exports = router;
