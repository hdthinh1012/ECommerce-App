const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");

router.get("/all", CategoryController.findAll);

router.get("/:id", CategoryController.findById); /** :id can catch 'all' */

module.exports = router;