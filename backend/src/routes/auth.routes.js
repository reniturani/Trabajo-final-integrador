const express = require('express');
const router = express.Router();

const { login, solicitarRecuperacion, verificarCodigo, cambiarPassword } = require('../controllers/auth.controller');

router.post('/login', login);

router.post('/solicitar-recuperacion', solicitarRecuperacion);

router.post('/verificar-codigo', verificarCodigo);

router.post('/cambiar-password', cambiarPassword);

module.exports = router;