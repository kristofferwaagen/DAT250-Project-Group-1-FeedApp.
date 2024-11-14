// routers/pollRouter.js
const express = require("express");
const router = express.Router();
const VoteController = require("../controllers/voteController");
const cors = require("cors");

// CORS-støtte for http://localhost:5173
router.use(cors({ origin: "http://localhost:5173" })); // Frontend kjører her?

// Definer ruter og koble dem til VoteController
router.get("/:username", (req, res) => VoteController.getUserVotes(req, res));
router.get("/:username/:voteId", (req, res) =>
  VoteController.getVoteById(req, res)
);
router.post("/:username", (req, res) => VoteController.createVote(req, res));
router.put("/:username/:voteId", (req, res) =>
  VoteController.updateVote(req, res)
);
router.delete("/:username", (req, res) =>
  VoteController.deleteAllVotes(req, res)
);
router.delete("/:username/:voteId", (req, res) =>
  VoteController.deleteVote(req, res)
);

module.exports = router;
