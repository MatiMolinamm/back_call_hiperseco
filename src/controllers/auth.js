const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const IdCall = require('../models/IdCall');
//const { generarJWT } = require('../helpers/jwt');


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
        //const token = await generarJWT(usuario.id, usuario.point);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            point: usuario.point,
            // token
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

    const { point, password, socketId } = req.body;

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
        }

        // Generar JWT
        //const token = await generarJWT(usuario.id, usuario.point);
        // 

        let idToCall = await IdCall.findOne({ point });

        if (idToCall) {
            idToCall.socketId = socketId;

            await idToCall.save();
            res.json({
                ok: true,
                uid: usuario.id,
                point: usuario.point,
                //token,
                socketId
            })
            return
        }

        idToCall = new IdCall(req.body);
        await idToCall.save();

        res.json({
            ok: true,
            uid: usuario.id,
            point: usuario.point,
            // token,
            socketId
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};


// const revalidarToken = async (req, res = response) => {
//     const { uid, point } = req;
//     console.log(req)
//     console.log('revalidarToken arriba')
//     // Generar JWT
//     const token = await generarJWT(uid, point);
//     res.json({
//         ok: true,
//         uid, name,
//         token
//     })
// }




module.exports = {
    crearUsuario,
    loginUsuario,
    //revalidarToken
}