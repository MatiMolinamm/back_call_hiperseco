const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const Usuario = require('../models/Usuario');
const Socket = require('../models/Socket');

const crearUsuario = async (req, res = response) => {

    const { point, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ point });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe'
            });
        }

        usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.point);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            point: usuario.point,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const loginUsuario = async (req, res = response) => {

    const { point, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ point });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese point'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        };

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.point);

        res.json({
            ok: true,
            uid: usuario.id,
            point: usuario.point,
            token
            //socketId
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const socketDb = async (req, res = response) => {
    // console.log('llego al controlador');
    // console.log(req.body)
    const { point, socketId } = req.body

    try {
        let idToCall = await Socket.findOne({ point });
        // console.log(idToCall)

        if (idToCall) {
            idToCall.socketId = socketId;

            await idToCall.save();
            res.json({
                ok: true,
                point,
                socketId
            })
            return
        }
        else {
            idToCall = new Socket({ point, socketId });

            await idToCall.save();

            res.json({
                ok: true,
                point,
                socketId
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const idToCall = async (req, res = response) => {

    const { point } = req.body
    try {
        let { socketId } = await Socket.findOne({ point });
        res.json({
            ok: true,
            socketId,
        })
    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'vendendor no esta en linea'
        });
    }
};

const revalidarToken = async (req, res = response) => {

    const { uid, point } = req.body;

    // Generar JWT
    const token = await generarJWT(uid, point);

    res.json({
        ok: true,
        uid, point,
        token
    })
}



module.exports = {
    crearUsuario,
    loginUsuario,
    socketDb,
    idToCall,
    revalidarToken

}