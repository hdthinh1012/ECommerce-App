const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageItemSchema = new Schema({
    fromId: String,
    toId: String,
    messageContent: String,
});

const ChatBoxSchema = new Schema({
    idlist: [String],
    messages: [MessageItemSchema],
});

const ChatBox = mongoose.model('ChatBox', ChatBoxSchema);

module.exports = ChatBox;