const express = require("express");
const router = express.Router();
const db = require("../config/db");
const UserController = require("../controllers/userController");
const userController = new UserController(
  db.cosmosClient,
  db.databaseId,
  "users"
);

router.post("/auth", (req, res, next) =>
  userController.auth(req, res).catch(next)
);
router.post("/login", (req, res, next) =>
  userController.login(req, res).catch(next)
);
router.post("/register", (req, res, next) =>
  userController.register(req, res).catch(next)
);
router.put("/:id", (req, res, next) =>
  userController.updateUser(req, res).catch(next)
);
router.delete("/:id", (req, res, next) =>
  userController.deleteUser(req, res).catch(next)
);
router.get("/:id", (req, res, next) =>
  userController.getUserById(req, res).catch(next)
);
router.get("/", (req, res, next) => {
  const { role } = req.query;
  switch (true) {
    case Boolean(role):
      userController.getUsersByRole(req, res).catch(next);
      break;
    default:
      userController.getUsers(res).catch(next);
  }
});

module.exports = router;
