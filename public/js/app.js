console.log('haciendo prueba desde el servidor');

document.addEventListener('click', e => {
    if (e.target.dataset.short) {
        const url = `http://localhost:5000/${e.target.dataset.short}`
        navigator.clipboard
        .writeText(url)
        .then(() => {
            console.log('Text copiado')
        })
        .catch ((error) => {
            console.log("algo salio mal ")
        })
    }
})