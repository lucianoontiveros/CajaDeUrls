const { URL } = require('url')
const urlValidar = (req, res, next) => {
    try {
        const { origin } = req.body;  /* Aqu[i buscamos la propiedad origin desde el cuerpo */
        const urlFrontend = new URL(origin); 
        if ( urlFrontend.origin !== "null") {
            if(
                urlFrontend.protocol === "http:" ||
                urlFrontend.protocol === "https:"
            ) {
                return next()
            }
            throw new Error ('tiene que tener https');
        } 
        throw new Error ('no válida');
    } catch (error) {
        if(error.message === "Invalid URL"){
            req.flash('mensajes', [{ msg: "Url no valida" }]);
        } else {
            req.flash('mensajes', [{ msg: error.message }]);
            
        }
        return res.redirect('/')
    }         
}

module.exports = urlValidar;