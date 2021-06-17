const passport = require("passport");
const Usuarios = require("../models/Usuarios");

const crypto = require("crypto");
const bcrypt = require("bcrypt-nodejs");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const enviarEmail = require("../handlers/email");

exports.autenticarUsuario = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/iniciar-sesion",
    failureFlash: true,
    badRequestMessage: "Ambos campos son obligatorios",
});

// Funcion para revisar si el usuario esta autenticado
exports.usuarioAutenticado = (req, res, next) => {
    // Usuario autenticado
    if (req.isAuthenticated()) {
        return next();
    }
    // Usuario no autenticado
    return res.redirect("/iniciar-sesion");
};

// Funcion para cerrar sesion actual
exports.cerrarSesion = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect("/iniciar-sesion");
    });
};

// Generar token
exports.enviarToken = async(req, res, next) => {
    // Verificar que el usuario existe
    const usuario = await Usuarios.findOne({
        where: {
            email: req.body.email,
        },
    });

    // Comprobar si el usuario existe
    if (!usuario) {
        req.flash("error", "No existe un usuario registrado con ese correo");
        return res.redirect("/reestablecer");
    }

    // Generar si el usuario existe
    const token = crypto.randomBytes(20).toString("hex");
    const expiracion = Date.now() + 3600000;

    usuario.token = token;
    usuario.expiracion = expiracion;

    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // Enviar el correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: "Password reset",
        resetUrl,
        archivo: "reestablecer-password",
    });

    req.flash("correcto", "Se envio un mensaje a tu correo");
    res.redirect("/iniciar-sesion");
};

exports.validarToken = async(req, res, next) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
        },
    });

    // Si no se encuentra el token
    if (!usuario) {
        req.flash("error", "Error al activar la cuenta.");
        res.redirect("/reestablecer");
        return next();
    }

    // Mostrar formulario para generar nuevo password
    res.render("resetPassword", {
        nombrePagina: "Reestablecer contraseña",
    });
};

exports.actualizarPassword = async(req, res, next) => {
    // Buscar token en DB y verificar fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now(),
            },
        },
    });

    // Verificar si se encontro el token en DB
    if (!usuario) {
        req.flash("error", "Enlace de activacion no valido.");
        res.redirect("/reestablecer");
        return next();
    }

    // Generar hash para la contraseña
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

    // Actualizar token y expiracion del usuario
    usuario.token = null;
    usuario.expiracion = null;
    await usuario.save().catch((error) => {
        console.log("Error al escribir en la base de datos.".concat(error));
    });

    req.flash("correcto", "Contraseña reestablecida correctamente");
    res.redirect("/iniciar-sesion");
};