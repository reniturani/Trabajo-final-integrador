const Profesor = require('backend\src\models\profesores.js'); 

// GET: obtener todos los profesores
const obtenerProfesores = async (req, res) => {
    try {
        const profesores = await Profesor.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(profesores);
    } catch (error) {
        console.error('Error al obtener profesores:', error);
        res.status(500).json({ mensaje: 'Error interno al cargar la lista' });
    }
};

// GET: obtener un profesor especifico por su ID
const obtenerProfesorPorId = async (req, res) => {
    try {
        const { id } = req.params; 
        
        const profesor = await Profesor.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        // si mandan un ID que no existe, devolvemos un error 404 not found
        if (!profesor) {
            return res.status(404).json({ mensaje: 'Profesor no encontrado' });
        }

        res.status(200).json(profesor);
    } catch (error) {
        console.error('Error al obtener el profesor:', error);
        res.status(500).json({ mensaje: 'Error interno al buscar el profesor' });
    }
};

// exportamos las funciones
module.exports = {
    obtenerProfesores,
    obtenerProfesorPorId
};