const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const proyectosController = require("../controllers/proyectosController");
const tareasController = require("../controllers/tareasController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");

module.exports = function() {
    router.get(
        "/",
        authController.usuarioAutenticado,
        proyectosController.proyectosHome
    );

    // Formulario para guardar nuevo proyecto
    router.get(
        "/nuevo-proyecto",
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto
    );

    // Guardar nuevo proyecto
    router.post(
        "/nuevo-proyecto",
        authController.usuarioAutenticado,
        body("nombre").not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );

    // Buscar proyecto por url
    router.get(
        "/proyectos/:url",
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    );

    // Editar proyecto por id
    router.get(
        "/proyecto/editar/:id",
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    );

    // Actualizar proyecto por id
    router.post(
        "/nuevo-proyecto/:id",
        authController.usuarioAutenticado,
        body("nombre").not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    // Eliminar proyecto
    router.delete(
        "/proyectos/:url",
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    // Agregar tarea
    router.post(
        "/proyectos/:url",
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );

    // Cambiar estado de tarea
    router.patch(
        "/tareas/:id",
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );

    // Eliminar tarea
    router.delete(
        "/tareas/:id",
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );

    // Formulario para crear nueva cuenta
    router.get("/crear-cuenta", usuariosController.formCrearCuenta);

    // Crear nuevo usuario
    router.post("/crear-cuenta", usuariosController.crearCuenta);

    // Confirmar nuevo usuario
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    // Iniciar sesion
    router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
    router.post("/iniciar-sesion", authController.autenticarUsuario);

    // Cerrar sesion
    router.get(
        "/cerrar-sesion",
        authController.usuarioAutenticado,
        authController.cerrarSesion
    );

    // Reestablecer contraseña
    router.get("/reestablecer", usuariosController.formReestablecerPassword);
    router.post("/reestablecer", authController.enviarToken);
    router.get("/reestablecer/:token", authController.validarToken);
    router.post("/reestablecer/:token", authController.actualizarPassword);

    // Pagina por defecto
    router.get("/*", (req, res) => {
        res.redirect("/");
    });

    return router;
};