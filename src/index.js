const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();

// Base de datos
dbConnection();

// Lectura y parseo del body
app.use(express.json());

// Middleware CORS
app.use(cors())

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log('user conectado');
    console.log(socket.id);

    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded")
    });

    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });

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


