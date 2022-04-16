const express = require("express");
const router = express.Router();
const SessionController = require("../controllers/SessionController");

router.get("/", SessionController.getSession);

module.exports = router;