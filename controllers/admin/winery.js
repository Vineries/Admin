var express = require('express');
var axios = require('axios');
var aws = require('aws-sdk');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("Loading Wineries.")
    axios({
        method: 'GET',
        url: process.env.API_URL + '/winery/all',
        responseType: 'json'
    }).then(function(response) {
        // handle success
        res.render('admin/winery/list', { title: "INDEX", layout: "admin", winery_data: response.data })
    }).catch(function(error) {
        // handle error
        console.log(error);
    });
});
/* GET home page. */
router.get('/list', function(req, res, next) {
    console.log("Loading Wineries.")
    axios({
        method: 'GET',
        url: process.env.API_URL + '/winery/all',
        responseType: 'json'
    }).then(function(response) {
        // handle success
        res.render('admin/winery/list', { title: "INDEX", layout: "admin", winery_data: response.data })
    }).catch(function(error) {
        // handle error
        console.log(error);
    });
});

/* Add new winery page. */
router.post('/image', function(req, res, next) {
    console.log(req);
    res.send(JSON.stringify({ success: true }));
});

/* Add new winery page. */
router.get('/new', function(req, res, next) {
    axios({
        method: 'GET',
        url: process.env.API_URL + '/region/all',
        responseType: 'json'
    }).then(function(response) {
        // handle success
        console.log(response.data)
        res.render('admin/winery/new-v2', { title: "INDEX", layout: "admin", regions: response.data })
    }).catch(function(error) {
        // handle error
        throw error;
    });
});

/* Add new winery page. */
router.get('/:id/addImages', function(req, res, next) {
    axios({
        method: 'GET',
        url: process.env.API_URL + '/region/all',
        responseType: 'json'
    }).then(function(response) {
        // handle success
        console.log(response.data)
        res.render('admin/winery/new-step2', { title: "INDEX", layout: "admin", regions: response.data })
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
        address1: req.body.address1,
        address2: req.body.address2,
        email: req.body.email,
        phone: req.body.phone,
        website: req.body.website,
        country: req.body.country,
        province: req.body.province,
        postal: req.body.postal,
        region: req.body.region,
        reservations: (req.body.reservations == "on"),
        menu: (req.body.menu == "on"),
        thumbnail: req.files[0].filename || "",
        photos: req.files.map(x => x.filename),
        lat: req.body.lat || 45.4215,
        lng: req.body.lng || 75.6972
    }

    req.files.forEach(file => {
        var stream = fs.readFileSync(file.destination + file.filename, null);
        var params = { Bucket: 'vineries', Key: file.filename, Body: stream };
        s3.upload(params, function(err, data) {
            if (err) console.error("Error uploading image: " + err);
        });
    });

    axios({
            url: process.env.API_URL + '/winery/new',
            method: "POST",
            data: Body,
            responseType: 'json'
        })
        .then(wineryId => {
            res.redirect(`${wineryId}/addImages`);
        }).catch(function(error) {
            // handle error
            throw error;
        });
});

/* Add new winery page. */
router.get('/:id', function(req, res, next) {
    const _id = req.params.id;
    console.log(req.params.id);
    if (_id == undefined) {
        res.sendStatus(500)
        res.end();
    }

    axios({
        method: "GET",
        url: process.env.API_URL + "/winery/" + _id
    }).then(winery => {
        console.log("Loading Regions.")
        axios({
            method: 'GET',
            url: process.env.API_URL + '/wine/all',
            responseType: 'json'
        }).then(function(wines) {
            // handle success
            console.log(winery.data[0]);
            res.render('admin/winery/view', { title: "INDEX", layout: "admin", to_edit: winery.data[0], regions: wines.data })
        }).catch(function(error) {
            // handle error
            throw error;
        });
    }).catch(err => {
        throw err;
    })
});


/* Add new winery page. */
router.post('/addWine', function(req, res, next) {
    console.log(req);
    axios({
        url: process.env.API_URL + '/winery/addWine/' + req.body.winery + "/" + req.body.wine,
        method: "PUT",
    }).then(wineryId => {
        res.sendStatus(200);
    }).catch(function(error) {
        res.end(error);
    });
});

module.exports = router;