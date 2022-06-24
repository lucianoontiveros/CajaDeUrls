var express = require('express');
const { body } = require('express-validator')
const { loginForm, registerForm, registerUser, confirmarCuenta, loginUser } = require('../controllers/authController')
var router = express.Router();

/* con esta parte codigo estoy captando informacion del navegador, recibiendo el requimiento y respondiento. */
router.get("/register", registerForm);
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
router.get('/confirmar/:token', confirmarCuenta) 
router.get("/login", loginForm);
router.post("/login", [
    body('email', 'Ingrese un correo electronico válido').trim().isEmail().normalizeEmail(),
    body('password', 'contraseña minima de 6 caracteres ').trim().isLength({min: 6}).escape(),
], loginUser);

module.exports = router;