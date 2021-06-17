import proyectos from './modulos/proyectos'
import tareas from './modulos/tareas'
import utils from './funciones/utils'
import { actualizarAvance } from './funciones/avance'

document.addEventListener("DOMContentLoaded", () => {
    actualizarAvance();
})