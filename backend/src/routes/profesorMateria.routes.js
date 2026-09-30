const express = require('express');
const router = express.Router();
const { obtenerMateriasDeProfesor, asignarMateriaAProfesor, eliminarMateriaDeProfesor } = require('../controllers/profesorMateria.controller');

// GET (ruta para obtener todas las materias de un profesor)
router.get('/profesores/:id/materias', obtenerMateriasDeProfesor);

// POST (ruta para asignar una materia a un profesor)
router.post('/profesores/:id/materias/:idMateria', asignarMateriaAProfesor);

// DELETE (ruta para eliminar una materia de un profesor)
router.delete('/profesores/:id/materias/:idMateria', eliminarMateriaDeProfesor);

module.exports = router;