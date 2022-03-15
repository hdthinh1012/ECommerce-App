const express = require("express");
const router = express.Router();
const FunitureController = require("../controllers/FunitureController");

router.post("/init", FunitureController.init);

router.get("/all", FunitureController.findAll);

module.exports = router;