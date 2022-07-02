var express = require('express');
const { body } = require('express-validator') /* utilizamos el body porque es por donde vamos a sacar los datos para hacer funcionar nuestra validator. Aquí viaja el cuerpo del mensaje. */
const { loginForm, registerForm, registerUser, confirmarCuenta, loginUser } = require('../controllers/authController')
var router = express.Router();

/* con esta parte codigo estoy captando informacion del navegador, recibiendo el requimiento y respondiento. */
router.get("/register", registerForm);

/* Antes que la registre en la base de detos vamos a decirle que con express validator verifique si tiene permisos el usuario */
/* El body toma como primer paramentro el nombre de nuestro input */
/* trim limpia lo que escribio el usuario, escape no deja mandar carcateres  Todo esto viajara a AUTH CONTROLLER */
router.post("/register", [
body('username', 'ingrese un nombre valido').trim().notEmpty().escape(),
body('email', 'Ingrese un correo electronico válido').trim().isEmail().normalizeEmail(),
body('password', 'contraseña minima de 6 caracteres ').trim().isLength({min: 6}).escape().custom((value, {req}) => {
    if(value !== req.body.repassword){
        throw new Error('No coinciden las contreseñas')
    } else {
        return value;
    }
}) ],
 registerUser);

 /* El custom es super importante porque nos permite validar cualquier cosa que se nos ocurra, en este caso validamos si son iguales las contraseñas. Ingresamos value para revisar el valor del imput y 
 lo comparamos.  */


router.get('/confirmar/:token', confirmarCuenta) 
router.get("/login", loginForm);
router.post("/login", [
    body('email', 'Ingrese un correo electronico válido').trim().isEmail().normalizeEmail(),
    body('password', 'contraseña minima de 6 caracteres ').trim().isLength({min: 6}).escape(),
], loginUser);


router.get('/logout', function(req, res){
    req.session.destroy()
    res.redirect('/');
  });

module.exports = router;