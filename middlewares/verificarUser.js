module.exports = (req, res, next) => {
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect('/auth/login')
};


/* Esto me permite verificar que el usuario
este indentificado en todas las sesiones antes 
de pasar pagina  */