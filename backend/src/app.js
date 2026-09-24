const express = require('express');
const sequelize = require('./config/database');

require('./models');

const app = express();

app.get('/', (req, res) => {
    res.send('Backend funcionando');
});

sequelize.authenticate()
    .then(() => {
        console.log('Base de datos conectada correctamente');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Tablas creadas correctamente');

        app.listen(3000, () => {
            console.log('Servidor corriendo en http://localhost:3000');
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });