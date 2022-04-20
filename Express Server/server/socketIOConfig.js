const axios = require("axios");
const ChatBox = require("../databases/ChatBox");
const { getSession } = require("../controllers/SessionController");

module.exports = (io) => {
    /**
     * io.use() is Middleware, call everytime a socket.io connection is made
     */

    io.use((socket, next) => {
        const socketSessionID = socket.handshake.auth.uniqueSessionID;
        console.log("/******************* 'socketIOConfig.js io.use' ********************/");
        console.log("Socket connection data SessionID", socketSessionID);
        console.log("Socket request sessionID", socket.request.session.id);
        if (socket.request.session.loggedIn) {
            console.log("Session exist");
        }
        else {
            console.log("Session not existed");
        }
        next();
    })

    io.on("connection", async (socket) => {
        console.log("/******************* 'socketIOConfig.js io.on('connection')' ********************/");
        const socketIOsessionStore = {};
        for (const [key, value] of Object.entries(socket.request.sessionStore.sessions)) {
            console.log("value", value);
            socketIOsessionStore[JSON.parse(value).userInfo._id] = JSON.parse(value).userInfo;
        }

        let allSocketSession = [];
        for (let [id, socket] of io.of("/").sockets) {
            const socketObj = {
                socketId: id,
                userId: socket.handshake.auth.userId,
                userInfo: socketIOsessionStore[socket.handshake.auth.userId],
            };
            allSocketSession.push(socketObj);
        }

        console.log("SocketIO SessionStore", allSocketSession);

        /**
         * Get all ChatBox that the userId is contained
         */
        let allRelatedChatBox = await ChatBox.find({ idlist: socket.handshake.auth.userId });

        socket.emit("current online users", {
            allSocketSession,
            allRelatedChatBox
        });
        const currentSession = socket.request.session;
        socket.broadcast.emit('user connected', currentSession.userInfo);

        socket.on('private message', async ({ idlist, messageContent, fromId, toId }) => {
            let theChatBox = await ChatBox.findOne({ idlist: idlist });
            theChatBox.messages.push({
                fromId: fromId,
                toId: toId,
                messageContent
            });
            await theChatBox.save();

            /**
             * Search all online socket and broadcast event to those related
             */

            let allCurrentSocketSession = [];
            for (let [id, socket] of io.of("/").sockets) {
                const socketObj = {
                    socketId: id,
                    userId: socket.handshake.auth.userId,
                    userInfo: socketIOsessionStore[socket.handshake.auth.userId],
                };
                allCurrentSocketSession.push(socketObj);
            }

            allCurrentSocketSession.forEach(socketSession => {
                console.log(socketSession.userId, idlist.some(id => id === socketSession.userId));
                if (idlist.some(id => id === socketSession.userId)) {

                    /**
                     * This socket.to() Sets a modifier for a subsequent event emission that the event will 
                     * only be broadcasted to clients that have joined the given room (the socket itself being excluded).
                     */
                    socket.to(socketSession.socketId).emit('private message', {
                        idlist,
                        fromId: fromId,
                        toId: toId,
                        messageContent
                    })
                }
            })
            socket.emit('private message', {
                idlist,
                fromId: fromId,
                toId: toId,
                messageContent
            })
        });

        /**
         * Server socket emits 'disconnect' when connection lost, so cannot reach the equivalent client socket 
         */
        socket.on('disconnect', (reason) => {
            console.log('user disconnected', { reason, socketId: socket.id, userId: socket.handshake.auth.userId });
            socket.broadcast.emit('user disconnected', { reason, socketId: socket.id, userId: socket.handshake.auth.userId });
        });
    })
}