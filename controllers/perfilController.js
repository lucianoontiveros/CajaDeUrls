const formidable = require('formidable')
const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')
const User = require('../models/User')

module.exports.formPerfil = async(req , res) => {
    try {
        const user = await User.findById(req.user.id)
        return res.render('perfil', {user: req.user, imagen: user.imagen})

    } catch (error) {
        req.flash('mensajes', [{ msg: error.message}])  
        return res.redirect('/perfil')
    }
};

module.exports.editarFotoPerfil = async (req, res) => {
    /* el req de edutarFotoPerfil trae del body la img */
    const form = new formidable.IncomingForm()
    form.maxFileSize = 50 * 1024 * 1024 // 50mb esto crea un nuevo objeto, hace a la imagen mas pequeña

    /* form.parse es el que va a leer la imagen. */
    // el req anterior es el que se esta trayendo a la img para procesar.
    form.parse(req, async(err, fields, files) => {
        const file = files.myFile
            console.log(files)

        try {

            if(err){
                throw new Error("fallo al subir la imagen") 
            }

            if(file.originalFileName === ""){
                throw new Error ('Por favor agrega un img')
            }

            const imagenTypes = ['image/jpeg','image/png'];

            if(!imagenTypes.includes(file.mimetype)) {
                throw new Error('Favor ingresar una imagen con formato jpeg, png o jpg')
            }

            if(file.size > 50 * 1024 * 1024) {
                throw new Error("La imagen es muy pesada. Maximo 50mb")
            }

            const extension = file.mimetype.split('/')[1];
            const dirFile = path.join(__dirname, `../public/img/perfiles/${req.user.id}.${extension}`)
            console.log(dirFile + extension);

            fs.renameSync(file.filepath, dirFile)
            const image = await Jimp.read(dirFile)
            image.resize(200,200).quality(95).writeAsync(dirFile)
            const user = await User.findById(req.user.id)
            user.imagen = `${req.user.id}.${extension}`
            await user.save()

            req.flash('mensajes', [{ msg: "La imagen correspondiente se guardó con exito"}]);
        } catch (error) {
            req.flash('mensajes', [{ msg: error.message}])     
        } finally {
            return res.redirect('/perfil')
        }
    }) 
}