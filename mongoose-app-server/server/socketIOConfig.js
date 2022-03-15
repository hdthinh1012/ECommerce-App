const axios = require("axios");
const { getSession } = require("../controllers/SessionController");

module.exports = (io) => {
    /**
     * io.use() is Middleware, call everytime a socket.io connection is made
     */

    io.use((socket, next) => {
        const socketSessionID = socket.handshake.auth.uniqueSessionID;
        console.log("/******************* 'socketIOConfig.js' ********************/");
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

    io.on("connection", (socket) => {
        const socketIOsessionStore = {};

        for (const [key, value] of Object.entries(socket.request.sessionStore.sessions)) {
            socketIOsessionStore[key] = JSON.parse(value);
        }
        console.log("Socket on 'connection' event's SessionStore", socketIOsessionStore);

        /**
         * This event may be emitted when the client has not yet register socket.on("current online users") event handler yet
         */
        socket.emit("current online users", socketIOsessionStore);

        const currentSession = socket.request.session;
        socket.broadcast.emit('user connected', currentSession.userInfo);

        /**
         * server socket emits 'disconnect' when connection lost, so cannot reach the equivalent client socket 
         */
        socket.on('disconnect', (reason) => {
            console.log('user disconnected', { reason, socketId: socket.id, userId: socket.handshake.auth.userId });
            socket.broadcast.emit('user disconnected', { reason, socketId: socket.id, userId: socket.handshake.auth.userId });
        });
    })
}