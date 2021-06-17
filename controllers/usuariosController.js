const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/email");

exports.formIniciarSesion = async(req, res) => {
    res.render("iniciarSesion", {
        nombrePagina: "Iniciar sesion en UpTask"
    });
};

exports.formCrearCuenta = (req, res) => {
    res.render("crearCuenta", {
        nombrePagina: "Crear cuenta en UpTask",
    });
};

exports.crearCuenta = async(req, res) => {
    const { email, password } = req.body;

    try {
        await Usuarios.create({
            email,
            password,
        });
        // Crear url para confirmar el correo
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;
        //
        const usuario = {
            email,
        };
        // Enviar correo con el token
        await enviarEmail.enviar({
            usuario,
            subject: "Confirm account",
            confirmarUrl,
            archivo: "confirmar-cuenta",
        });

        req.flash("correcto", "Enviamos un correo, confirma tu cuenta");
        res.redirect("/iniciar-sesion");
    } catch (error) {
        console.log(error);

        // Crear un arreglo con los mensajes de cada error registrado por Sequelize
        req.flash(
            "error",
            error.errors.map((error) => error.message)
        );

        res.render("crearCuenta", {
            nombrePagina: "Crear cuenta en UpTask",
            mensajes: req.flash(),
            email,
            password,
        });
    }
};

exports.formReestablecerPassword = async(req, res, next) => {
    res.render("reestablecer", {
        nombrePagina: "Reestablecer tu contraseña",
    });
};

exports.confirmarCuenta = async(req, res, next) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo,
        },
    });

    if (!usuario) {
        req.flash("error", "Enlace de activacion no valido.");
        return res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;

    await usuario.save();

    req.flash("correcto", "Usuario activado correctamente.");
    res.redirect('/iniciar-sesion');
};