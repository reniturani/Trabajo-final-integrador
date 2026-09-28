const express = require('express');
const router = express.Router();

const {
    obtenerEstudiantes
} = require('../controllers/estudiantes.controller');

// GET: obtener todos los estudiantes
router.get('/', obtenerEstudiantes);

// GET : obtener un estudiante especifico por su ID
router.get('/:id', obtenerEstudiantePorId);

module.exports = router;