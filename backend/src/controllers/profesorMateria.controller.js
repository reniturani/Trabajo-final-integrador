const ProfesorMateria = require('../models/profesor_materia.js');
const Profesor = require('../models/profesores.js');
const Materia = require('../models/materia.js');

// GET: obtener todas las materias de un profesor
const obtenerMateriasDeProfesor = async (req, res) => {
    try {
        const id_profesor = req.params.id;

        const profesor = await Profesor.findByPk(id_profesor, {
            include: [{ model : Materia }]
        });

        if (!profesor) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }
        res.json({ materias: profesor.Materia });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al obtener materias del profesor' });
    }
};

// POST: asignar materia a profesor
const asignarMateriaAProfesor = async (req, res) => {
    try {
        const id_profesor = req.params.id;
        const id_materia = req.params.idMateria;

        // verificar si el profesor existe
        const profesor = await Profesor.findByPk(id_profesor);
        if (!profesor) {
            return res.status(404).json({ error: 'Profesor no encontrado' });
        }

        // verificar si la materia existe
        const materia = await Materia.findByPk(id_materia);
        if (!materia) {
            return res.status(404).json({ error: 'Materia no encontrada' });
        }

        // verificar si la relación ya existe
        const relacionExistente = await ProfesorMateria.findOne({
            where: { id_profesor, id_materia }
        });
        if (relacionExistente) {
            return res.status(400).json({ error: 'El profesor ya está asignado a esta materia' });
        }

        const profesorMateria = await ProfesorMateria.create({ id_profesor, id_materia });
        res.status(201).json({ message: 'Materia asignada al profesor correctamente', profesorMateria });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al asignar materia al profesor' });

    }
};

// DELETE: eliminar materia de profesor
const eliminarMateriaDeProfesor = async (req, res) => {
    try {
        const id_profesor = req.params.id;
        const id_materia = req.params.idMateria;

        const profesorMateria = await ProfesorMateria.findOne({
            where: { id_profesor, id_materia }
        });

        if (!profesorMateria) {
            return res.status(404).json({ error: 'La relación profesor-materia no existe' });
        }

        await profesorMateria.destroy();
        res.json({ message: 'Materia eliminada del profesor correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno al eliminar materia del profesor' });
    }
};

// exportar las funciones del controlador
module.exports = {
    obtenerMateriasDeProfesor,
    asignarMateriaAProfesor,
    eliminarMateriaDeProfesor
};