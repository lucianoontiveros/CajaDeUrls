const user = require("../models/User"); /* Aquí traigo la estructura de los datos que registraremos en un futuro en la base de datos: Auth */
const {validationResult}  = require('express-validator')
const {nanoid} = require('nanoid')

const registerForm = (req, res) => {
    res.render('register', {mensajes: req.flash('mensajes')})
}

const registerUser = async(req, res) => {

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
       return res.redirect('/auth/login')
    

    } catch (error){
        req.flash("mensajes", [{ msg: error.message }]);
        res.redirect("/auth/register");
    }
}

const confirmarCuenta = async(req, res) => {
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

const loginForm = (req, res) =>{
    res.render('login', {mensajes: req.flash('mensajes')})
}

const loginUser = async(req , res) => {
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
        if(!await User.comparePassword(password)) throw new Error('Contraseña no correcta')

        return res.redirect('/')
         
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
    loginUser
}