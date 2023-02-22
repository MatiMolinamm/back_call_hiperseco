const { Schema, model } = require('mongoose');

const IdcallSchema = Schema({

    point: {
        type: String,
        required: true,
        unique: true
    },
    socketId: {
        type: String,
        required: true
    }
});


module.exports = model('IdCall', IdcallSchema);