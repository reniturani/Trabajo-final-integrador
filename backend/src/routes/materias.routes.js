const express = require('express');
const router = express.Router();
const { obtenerMaterias, obtenerMateriaPorId, crearMateria, actualizarMateria, eliminarMateria } = require('../controllers/materias.controller');

// importamos el middleware de autenticacion
const { verificarToken } = require('../middlewares/auth.middleware');

// GET (ruta para obtener todas las materias) - publica
router.get('/', obtenerMaterias);

// GET (ruta para obtener una materia por su ID) - publica
router.get('/:id', obtenerMateriaPorId);

// POST (ruta para crear una nueva materia) - protegida
router.post('/', verificarToken, crearMateria);

// PUT (ruta para actualizar una materia existente) - protegida
router.put('/:id', verificarToken, actualizarMateria);

// DELETE (ruta para eliminar una materia) - protegida
router.delete('/:id', verificarToken, eliminarMateria);

module.exports = router;