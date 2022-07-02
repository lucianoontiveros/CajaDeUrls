var express = require('express');
const { leerUrls, agregarUrl, eliminarUrls, editarUrlForm, editarUrl, rediccionamiento } = require('../controllers/homeController');
const { formPerfil, editarFotoPerfil} = require('../controllers/perfilController');
/* Aqui trae las funciones de los controladores.  */
const urlValidar = require('../middlewares/urlValida');
const verificarUser = require('../middlewares/verificarUser');
/* Aquí traemos la función para validar las urls */


var router = express.Router();

/* con esta parte codigo estoy captando informacion del navegador, recibiendo el requimiento y respondiento. */
// respond with "hello world" when a GET request is made to the homepage
router.get('/', verificarUser, leerUrls ); /* leerUrls se trae de homecontroller, con esto se lee todas las rutas, y verificar user verificamos que el usuario tenga sesion activa */
router.post('/', verificarUser, urlValidar, agregarUrl)
router.get('/eliminar/:id', verificarUser, eliminarUrls) /* el id es el params de homceController que esta en eliminarURLS */
/* con router post estoy enviado informacion a traves del cuerpo del mensaje  */
router.get('/editar/:id', verificarUser, editarUrlForm)
router.post('/editar/:id', verificarUser, urlValidar, editarUrl)
router.get('/perfil', verificarUser, formPerfil )
router.post('/perfil', verificarUser, editarFotoPerfil)
router.get('/:shortURL', rediccionamiento)

module.exports = router;