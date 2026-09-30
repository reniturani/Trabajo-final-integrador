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

// POST: crear un estudiante
const crearEstudiante = async (req, res) => {
    try {
        const {
            nombre,
            apellido,
            email,
            password,
            foto_url
        } = req.body;

        // Validación básica
        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json({
                mensaje: 'Faltan campos obligatorios'
            });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardar en la base de datos
        const nuevoEstudiante = await Estudiante.create({
            nombre,
            apellido,
            email,
            password: hashedPassword,
            foto_url
        });

        res.status(201).json({
            mensaje: 'Estudiante creado con éxito',
            estudiante: {
                id_estudiante: nuevoEstudiante.id_estudiante,
                nombre: nuevoEstudiante.nombre,
                email: nuevoEstudiante.email
            }
        });

    } catch (error) {
        console.error('Error al crear estudiante:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                mensaje: 'El email ya está registrado'
            });
        }

        res.status(500).json({
            mensaje: 'Error interno al crear el estudiante'
        });
    }
};

// PUT : Actualizamos un estudiante
const actualizarEstudiante = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, email, password,
        foto_url 
        } = req.body;

        const estudiante = await Estudiante.findByPk(id);
        if (!estudiante) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }

        // si envian una nueva contraseña, la encriptamos, y si no conservamos la actual        
        let hashedPassword = estudiante.password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // actualizamos los campos (si no mandan un dato nuevo, conservamos el que ya tinha en la BD)
        await estudiante.update({
            nombre: nombre || estudiante.nombre,
            apellido: apellido || estudiante.apellido,
            email: email || estudiante.email,
            password: hashedPassword,
            foto_url: foto_url || estudiante.foto_url
        });

        res.status(200).json({
            mensaje: 'Estudiante actualizado con exito',
            estudiante: { id_estudiante: estudiante.id_estudiante, nombre: estudiante.nombre, email: estudiante.email }
        });
    } catch (error) {
        console.error('Error al actualizar estudiante:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ mensaje: 'El email ya esta registrado' });
        }
        res.status(500).json({ mensaje: 'Error interno al actualizar el estudiante' });
    }
}

// DELETE : Eliminamos un estudiante
const eliminarEstudiante = async (req, res) => {
    try {
        const { id } = req.params;
        const estudiante = await Estudiante.findByPk(id);   

        if (!estudiante) {
            return res.status(404).json({ mensaje: 'Estudiante no encontrado' });
        }

        await estudiante.destroy();
        res.status(200).json({ mensaje: 'Estudiante eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar estudiante:', error);
        res.status(500).json({ mensaje: 'Error interno al eliminar el estudiante' });
    }
}   

module.exports = {
    obtenerEstudiantes,
    obtenerEstudiantePorId,
    crearEstudiante,
    actualizarEstudiante,
    eliminarEstudiante
};

