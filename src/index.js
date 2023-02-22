const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const { dbConnection } = require('./database/config')
require('dotenv').config();

// Base de datos
dbConnection();

// Lectura y parseo del body
app.use(express.json());

// Middleware CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    next();
});

const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {

    console.log('user conectado')
    console.log(socket.id)

    socket.emit("me", socket.id)

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    })

    socket.on("callUser", (data) => {
        // console.log(data)
        io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
    })

    socket.on("answerCall", (data) => {
        io.to(data.to).emit("callAccepted", data.signal)
    })
});


// Rutas
app.use('/api/auth', require('./routes/auth'));
app.get('/', (req, res) => {
    res.send('<h1>Server is running on port 5000</h1>');
});

server.listen(process.env.PORT || 8000, () => console.log(`server on ${process.env.PORT}`));


