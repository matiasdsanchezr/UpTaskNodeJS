const Sequelize = require('sequelize');
const slug = require('slug');
const shortid = require('shortid');

const db = require('../config/db')

const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },

    nombre: Sequelize.STRING(100),

    url: Sequelize.STRING(100)

}, {
    hooks: {
        beforeCreate(proyecto) {
            const url = slug(proyecto.nombre).toLowerCase();

            proyecto.url = `${url}-${shortid.generate()}`;
        },
        validationFailed(instance, options, error) {
            console.log(error);
        }
    }
});

module.exports = Proyectos;