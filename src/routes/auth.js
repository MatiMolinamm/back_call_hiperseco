/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { crearUsuario, loginUsuario, socketDb, idToCall } = require('../controllers/auth');
//const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();



router.post(
    '/new',
    [ // middlewares
        check('point', 'point obligatorio').not().isEmpty(),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario
);

router.post(
    '/',
    [
        check('point', 'El point es obligatorio'),
        check('password', 'El password debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario
);

router.post('/socketDb', socketDb);
router.post('/idToCall', idToCall);


//router.get('/renew', validarJWT, revalidarToken);




module.exports = router;