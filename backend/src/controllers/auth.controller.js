const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Estudiante = require('../models/estudiantes');
const Profesor = require('../models/profesores');

const login = async (req, res) => {
    try {
        const { email, password, tipo } = req.body;

        let Usuario;

        if (tipo === 'estudiante') {
            Usuario = Estudiante;
        } else if (tipo === 'profesor') {
            Usuario = Profesor;
        } else {
            return res.status(400).json({
                mensaje: 'Tipo de usuario inválido'
            });
        }

        const usuario = await Usuario.findOne({
            where: { email }
        });

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        const passwordCorrecto = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecto) {
            return res.status(401).json({
                mensaje: 'Credenciales incorrectas'
            });
        }

        const id = tipo === 'estudiante'
            ? usuario.id_estudiante
            : usuario.id_profesor;

        const token = jwt.sign(
            {
                id,
                tipo
            },
            'secret',
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            mensaje: 'Login exitoso',
            token
        });

    } catch (error) {
        console.error('Error en login:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};

module.exports = {
    login
};