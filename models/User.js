const mongoose = require('mongoose');
const {Schema} = mongoose;
var bcrypt = require('bcryptjs');
/* En este apartado creemos un esquema para introducir la información en la base de datos,
toda estra estructura hay que exportarla al controlador: auth.js quien recibe las funciones 
para registrar y manipular la base de datos. 
*/

const userSchema = new Schema({ 
    username: {
        type: String,
        lowercase: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        index: { unique: true }
    },
    password: { 
        type: String,
        required: true,

    },
    tokenConfirm: {
        type: String,
        default: null
    },
    cuentaConfirmada: {
        type: Boolean,
        default: false
    }
})


/* UserSchema es el esquema que queremos acceder para hacerle hash a las contraseñas que el usuario ingres, por ello usamos el meto pre que nos
permite guardar antes de subir todo a la base de datos y llamamos a la función next para pasar a la siguiente ejecución en caso de exitir una contreseña registrada. Recordar que las function tiene acceso a los THIS  */
userSchema.pre('save', async function(next){
    const user = this
    if(!user.isModified('password')) return next()

    try {
         const salt = await bcrypt.genSalt(10);
         const hash = await bcrypt.hash(user.password, salt)

         user.password = hash;
         next();

    } catch (error) {
        console.log(error)
        next();
    }
})


userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}


module.exports =  mongoose.model('User', userSchema);  /* los esquemas se manda con el .model(nombre que tendra en la base de datos, la variable del squema) */