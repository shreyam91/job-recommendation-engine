const express = require("express");
const candidateController = require("../controllers/candidateController");

const router = express.Router();

router.post("/", candidateController.createCandidate);

module.exports = router;