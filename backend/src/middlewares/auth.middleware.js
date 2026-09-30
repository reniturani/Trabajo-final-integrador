const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    try {
        // 1) buscamos el token en los headers de la peticion
        const authHeader = req.headers.authorization;

        // si no mandaron el header, se les niega el acceso a la ruta protegida
        if (!authHeader) {
            return res.status(401).json({ mensaje: 'Acceso denegado: No se proporcionó un token' });
        }

        // 2) separamos la palabra "Bearer" del token real
        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ mensaje: 'Acceso denegado: Formato de token inválido' });
        }

        // 3) verificamos que el token sea valido usando la misma palabra que en el login
        const decodificado = jwt.verify(token, 'secret');

        // 4) guardamos los datos decodificados (id y tipo) en el objeto req
        // asi cualquier controlador que se ejecute despues, va a saber quien es el usuario
        req.usuario = decodificado;

        // 5) si todo esta bien, se le permite el acceso a la ruta protegida
        next();

    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        
        // si el token fue modificado, es falso, o ya paso 1 hora (expiro):
        return res.status(401).json({ mensaje: 'Token inválido o expirado. Por favor, inicie sesión nuevamente.' });
    }
};

module.exports = { verificarToken };