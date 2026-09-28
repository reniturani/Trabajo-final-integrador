const Estudiante = require('../models/estudiantes.js');
const bcrypt = require('bcrypt');


// GET: obtener todos los estudiantes
const obtenerEstudiantes = async (req, res) => {
    try {
        const estudiantes = await Estudiante.findAll({
            attributes: { exclude: ['password'] }
        });

        res.status(200).json(estudiantes);
    } catch (error) {
        console.error('Error al obtener estudiantes:', error);
        res.status(500).json({
            mensaje: 'Error interno al cargar la lista'
        });
    }
};

//GET: obtener un estudiante especifico por su ID
const obtenerEstudiantePorId = async (req, res) => {
    try {
        const { id } = req.params;

        const estudiante = await Estudiante.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        // si mandan un ID que no existe, devolvemos un error 404 not found
        if (!estudiante) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }

        res.status(200).json(estudiante);
    } catch (error) {
        console.error('Error al obtener el estudiante:', error);
        res.status(500).json({ mensaje: 'Error interno al buscar el estudiante' });
    }
}



















module.exports = {
    obtenerEstudiantes,
    obtenerEstudiantePorId
};

