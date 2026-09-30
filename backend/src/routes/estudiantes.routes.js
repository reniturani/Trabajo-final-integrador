const express = require('express');
const router = express.Router();

const {
    obtenerEstudiantes,
    obtenerEstudiantePorId,
    crearEstudiante,
    actualizarEstudiante,
    eliminarEstudiante
} = require('../controllers/estudiantes.controller');

// GET: obtener todos los estudiantes
router.get('/', obtenerEstudiantes);

// GET : obtener un estudiante especifico por su ID
router.get('/:id', obtenerEstudiantePorId);

//POST : Crear un estudiante
router.post('/', crearEstudiante);

//PUT : Actualizar un estudiante existente
router.put('/:id', actualizarEstudiante);

//DELETE : Eliminar un estudiante
router.delete('/:id', eliminarEstudiante);

module.exports = router;