var express = require('express');
const { leerUrls, agregarUrls } = require('../controllers/homeController');


var router = express.Router();

// respond with "hello world" when a GET request is made to the homepage
router.get('/', leerUrls );
router.post('/', agregarUrls)

router.get("/login", (req , res) => {
    res.render('login')
});

module.exports = router;