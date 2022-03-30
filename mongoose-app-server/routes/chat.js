const express = require("express");
const router = express.Router();
const ChatController = require("../controllers/ChatController");

router.get("/", ChatController.chatSocket);

router.post("/chatbox/get", ChatController.getChatBox);

module.exports = router;