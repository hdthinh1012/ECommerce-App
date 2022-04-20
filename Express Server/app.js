const express = require("express");
var session = require('express-session');
const cors = require("cors");
const fs = require("fs");

require("dotenv").config();
const serverPort = process.env.PORT;

const app = express();
app.use(function (req, res, next) { setTimeout(next, 1000) });
app.use(express.json());
app.enable('trust proxy')

const cors_origin_list = [`https://localhost:3000`, 'https://immense-scrubland-27295.herokuapp.com'];
console.log("cors_origin_list", cors_origin_list);

// app.use(cors({
//     origin: function (origin, callback) {
//         console.log("Coming origin", origin);
//         console.log(cors_origin_list.indexOf(origin) !== -1 || !origin);
//         if (cors_origin_list.indexOf(origin) !== -1) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
//     credentials: true
// }));

app.use(cors({
    origin: `https://localhost:3000`,
    methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
    credentials: true
}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.get("origin"));
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('');
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
        sameSite: 'none',
    }
};
const sessionMiddleware = session(sess);

/********************************************************************************/

const certOptions = {
    key: fs.readFileSync("./certificates/server.key"),
    cert: fs.readFileSync("./certificates/server.crt"),
}

const expressHttpServer = require("http").createServer(app);
// const expressHttpsServer = require("https").createServer(certOptions, app);

/**
 * Local use https
 */
// const io = require("socket.io")(expressHttpsServer, {
//     cors: {
//         origin: `https://localhost:3000`,
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// })
// const io = require("socket.io")(expressHttpsServer, {
//     cors: {
//         origin: 'https://immense-scrubland-27295.herokuapp.com',
//         methods: ["GET", "POST"],
//         credentials: true
//     }
// })

/**
 * Remote use http
 */
const io = require("socket.io")(expressHttpServer, {
    cors: {
        origin: 'https://immense-scrubland-27295.herokuapp.com',
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

const mongoUri = 'mongodb+srv://hdthinh1012:thinh1012@ecommerce-app.ivqyx.mongodb.net/ECommerceAppDB?retryWrites=true&w=majority';
// const mongoUri = `mongodb://localhost:${mongoPort}/${mongoName}`;

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


// expressHttpsServer.listen(serverPort, () => {
//     console.log(`Https Server listening at https://localhost:${serverPort}`)
// });

