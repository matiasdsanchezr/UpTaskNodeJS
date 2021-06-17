export const actualizarAvance = () => {
    const tareas = document.querySelectorAll('li.tarea');
    console.debug(tareas)

    if (tareas.length) {
        const tareasCompletadas = document.querySelectorAll('i.completo');
        const avance = Math.round(tareasCompletadas.length * 100 / tareas.length);
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance + '%';
    }
}