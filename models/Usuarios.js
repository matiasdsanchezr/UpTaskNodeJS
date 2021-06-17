const Sequelize = require("sequelize");
const db = require("../config/db");
const Proyectos = require("./Proyectos");
const bcrypt = require("bcrypt-nodejs");

const Usuarios = db.define(
    "usuarios", {
        id: {
            type: Sequelize.INTEGER(11),
            primaryKey: true,
            autoIncrement: true,
        },

        email: {
            type: Sequelize.STRING(60),
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "Agregar un correo valido",
                },
                notEmpty: {
                    msg: "El email no puede esta vacio",
                },
            },
            unique: {
                args: true,
                msg: "Usuario ya registrado",
            },
        },

        password: {
            type: Sequelize.STRING(60),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "El password no puede ser vacio",
                },
            },
        },

        activo: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },

        token: {
            type: Sequelize.STRING,
        },

        expiracion: {
            type: Sequelize.DATE,
        },
    }, {
        hooks: {
            beforeCreate(usuario) {
                usuario.password = bcrypt.hashSync(
                    usuario.password,
                    bcrypt.genSaltSync(10)
                );
            },
            validationFailed(instance, options, error) {
                console.log(error);
            },
        },
    }
);

// Metodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;