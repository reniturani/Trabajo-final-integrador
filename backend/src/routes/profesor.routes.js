const express = require('express');
const router = express.Router();
const { 
    obtenerProfesores, obtenerProfesorPorId, crearProfesor, actualizarProfesor, eliminarProfesor
} = require('../controllers/profesores.controller');

// GET (ruta para ver todos)
router.get('/', obtenerProfesores);
// GET (ruta para ver uno solo)
router.get('/:id', obtenerProfesorPorId);
// POST 
router.post('/', crearProfesor);
// PUT 
router.put('/:id', actualizarProfesor);
// DELETE
router.delete('/:id', eliminarProfesor);

module.exports = router;