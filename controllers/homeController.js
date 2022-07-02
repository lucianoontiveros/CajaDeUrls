const Url = require('../models/Url')
let { nanoid } = require('nanoid');

const leerUrls = async (req, res) => {

    try { 
        const urls = await Url.find({user: req.user.id}).lean()
        res.render('home', {urls: urls});
       /* urls simular de una base de datos, esta misma va a ir a 
        home.hbs y se ingresa como una plantilla*/

    }
    catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/')
    }
    
};


const agregarUrl = async (req, res) => {
    const { origin } = req.body
    try { 
        const url = new Url({ origin: origin, shortURL: nanoid(10), user: req.user.id})
        await url.save()
        req.flash('mensajes', [{ msg: 'Url agregada correctamente' }]);
        res.redirect('/');

    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/')
    }
};


const eliminarUrls = async (req, res) => {
    const {id} = req.params
    try { 

       const url = await Url.findById(id)         /* con este comando estamos bucando el ID  */
       if(!url.user.equals(req.user.id)){
        throw new Error("No es tu Url payaso")
       }

       await url.remove()
       req.flash('mensajes', [{ msg: "Url eliminada correctamente" }]);
       /* aqui estamos pidiendo que el servidor elimine la informacion */
       /* urls simular de una base de datos, esta misma va a ir a 
        home.hbs y se ingresa como una plantilla*/
        res.redirect("/")

    }
    catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/auth/login')
    }
    
};

const editarUrlForm = async (req, res) => {
    const {id} = req.params
    try { 
        const url = await Url.findById(id).lean()
        if(!url.user.equals(req.user.id)){
            throw new Error("No es tu Url payaso")
        }
        return res.render('home', {url} );
    }
    catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/auth/login')
    }
    
};

const editarUrl = async (req, res) => {
    const {id} = req.params;
    const {origin} = req.body
    try { 
    
        const url = await Url.findById(id)         /* con este comando estamos bucando el ID  */
        if(!url.user.equals(req.user.id)){
         throw new Error("No es tu Url payaso")
        }

       await url.updateOne({origin})
       req.flash('mensajes', [{ msg: "Url editada correctamente" }]);
       return res.redirect('/')
    }
    catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/')
    }
    
};

const rediccionamiento = async(req, res) => {
    const {shortURL} = req.params;
    try { 
        const urlDB = await Url.findOne({ shortURL: shortURL })
        res.redirect(urlDB.origin);
    }
    catch (error) {
        req.flash('mensajes', [{ msg: "no existe esta url configurada" }]);
        return res.redirect('/auth/login')
    }
};

module.exports = {
    leerUrls,
    agregarUrl, 
    eliminarUrls,   
    editarUrlForm,
    editarUrl,
    rediccionamiento
}