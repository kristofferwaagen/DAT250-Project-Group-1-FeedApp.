const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const cors = require("cors");

router.use(cors({ origin: "http://frontend:5173" }));

router.get("/", (req, res) => UserController.getUsers(req, res));
router.get("/:username", (req, res) =>
  UserController.getUserByUsername(req, res)
);
router.put("/:username", (req, res) => UserController.updateUser(req, res));
router.delete("/:username", (req, res) => UserController.deleteUser(req, res));
router.delete("/", (req, res) => UserController.deleteAllUsers(req, res));

module.exports = router;
