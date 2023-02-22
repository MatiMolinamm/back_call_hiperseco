const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    description: {
        type: String,

    },
    point: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});


module.exports = model('Usuario', UsuarioSchema);

