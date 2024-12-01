const express = require("express");
const router = express.Router();
const PollController = require("../controllers/pollController");
const cors = require("cors");

// CORS-støtte for http://localhost:5173
router.use(cors({ origin: "http://frontend:5173" })); // Frontend kjører her?

// Definer ruter og koble dem til kontrolleren
router.get("/", (req, res) => PollController.getPolls(req, res));
router.get("/:pollId", (req, res) => PollController.getPollById(req, res));
router.post("/", (req, res) => PollController.createPoll(req, res));
router.put("/:pollId", (req, res) => PollController.updatePoll(req, res));
router.post("/:voteOptionId", (req, res) =>
  PollController.updateVoteCount(req, res)
);
router.delete("/:pollId", (req, res) => PollController.deletePoll(req, res));
router.delete("/", (req, res) => PollController.deleteAllPolls(req, res));

module.exports = router;
