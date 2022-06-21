const { URL } = require('url')
const urlValidar = (req, res, next) => {
    try {
        const { origin } = req.body;  /* Aqu[i buscamos la propiedad origin desde el cuerpo */
        const urlFronted = new URL(origin); 
        if (urlFronted.origin !== "null") {
            return next();
        } else {
            throw new Error ('no válida');
        }
     } 
     catch (error) {
            return res.send('No es una dir valida, favor de ingresar la dir completa copiandola desde su barra de navegacion')
     }
}

module.exports = urlValidar;