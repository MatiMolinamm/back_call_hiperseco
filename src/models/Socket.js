const { Schema, model } = require('mongoose');

const SocketSchema = Schema({

    point: {
        type: String,
        required: true,
        unique: true

    },
    socketId: {
        type: String,
        required: true
    },

});


module.exports = model('Socket', SocketSchema);