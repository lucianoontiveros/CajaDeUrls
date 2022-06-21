var express = require('express');
const { loginForm, registerForm, registerUser } = require('../controllers/authController')
var router = express.Router();

/* con esta parte codigo estoy captando informacion del navegador, recibiendo el requimiento y respondiento. */
router.get("/register", registerForm);
router.post("/register", registerUser);
router.get("/login", loginForm);

module.exports = router;