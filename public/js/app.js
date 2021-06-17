import proyectos from './modulos/proyectos'
import tareas from './modulos/tareas'
import utils from './funciones/utils'
import { actualizarAvance } from './funciones/avance'
import { validarSignup } from './funciones/validarSignup';

document.addEventListener("DOMContentLoaded", () => {
    actualizarAvance();
    validarSignup();
})