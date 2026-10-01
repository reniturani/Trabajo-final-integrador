const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const Estudiante = require('../models/estudiantes');
const Profesor = require('../models/profesores');
const RecuperacionPassword = require('../models/recuperacion_password');

console.log('SMTP HOST:', process.env.BREVO_SMTP_HOST);
console.log('SMTP PORT:', process.env.BREVO_SMTP_PORT);
console.log('SMTP USER:', process.env.BREVO_SMTP_USER);
console.log('SMTP PASSWORD CARGADA:', !!process.env.BREVO_SMTP_PASSWORD);

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD
    }
});

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
            const { email, tipo } = req.body;

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

            await RecuperacionPassword.destroy({
                where: { email }
            });

            //generar codigo de 6 digitos
            const codigo = Math.floor(100000 + Math.random() * 900000).toString();

            //fecha de vencimiento: 5 minutos
            const expiraEn = new Date(Date.now() + 5 * 60 * 1000);
            await RecuperacionPassword.create({
                email,
                codigo,
                fecha_expiracion: expiraEn
            });


            await transporter.sendMail({
                from: 'trabajofinal.tesis26@gmail.com',
                to: email,
                subject: 'Recuperacion de contraseña',
                text: `Su codigo de recuperacion es: ${codigo}. Este codigo expira en 5 minutos` 
            });
            res.status(200).json({
                mensaje: 'Recuperacion solicitada'
            });
        } catch (error) {
            console.error('Error en recuperacion:', error);

            res.status(500).json({
                mensaje: 'Error interno del servidor'
            });
        }
};
const verificarCodigo = async(req,res) => {
    try {
        const { email, codigo } = req.body;

        const recuperacion = await RecuperacionPassword.findOne({
            where: { email,codigo }
        });

    if (!recuperacion) {
        return res.status(404).json({
            mensaje: 'Código incorrecto'
        });
    }
    if (new Date() > recuperacion.fecha_expiracion) {
        await RecuperacionPassword.destroy({
            where: { email }
        });
        return res.status(404).json({
            mensaje: 'Código expirado'
        });
    } 
    res.status(200).json({
        mensaje: 'Código correcto'
    });

    } catch (error) {
        console.error('Error en recuperacion:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};
const cambiarPassword = async (req, res) => {
    try {
        const { email, tipo, codigo, nuevaPassword } = req.body;

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

        const recuperacion = await RecuperacionPassword.findOne({
            where: {
                email,
                codigo
            }
        });

        if (!recuperacion) {
            return res.status(400).json({
                mensaje: 'Código incorrecto'
            });
        }

        if (new Date() > recuperacion.fecha_expiracion) {
            await RecuperacionPassword.destroy({
                where: { email }
            });

            return res.status(400).json({
                mensaje: 'Código expirado'
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

        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

        usuario.password = hashedPassword;
        await usuario.save();

        await RecuperacionPassword.destroy({
            where: { email }
        });

        res.status(200).json({
            mensaje: 'Contraseña cambiada correctamente'
        });

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);

        res.status(500).json({
            mensaje: 'Error interno del servidor'
        });
    }
};


module.exports = {
    login,
    solicitarRecuperacion,
    verificarCodigo,
    cambiarPassword
};