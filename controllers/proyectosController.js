const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.proyectosHome = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: { usuarioId },
    });
    res.render("index", { nombrePagina: "Proyectos", proyectos });
};

exports.formularioProyecto = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({
        where: { usuarioId },
    });
    res.render("nuevoProyecto", { nombrePagina: "Nuevo Proyecto", proyectos });
};

exports.nuevoProyecto = async(req, res) => {
    const { nombre } = req.body;

    let errores = [];

    if (!nombre || nombre.length < 1) {
        errores.push({ texto: "Agrega un Nombre al proyecto" });
    }

    if (nombre.length > 99) {
        errores.push({ texto: "El maximo numero de caracteres es 100" });
    }

    if (errores.length > 0) {
        // Recargar listas de proyectos
        const usuarioId = res.locals.usuario.id;
        const proyectos = await Proyectos.findAll({
            where: { usuarioId },
        });
        // Renderizar vista de nuevo proyecto con los errores
        res.render("nuevoProyecto", {
            nombrePagina: "Nuevo Proyecto",
            proyectos,
            errores,
        });
    } else {
        try {
            // Registrar nuevo proyecto en la base de datos
            const usuarioId = res.locals.usuario.id;
            let query = await Proyectos.create({ nombre, usuarioId });
        } catch (err) {
            console.log(
                "proyectosController.nuevoProyecto -> Error al escribir en la base de datos.\n" +
                err
            );
        }
        // Actualizar lista de proyectos
        const usuarioId = res.locals.usuario.id;
        const proyectos = await Proyectos.findAll({
            where: { usuarioId },
        });
        res.render("nuevoProyecto", {
            nombrePagina: "Proyecto registrado",
            proyectos,
        });
    }
};

exports.proyectoPorUrl = async(req, res, next) => {
    // Actualizar lista de proyectos
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = await Proyectos.findAll({
        where: { usuarioId },
    });
    // Buscar proyecto con la url especificada
    const proyectoPromise = await Proyectos.findOne({
        where: {
            url: req.params.url,
        },
    });
    const [proyectos, proyecto] = await Promise.all([
        proyectosPromise,
        proyectoPromise,
    ]);

    if (!proyecto) return next();

    // Consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({ where: { proyectoId: proyecto.id } });

    res.render("tareas", {
        nombrePagina: "Tareas del Proyecto",
        proyectos,
        proyecto,
        tareas,
    });
};

exports.formularioEditar = async(req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = await Proyectos.findAll({
        where: { usuarioId },
    });
    const proyectoPromise = await Proyectos.findOne({
        where: {
            id: req.params.id,
        },
    });
    const [proyectos, proyecto] = await Promise.all([
        proyectosPromise,
        proyectoPromise,
    ]);

    res.render("nuevoProyecto", {
        nombrePagina: "Editar Proyecto",
        proyectos,
        proyecto,
    });
};

exports.actualizarProyecto = async(req, res) => {
    const { nombre } = req.body;

    let errores = [];

    if (!nombre) {
        errores.push({ texto: "Agrega un Nombre al proyecto" });
    }

    if (errores > 0) {
        const usuarioId = res.locals.usuario.id;
        const proyectos = await Proyectos.findAll({
            where: { usuarioId },
        });
        res.render("nuevoProyecto", {
            nombrePagina: "Nuevo Proyecto",
            proyectos,
            errores,
        });
    } else {
        try {
            let query = await Proyectos.update({ nombre: nombre }, { where: { id: req.params.id } });
            //console.log('Agregado a la tabla: ' + query.nombre);
        } catch (err) {
            console.log(
                "proyectosController.nuevoProyecto -> Error al escribir en la base de datos.\n" +
                err
            );
        }
        // Actualizar lista de proyectos
        const usuarioId = res.locals.usuario.id;
        const proyectos = await Proyectos.findAll({
            where: { usuarioId },
        });
        res.render("nuevoProyecto", {
            nombrePagina: "Proyecto registrado",
            proyectos,
        });
    }
};

exports.eliminarProyecto = async(req, res, next) => {
    const { urlProyecto } = req.query;

    const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });

    if (!resultado) {
        return next();
    }

    res.status(200).send("Proyecto eliminado correctamente");
};