var express = require('express');
var axios = require('axios');
var aws = require('aws-sdk');
var fs = require('fs');
var router = express.Router();

/* Add new winery page. */
router.get('/', function(req, res, next) {
    axios({
        method: 'GET',
        url: process.env.API_URL + '/wine/all',
        responseType: 'json'
    }).then(function(response) {
        // handle success
        console.log(response.data);
        res.render('admin/wine/list', { title: "INDEX", layout: "admin", wines: response.data })
    }).catch(function(error) {
        // handle error
        throw error;
    });
});
/* Add new winery page. */
router.get('/new', function(req, res, next) {
    res.render('admin/wine/new', { title: "INDEX", layout: "admin" })
});

/* Add new winery page. */
router.get('/list', function(req, res, next) {
    axios({
        method: 'GET',
        url: process.env.API_URL + '/wine/all',
        responseType: 'json'
    }).then(function(response) {
        // handle success
        console.log(response.data);
        res.render('admin/wine/list', { title: "INDEX", layout: "admin", wines: response.data })
    }).catch(function(error) {
        // handle error
        throw error;
    });
});

/* Add new winery page. */
router.post('/new', function(req, res, next) {
    var s3 = new aws.S3();
    var Body = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        thumbnail: req.files[0].filename || "",
        photos: req.files.map(x => x.filename)
    }

    req.files.forEach(file => {
        var stream = fs.readFileSync(file.destination + file.filename, null);
        var params = { Bucket: 'vineries', Key: file.filename, Body: stream };
        s3.upload(params, function(err, data) {
            if (err) console.error("Error uploading image: " + err);
        });
    });

    axios({
        method: "POST",
        url: process.env.API_URL + "/wine/new",
        data: Body
    }).then(wine_res => {
        res.redirect('/admin/wine/' + wine_res.data)
    }).catch(err => {
        res.sendStatus(500);
    })
});

/* Add new winery page. */
router.get('/:id', function(req, res, next) {
    axios({
        method: "GET",
        url: process.env.API_URL + "/wine/" + req.params.id
    }).then(wine_res => {
        res.render('admin/wine/view', { wine: wine_res.data });
    })
});

module.exports = router;