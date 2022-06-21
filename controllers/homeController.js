const Url = require('../models/Url')
let { nanoid } = require('nanoid');

const leerUrls = async (req, res) => {

    try { 
        const urls = await Url.find().lean()
        res.render('home', {urls: urls});
       /* urls simular de una base de datos, esta misma va a ir a 
        home.hbs y se ingresa como una plantilla*/

    }
    catch (error) {
        console.log(error)
        res.send('fallo algo')
    }
    
};


const agregarUrl = async (req, res) => {
    const { origin } = req.body
    try { 
        const url = new Url({ origin: origin, shortURL: nanoid(10)})
        await url.save()
        res.redirect('/');

    } catch (error) {
        console.log(error)
        res.send('error de conexion')
    }
};


const eliminarUrls = async (req, res) => {
    const {id} = req.params
    try { 

        await Url.findByIdAndDelete(id) /* con este comando estamos bucando el ID  */
        res.redirect("/"); /* aqui estamos pidiendo que el servidor elimine la informacion */
       /* urls simular de una base de datos, esta misma va a ir a 
        home.hbs y se ingresa como una plantilla*/

    }
    catch (error) {
        console.log(error)
        res.send('fallo algo')
    }
    
};

const editarUrlForm = async (req, res) => {
    const {id} = req.params
    try { 
        const url = await Url.findById(id).lean()
        console.log(url);
        res.render('home', {url} );
    }
    catch (error) {
        console.log(error)
        res.send('fallo algo')
    }
    
};

const editarUrl = async (req, res) => {
    const {id} = req.params;
    const {origin} = req.body
    try { 
        const url = await Url.findByIdAndUpdate(id, {origin})
        res.redirect('/')
    }
    catch (error) {
        console.log(error)
        res.send('fallo algo')
    }
    
};

const rediccionamiento = async(req, res) => {
    const {shortURL} = req.params;
    try { 
        const urlDB = await Url.findOne({ shortURL: shortURL })
        res.redirect(urlDB.origin);
    }
    catch (error) {
        console.log(error)
        res.send('fallo algo')
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