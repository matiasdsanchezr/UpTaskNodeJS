const { default: axios } = require("axios");
const { default: Swal } = require("sweetalert2");
const { actualizarAvance } = require("../funciones/avance");

const tareas = document.querySelector(".listado-pendientes");

if (tareas) {
    tareas.addEventListener("click", (e) => {
        if (e.target.classList.contains("fa-check-circle")) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            const url = `${location.origin}/tareas/${idTarea}`;

            axios
                .patch(url, {
                    idTarea,
                })
                .then((res) => {
                    if (res.status === 200) {
                        icono.classList.toggle("completo");
                        actualizarAvance();
                    }
                });
        } else if (e.target.classList.contains("fa-trash")) {
            // Eliminar tarea
            const tareaHTML = e.target.parentElement.parentElement;
            const idTarea = tareaHTML.dataset.tarea;
            Swal.fire({
                title: "Desea borrar esta tarea?",
                text: "Una tarea eliminada no se puede recuperar!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, borrala",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios
                        .delete(url, { params: { idTarea } })
                        .then((res) => {
                            Swal.fire({
                                icon: "success",
                                title: res.data
                            }).then(res => {
                                tareaHTML.parentElement.removeChild(tareaHTML);
                                actualizarAvance();
                            });
                        })
                        .catch(() => {
                            Swal.fire({
                                type: "error",
                                title: "Ocurrió un error",
                                text: "No se pudo eliminar la tarea"
                            });
                        })
                }
            });
        }
    });
}