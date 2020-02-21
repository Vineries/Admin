var express = require('express');
var axios = require('axios');

var router = express.Router();

/* Add new winery page. */
router.get('/new', function(req, res, next) {
    res.render('admin/region/new', { title: "INDEX", layout: "admin" })
});

/* Add new winery page. */
router.get('/list', function(req, res, next) {
    console.log("Loading Regions.")
    axios({
        method: 'GET',
        url: process.env.API_URL + '/region/all',
        responseType: 'json'
    }).then(function(response) {
        // handle success
        console.log(response.data);
        res.render('admin/region/list', { title: "INDEX", layout: "admin", regions: response.data })
    }).catch(function(error) {
        // handle error
        throw error;
    });
});

/* Add new winery page. */
router.post('/new', function(req, res, next) {
    var Body = {
        name: req.body.name,
        description: req.body.description,
        country: req.body.country
    }

    axios({
        method: "POST",
        url: process.env.API_URL + "/region/new",
        data: Body
    }).then(winery => {
        res.redirect("list");
    }).catch(err => {
        throw err;
    })
});
module.exports = router;