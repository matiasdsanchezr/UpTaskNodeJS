const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/email");

exports.formIniciarSesion = async(req, res) => {
    res.render("iniciarSesion", {
        nombrePagina: "Iniciar sesion en UpTask",
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
        //Registrar nuevo usuario en la base de datos
        const usuario = await Usuarios.create({
            email,
            password,
        });

        // Crear url para confirmar el correo
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        // Enviar correo con el token
        await enviarEmail.enviar({
            usuario,
            subject: "Confirmar registro",
            confirmarUrl,
            archivo: "confirmar-cuenta",
        });

        req.flash("correcto", "Se envió un correo electronico de confirmacion.");
        res.redirect("/iniciar-sesion");
    } catch (error) {
        // Crear un arreglo con los mensajes de cada error registrado por Sequelize
        req.flash(
            "error",
            error.errors.map((error) => error.message)
        );

        // Mostrar vista de crear nueva cuenta
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
    // Buscar email de usuario en la base de datos
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo,
        },
    });

    // Verificar si hay una cuenta registrada
    if (!usuario) {
        req.flash("error", "Enlace de activacion no valido.");
        return res.redirect("/crear-cuenta");
    }

    // Actualizar estado de activacion de la cuenta
    usuario.activo = 1;

    // Guardar cambios en la base de datos
    await usuario.save().catch((error) => {
        console.log("Error al escribir en la base de datos.".concat(error));
    });

    req.flash("correcto", "Usuario activado correctamente.");
    res.redirect("/iniciar-sesion");
};