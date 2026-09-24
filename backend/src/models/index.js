const Estudiante = require('./estudiantes');
const Profesor = require('./profesores');
const Materia = require('./materia');
const ProfesorMateria = require('./profesor_materia');

Profesor.belongsToMany(Materia, {
    through: ProfesorMateria,
    foreignKey: 'id_profesor',
    otherKey: 'id_materia'
});

Materia.belongsToMany(Profesor, {
    through: ProfesorMateria,
    foreignKey: 'id_materia',
    otherKey: 'id_profesor'
});

module.exports = {
    Estudiante,
    Profesor,
    Materia,
    ProfesorMateria
};