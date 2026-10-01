const express = require('express');
const router = express.Router();

const { login, solicitarRecuperacion } = require('../controllers/auth.controller');

router.post('/login', login);

router.post('/solicitar-recuperacion', solicitarRecuperacion);

module.exports = router;