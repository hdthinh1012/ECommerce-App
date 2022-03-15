const express = require("express");
var session = require('express-session');
const cors = require("cors");

require("dotenv").config();
const serverPort = process.env.ServerPort;

const app = express();
app.use(function (req, res, next) { setTimeout(next, 1000) });
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

/********************************************************************************/
const sess = {
    resave: true,
    saveUninitialized: false,
    name: 'uniqueSessionID',
    secret: 'keyboard cat',
    cookie: {
        httpOnly: false,
        secure: app.get('env') === 'production',
    }
};
const sessionMiddleware = session(sess);

/********************************************************************************/
const expressHttpServer = require("http").createServer(app);
const io = require("socket.io")(expressHttpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
})

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
})
require("./server/socketIOConfig")(io);

app.use(sessionMiddleware);
app.use((req, res, next) => {
    req.io = io;
    next();
});

/********************************************************************************/
const mongoose = require("mongoose");
const mongoPort = process.env.MongoDBPort;
const mongoName = process.env.MongoDBName;

const mongoUri = `mongodb://localhost:${mongoPort}/${mongoName}`;
const mongoOptions = {};
mongoose.connect(mongoUri, mongoOptions, (err) => {
    if (err) {
        console.log('Mongo Connection Error:', err);
    }
})

/********************************************************************************/
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const sessionRouter = require("./routes/session");
app.use("/session", sessionRouter);

const funitureRouter = require("./routes/funiture");
app.use("/funiture", funitureRouter);

const categoryRouter = require("./routes/category");
app.use("/category", categoryRouter);

const orderRouter = require("./routes/order");
app.use("/order", orderRouter);

const chatRouter = require("./routes/chat");
app.use("/chat", chatRouter);

/********************************************************************************/

expressHttpServer.listen(serverPort, () => {
    console.log(`Http Server listening at http://localhost:${serverPort}`)
});
