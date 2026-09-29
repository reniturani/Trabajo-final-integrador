const express = require('express');
const router = express.Router();
const { obtenerMaterias, obtenerMateriaPorId, crearMateria, actualizarMateria, eliminarMateria } = require('../controllers/materias.controller');

// GET (ruta para obtener todas las materias)
router.get('/', obtenerMaterias);

// GET (ruta para obtener una materia por su ID)
router.get('/:id', obtenerMateriaPorId);

// POST (ruta para crear una nueva materia)
router.post('/', crearMateria);

// PUT (ruta para actualizar una materia existente)
router.put('/:id', actualizarMateria);

// DELETE (ruta para eliminar una materia)
router.delete('/:id', eliminarMateria);

module.exports = router;