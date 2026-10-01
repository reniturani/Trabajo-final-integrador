const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Estudiante = require('../models/estudiantes');
const Profesor = require('../models/profesores');
const RecuperacionPassword = require('../models/recuperacion_password');

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
const solicitarRecuperacion = async(req, res) => {
        try {
            console.log('1. Entro a recuperacion');
            const { email, tipo } = req.body;
            console.log('2. Datos recibidos');

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
            console.log('3. Modelo seleccionado');
            const usuario = await Usuario.findOne({
                where: { email }
            });
            
            console.log('4. Busqueda terminada');

            if (!usuario) {
                return res.status(404).json({
                    mensaje: 'Usuario no encontrado'
                });
            }

            await RecuperacionPassword.destroy({
                where: { email }
            });

            console.log('5. Usuario encontrado');
            //generar codigo de 6 digitos
            const codigo = Math.floor(Math.random() * 900000).toString();

            //fecha de vencimiento: 5 minutos
            const expiraEn = new Date(Date.now() + 5 * 60 * 1000);
            await RecuperacionPassword.create({
                email,
                codigo,
                fecha_expiracion: expiraEn
            });

            console.log('6. Codigo generado');

            res.status(200).json({
                mensaje: 'Recuperacion solicitada',
                codigo
            });
        } catch (error) {
            console.error('Error en recuperacion:', error);

            res.status(500).json({
                mensaje: 'Error interno del servidor'
            });
        }
};


module.exports = {
    login,
    solicitarRecuperacion
};