var express = require('express');
var router = express.Router();

// respond with "hello world" when a GET request is made to the homepage
router.get('/', function(req, res) {
    const urls = [
        {origin: "https://calendar.google.com/", shortUrl: 'Google Calendar'},
        {origin: "https://www.youtube.com/", shortUrl: 'Youtube'},
        {origin: "https://www.udemy.com/", shortUrl: 'Udemy'},
        ]
        res.render('home', {urls: urls});
});

router.get("/login", (req , res) => {
    res.render('login')
});

module.exports = router;