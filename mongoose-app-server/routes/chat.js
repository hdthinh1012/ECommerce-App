const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");

router.get("/", ChatController.chatSocket);

module.exports = router;