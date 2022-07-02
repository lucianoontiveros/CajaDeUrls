/* 1 Primero lo que debemos bajar es express, el cual marcara version en package.json. Para bajarlo a traves de NPM requiere el siguiente comando: npm i express. De todas maneras hay que revisar la documentacion oficial */

/* Ante de inciar su proyecto lo importante e es iniciar npm (npm init -y) y completar los datos del pacjage.json, se recomienda tambien instalar nodemon npm i -D nodemon*/

/*  nodemon.json nos sirvep ara que se actualices nuestras paginas estaticas  */

/* NOTA SUPER IMPORTANTE
Si quiero hacer una pagina super rapida, puedo instalar Express de manera integra con el comando express --view=ejs nombredelaapp o handlebars express --view=hbs nombredelaapp  */
const express = require('express');
const session = require('express-session'); /* Esto permitira abrir sesiones */
const flash = require('connect-flash'); /* esto sirve para manipular y enviar mensajes de errores. */
const { create } = require("express-handlebars"); /* esto sirve para crear archivos con extensi[on .hbs y asi crear plantillas */
const passport = require('passport'); /* sirve para hacer nuestra ruta protegida del home, en este caso no de manera local dado que hemos implementado todas las validaciones */
const User = require('./models/User');
const csrf = require('csurf');
require('dotenv').config() /* esto sirve para leer la variable de entorno donde se aloja nuestras permisos al serivodr en el archivo env */
require('./database/db') /* aqui estamos llamando a la conexion del servidor desde la carpeta database en el archivo db.js */
const MongoStore = require('connect-mongo');
const clientDB = require('./database/db');
var cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const UserValidar = User;

const app = express()

var corsOptions = {
    credentials: true,
    optionsSuccessStatus: process.env.PATHHEROKU || '*',
    methods: ['GET', 'POST'],
}
app.use(cors())
app.set("trust proxy", 1);
/* Esto configura la sesión de manera privada */
app.use(session({
    secret: process.env.SECRETSESSION,
    resave: false,
    saveUninitialized: false,
    name: 'secret-name',
    store: MongoStore.create({
        clientPromise: clientDB,
        dbName: process.env.DBNAME,
    }),
    cookie: {secure: process.env.MODO === "production", maxAge: 30 * 24 * 60 * 60 * 1000}
}))

/* Flash se usa para enviar mensajes de error al usuario. */
app.use(flash()) 

app.use(passport.initialize()); /* Con esto inicia passport */
app.use(passport.session()) /* Aqui llama las sesiones de passport */


passport.serializeUser(( User, done ) => done(null, { id: User._id, username: User.username }))
passport.deserializeUser(async( User, done ) => {
  const userDB = await UserValidar.findById(User.id)
    return done(null, { id: userDB._id, username: userDB.username})
})

app.get('/mensaje-flash' , (req, res) => {
    res.json(req.flash('mensaje'))
}) /* Aquí estan los requerimientos para emviar mensajes de error, tener en cuenta que este mensaje
dura una sola vez, luego se muere*/

app.get('/crear-mensaje', (req, res) => {
    req.flash('mensaje', 'este es un mensaje de error')
    res.redirect('/mensaje-flash')
}) /* Aqui creamos el mensaje de error. Recibe la key y agregamos el mensaje correspondiente que se va a guardar. antes no tenia nada la ruta pero ahora
lo redirigimos con el mensaje */

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

app.use(csrf());
app.use(mongoSanitize());

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    res.locals.mensajes = req.flash('mensajes')
    next();
})

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
