const redireccionar = document.querySelector('redireccionar');

if(redireccionar){
    console.log("Redireccionando")
    window.setTimeout(() =>
        window.location.href = '/',
        300
    );
}