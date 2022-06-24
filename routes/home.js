var express = require('express');
const { leerUrls, agregarUrl, eliminarUrls, editarUrlForm, editarUrl, rediccionamiento } = require('../controllers/homeController');
/* Aqui trae las funciones de los controladores.  */
const urlValidar = require('../middlewares/urlValida');
/* Aquí traemos la función para validar las urls */


var router = express.Router();

/* con esta parte codigo estoy captando informacion del navegador, recibiendo el requimiento y respondiento. */
// respond with "hello world" when a GET request is made to the homepage
router.get('/', leerUrls ); /* leerUrls se trae de homecontroller */
router.post('/', urlValidar, agregarUrl)
router.get('/eliminar/:id', eliminarUrls) /* el id es el params de homceController que esta en eliminarURLS */
/* con router post estoy enviado informacion a traves del cuerpo del mensaje  */
router.get('/editar/:id', editarUrlForm)
router.post('/editar/:id', urlValidar, editarUrl)
router.get('/:shortURL', rediccionamiento)

module.exports = router;