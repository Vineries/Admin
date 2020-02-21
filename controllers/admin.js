var express = require('express');
var axios = require('axios');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    axios({
        method: 'GET',
        url: process.env.API_URL + '/winery/count',
        responseType: 'json'
    }).then(function(response) {
        // handle success
        res.render('admin/dashboard', { title: "INDEX", layout: "admin", counts: response.data })
    }).catch(function(error) {
        // handle error
        res.render('error', { message: error.msg })
    });
});

module.exports = router;