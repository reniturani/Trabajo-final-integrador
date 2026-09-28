const Profesor = require('../models/profesores.js');
const bcrypt = require('bcrypt');

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

// POST: crear un nuevo profesor
const crearProfesor = async (req, res) => {
    try {
        const { nombre, apellido, email, password, descripcion, precio_hora, modalidad, ubicacion, foto_url } = req.body;

        // validacion basica
        if (!nombre || !apellido || !email || !password || !descripcion || !precio_hora || !modalidad) {
            return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
        }

        // encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // guardar en la base de datos
        const nuevoProfesor = await Profesor.create({
            nombre, apellido, email, password: hashedPassword, descripcion, precio_hora, modalidad, ubicacion, foto_url
        });

        res.status(201).json({ 
            mensaje: 'Profesor creado con éxito', 
            profesor: { id_profesor: nuevoProfesor.id_profesor, nombre: nuevoProfesor.nombre, email: nuevoProfesor.email } 
        });
    } catch (error) {
        console.error('Error al crear profesor:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }
        res.status(500).json({ mensaje: 'Error interno al crear el profesor' });
    }
};

// PUT: actualizar un profesor existente
const actualizarProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, email, password, descripcion, precio_hora, modalidad, ubicacion, foto_url } = req.body;

        const profesor = await Profesor.findByPk(id);
        if (!profesor) {
            return res.status(404).json({ mensaje: 'Profesor no encontrado' });
        }

        // si envian una nueva contraseña, la encriptamos, y si no conservamos la actual
        let hashedPassword = profesor.password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // actualizamos los campos (si no mandan un dato nuevo, conservamos el que ya tenía en la BD)
        await profesor.update({
            nombre: nombre || profesor.nombre,
            apellido: apellido || profesor.apellido,
            email: email || profesor.email,
            password: hashedPassword,
            descripcion: descripcion || profesor.descripcion,
            precio_hora: precio_hora || profesor.precio_hora,
            modalidad: modalidad || profesor.modalidad,
            ubicacion: ubicacion || profesor.ubicacion,
            foto_url: foto_url || profesor.foto_url
        });

        res.status(200).json({ mensaje: 'Profesor actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar profesor:', error);
        res.status(500).json({ mensaje: 'Error interno al actualizar el profesor' });
    }
};

// DELETE: eliminar un profesor
const eliminarProfesor = async (req, res) => {
    try {
        const { id } = req.params;
        const profesor = await Profesor.findByPk(id);

        if (!profesor) {
            return res.status(404).json({ mensaje: 'Profesor no encontrado' });
        }

        await profesor.destroy();
        res.status(200).json({ mensaje: 'Profesor eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar profesor:', error);
        res.status(500).json({ mensaje: 'Error interno al eliminar el profesor' });
    }
};

// exportamos las funciones
module.exports = {
    obtenerProfesores,
    obtenerProfesorPorId,
    crearProfesor,
    actualizarProfesor,
    eliminarProfesor
};