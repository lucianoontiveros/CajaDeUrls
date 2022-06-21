const user = require("../models/User");
const {nanoid} = require('nanoid')

const registerForm = (req, res) => {
    res.render('register')
}

const registerUser = async(req, res) => {
    const { username, email, password } = req.body;
    try { 
       let User = await user.findOne({ email });
       if(User) throw new Error('ya existe usuario');

        User = new user({ username, email, password, tokenConfirm: nanoid(7) }) 
        await User.save()
        res.json(User)
    } catch (error){
        res.json({error: error.message})
    }
}

const loginForm = (req, res) =>{
    res.render('login')
}


module.exports = {
    loginForm,
    registerForm,
    registerUser
}