/* 1 Primero lo que debemos bajar es express, el cual marcara version en package.json. Para bajarlo a traves de NPM requiere el siguiente comando: npm i express. De todas maneras hay que revisar la documentacion oficial */

/* Ante de inciar su proyecto lo importante e es iniciar npm (npm init -y) y completar los datos del pacjage.json, se recomienda tambien instalar nodemon npm i -D nodemon*/

/*  nodemon.json nos sirvep ara que se actualices nuestras paginas estaticas  */

/* NOTA SUPER IMPORTANTE
Si quiero hacer una pagina super rapida, puedo instalar Express de manera integra con el comando express --view=ejs nombredelaapp o handlebars express --view=hbs nombredelaapp  */
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const { create } = require("express-handlebars"); /* esto sirve para crear archivos con extensi[on .hbs y asi crear plantillas */
require('dotenv').config() /* esto sirve para leer la variable de entorno donde se aloja nuestras permisos al serivodr en el archivo env */
require('./database/db') /* aqui estamos llamando a la conexion del servidor desde la carpeta database en el archivo db.js */


const app = express()
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    name: 'secret-name',
}))

app.use(flash())

app.get('/mensaje-flash' , (req, res) => {
    res.json(req.flash('mensaje'))
})

app.get('/crear-mensaje', (req, res) => {
    req.flash('mensaje', 'este es un mensaje de error')
    res.redirect('/mensaje-flash')
})

/* en este paso hacemos que las extesiones handlevars se conviertan en .hbs */
const hbs = create({
    extname: ".hbs",
    partialsDir: ["views/components"],
});


app.engine(".hbs", hbs.engine); /* aqui indicamos quien es el motor de plantilla en este caso handlevars */
app.set("view engine", ".hbs"); /* Le decimos que la extension va a ser .hbs */
app.set("views", "./views");/* Y que el archivo va a estar dentro de la carpeta views */

/* Antes de dar un respuesta la inteceptamos con un middleware */
/* En el caso de app.use(express.static(__dirname + "/public")); es darle identidad de publica a la carpetita Public */
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}));
app.use("/", require('./routes/home') )
app.use("/auth", require('./routes/auth') )


/* 2 armamos el puerto para funcionar. */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("SERVIDOR FUNCIONANDO " + PORT));

/* Indice:
la carpeta Views tiene dos archivos 
Home.hbs
Login.hbs
que son playillas que ingresaremos en la carpeta LAYOUTS
y dentro de Layouts colocaramos la correspondiente {{{body}}} dentro de: main.hbs para que pueda tomar las plantillas*/
