const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authenticateJWT = require("../middleware/authenticateJWT");
const authorizeRoles = require("../middleware/authorizeRoles"); 

const cors = require("cors");

// Routes
router.get("/", authenticateJWT, (req, res) => userController.getUsers(req, res));
router.get("/:username", authenticateJWT, (req, res) => userController.getUserByUsername(req, res));
router.put("/:username", authenticateJWT, (req, res) => userController.updateUser(req, res));

// Protect DELETE routes with both authentication and role-based authorization
router.delete(
    "/:username",
    authenticateJWT,
    authorizeRoles("admin"), // Require 'admin' role
    (req, res) => userController.deleteUser(req, res)
);
router.delete(
    "/",
    authenticateJWT,
    authorizeRoles("admin"), // Require 'admin' role
    (req, res) => userController.deleteAllUsers(req, res)
);

module.exports = router;