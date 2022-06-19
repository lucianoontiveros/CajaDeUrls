const Url = require('../models/url')

const leerUrls = async(req, res) => {
    const urls = [
        {origin: "https://calendar.google.com/", shortUrl: 'Google Calendar'},
        {origin: "https://www.youtube.com/", shortUrl: 'Youtube'},
        {origin: "https://www.udemy.com/", shortUrl: 'Udemy'},
    ];
    res.render('home', {urls: urls});
};


const agregarUrls = async (req, res) => {

    try { 
        const url = new Url({origin: 'estatico'})
        await url.save();
        res.send('agregado correctamente');

    } catch (error) {
        console.log(error)
        res.send('error de conexion')
    }
};

module.exports = {
    leerUrls,
    agregarUrls,    
}