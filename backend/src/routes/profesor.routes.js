const express = require('express');
const router = express.Router();
const { obtenerProfesores, obtenerProfesorPorId } = require('../controllers/profesores.controller');

// ruta para ver todos 
router.get('/', obtenerProfesores);

// ruta para ver uno solo 
router.get('/:id', obtenerProfesorPorId);

module.exports = router;