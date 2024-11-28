const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const AuthController = require("../controllers/authController");  // Importer AuthController
const cors = require("cors");

router.use(cors({ origin: "http://localhost:5173" }));

// Ruter som krever autentisering
router.get("/", (req, res) => UserController.getUsers(req, res));  // Krever autentisering
router.get("/:username", (req, res) => UserController.getUserByUsername(req, res));  // Krever autentisering
router.put("/:username", (req, res) => UserController.updateUser(req, res));  // Krever autentisering
router.delete("/:username", (req, res) => UserController.deleteUser(req, res));  // Krever autentisering
router.delete("/", (req, res) => UserController.deleteAllUsers(req, res));  // Krever autentisering

module.exports = router;
