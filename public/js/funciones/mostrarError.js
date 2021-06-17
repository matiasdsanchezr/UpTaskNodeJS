import Swal from 'sweetalert2';

export const mostrarError = (url) => {
    Swal.fire({
        title: 'Desea borrar este proyecto?',
        text: "Un proyecto eliminado no se puede recuperar!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borralo',
        cancelButtonText: 'Cancelar'
    }).then(() => {
        window.location.href = '/'
    })
}