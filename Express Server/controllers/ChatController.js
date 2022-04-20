const io = require("../app");
const ChatBox = require('../databases/ChatBox');

const chatSocket = (req, res) => {
    const io = req.io;
    io.use((socket, next) => {
        const socketSessionID = socket.handshake.auth.uniqueSessionID;
        console.log("*******************************/chat***********************************");
        console.log("Socket connection data SessionID", socketSessionID);
        console.log(`ChatController's Express Autosave SessionID: ${req.session.id}`);
        console.log("ChatController's Express Autosave Current Sessions Store State", JSON.stringify(req.sessionStore.sessions));
        next();
    })
    res.status(200).send(JSON.stringify({ message: "Return from http://localhost:4000/chat" }));
}

const getChatBox = async (req, res) => {
    try {
        let { idlist } = req.body;
        idlist = idlist.sort();
        let theChatBox = await ChatBox.findOne({ idlist: idlist });
        if (!theChatBox) {
            theChatBox = await createChatBox(idlist);
        }
        res.status(200).send(JSON.stringify(theChatBox));
    } catch (err) {
        console.log(err.message);
    }
}

const createChatBox = async (idlist) => {
    const newChatBox = new ChatBox({
        idlist,
        messages: [],
    })
    newChatBox.save((err) => {
        console.log("create ChatBox error", err);
    })
    return newChatBox;
}

module.exports = {
    chatSocket, getChatBox, createChatBox
};