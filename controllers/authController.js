const user = require("../models/User"); /* Aquí traigo la estructura de los datos que registraremos en un futuro en la base de datos: Auth */
const {validationResult}  = require('express-validator')
const {nanoid} = require('nanoid')
const nodemailer = require("nodemailer");
require('dotenv').config();




const registerForm = (req, res) => {
    res.render('register')
}

const registerUser = async(req, res) => {
    req.body = sanitize(req.body);
    /* aque tenemos un propiedad que se llama
    express validator */
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        req.flash('mensajes', errors.array());
        return res.redirect('/auth/register')
    }


    const { username, email, password } = req.body;

    try { 

        /* Aquí verificamos si el usuario existe en la base de datos.  */
       let User = await user.findOne({ email });
       if(User) throw new Error('ya existe usuario');

        User = new user({ username, email, password, tokenConfirm: nanoid(7) }) 
        await User.save()

       // enviar correo electronico con la confirmacion de la cuenta
       const transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: process.env.USEREMAIL,
          pass: process.env.PASSEMAIL,
        }
      });

      await transport.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: User.email , // list of receivers
        subject: "Verifica tu cuenta de ShortCut", // Subject line
        html: `<a href="${process.env.PATHHEROKU || 'http://localhost:5000'}/auth/confirmar/${User.tokenConfirm}">Verifica t u cuenta aquí</a>`, // html body
      });

       req.flash('mensajes', [{msg: 'revisa tu correo electronico y valida tu cuenta'}])
       return res.redirect('/auth/login')
    

    } catch (error){
        req.flash("mensajes", [{ msg: error.message }]);
        res.redirect("/auth/register");
    }
}

const confirmarCuenta = async(req, res) => {
    req.body = sanitize(req.body);
    const {token} = req.params
/* para leeer parametros que vienen de la url como el token necesitamos los params */
    try {
      const User = await user.findOne({tokenConfirm: token})
      if(!User) throw new Error('No existe este usuario');
   
        User.cuentaConfirmada = true;
        User.tokenConfirm = null;

        await User.save()

        req.flash('mensajes', [{ msg: 'Puedes iniciar sesión' }]);

        return res.redirect('/auth/login')
       
    } catch (error){
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/auth/login')
    }
}

/* Mensajes viene de req.flash y lo colocamos en loginForm. Recordar que flas solamente dura una sesion
este mensaje lo vamos a llevar al main en nuestro layouts para ponerlo como plantilla  */
const loginForm = (req, res) =>{
    res.render('login')
}


/* En esta parte hay que estar muy concentrados porque 
porque tambien vamos a enviar los mensajes del req. flash
pero al remitir información desde el servidor el mensaje error
del catch error sabes que es un array que adentro tiene un objeto 
y ese objeto tiene un mensaje.  */

/* El metodo Throw new Error nos permite acumular los erroes
y mandarlos al Cathc sin mas discusión. */
const loginUser = async (req , res) => {
    req.body = sanitize(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        req.flash('mensajes', errors.array());
        return res.redirect('/auth/login')
    }
    
    const {email, password} = req.body 

    /* Recuerden que el throw no es necesario enviar return */
    try {
        const User = await user.findOne({email})
        if(!User) throw new Error('No existe este email')

        if(!User.cuentaConfirmada) throw new Error('debe confirmar su cuenta')

        /* aqui podriamos hacer la autentificaci[on de usuario pero en este ejemplo se decidio hacerlo en el authSchema */
        if(!(await User.comparePassword(password))) throw new Error('Contraseña no correcta')

            /* Me esta creando la sesion de usuario a traves de passport */
        req.login(User, function(err) {
            if(err) throw new Error("error al crear la seccion")
            return res.redirect('/')
        })
        
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/auth/login')
    }
}



module.exports = {
    loginForm,
    registerForm,
    registerUser,
    confirmarCuenta,
    loginUser,
}