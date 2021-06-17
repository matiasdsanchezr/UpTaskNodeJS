import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
    btnEliminar.addEventListener('click', (e) => {
        const urlProyecto = e.target.dataset.proyectoUrl;
        Swal.fire({
            title: 'Desea borrar este proyecto?',
            text: "Un proyecto eliminado no se puede recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borralo',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const url = `${location.origin}/proyectos/${urlProyecto}`;
                axios.delete(url, { params: { urlProyecto } })
                    .then(function(respuesta) {
                        Swal.fire({
                            icon: 'success',
                            title: respuesta.data,
                        }).then(() => {
                            window.location.href = '/'
                        });
                    })
                    .catch(() => {
                        Swal.fire({
                            icon: 'error',
                            text: 'No se pudo eliminar el proyecto',
                            title: 'Ocurrió un error'
                        }).then(() => {});
                    });
            }
        })
    })
}

export default btnEliminar;