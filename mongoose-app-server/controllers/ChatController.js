const io = require("../app");

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

module.exports = {
    chatSocket
};