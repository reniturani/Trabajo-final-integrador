const express = require('express');
const router = express.Router();
const { obtenerMateriasDeProfesor, asignarMateriaAProfesor, eliminarMateriaDeProfesor } = require('../controllers/profesorMateria.controller');

// importamos el middleware de autenticacion
const { verificarToken } = require('../middlewares/auth.middleware');

// GET (ruta para obtener todas las materias de un profesor) - publica
router.get('/profesores/:id/materias', obtenerMateriasDeProfesor);

// POST (ruta para asignar una materia a un profesor) - protegida
router.post('/profesores/:id/materias/:idMateria', verificarToken, asignarMateriaAProfesor);

// DELETE (ruta para eliminar una materia de un profesor) - protegida
router.delete('/profesores/:id/materias/:idMateria', verificarToken, eliminarMateriaDeProfesor);

module.exports = router;