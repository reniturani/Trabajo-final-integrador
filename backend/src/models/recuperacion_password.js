const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecuperacionPassword = sequelize.define('RecuperacionPassword', {
    id_recuperacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    codigo:{
        type: DataTypes.STRING,
        allowNull: false
    },
    fecha_expiracion: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'recuperacion_password',
    timestamps: false
});

module.exports = RecuperacionPassword;  