const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");
//const { mostrarError } = require("../public/dist/bundle.js");

exports.agregarTarea = async(req, res, next) => {
    const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });

    const tarea = req.body.tarea;

    if (tarea < 1) {

    }

    // Estado 0 para tareas incompletas
    const estado = 0;
    proyectoId = proyecto.id;

    // Insertar en la base de datos
    const resultado = await Tareas.create({ tarea, estado, proyectoId });

    if (!resultado) return next();

    //Redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
};

exports.cambiarEstadoTarea = async(req, res, next) => {
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id } });

    tarea.estado = tarea.estado ? 0 : 1;

    const result = tarea.save();

    if (!result) return next();

    res.status(200).send("Estado actualizado");
};

exports.eliminarTarea = async(req, res, next) => {
    const { id } = req.params;

    const result = await Tareas.destroy({ where: { id } });

    if (!result) return next();

    res.status(200).send("Tarea eliminada");
};