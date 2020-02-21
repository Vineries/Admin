// Group bookings by winery and return the booking groups for list

// Fetch wineries and accounts in order to create a new booking
// Validate users and wineries in the backend?

const express = require('express');
const axios = require('axios');
const router = express.Router();

/* Add new winery page. */
router.get('/new', function(req, res, next) {
    res.render('admin/booking/new', { title: "INDEX", layout: "admin" })
});

/* Add new winery page. */
router.get('/', function(req, res, next) {
    axios({
        method: 'GET',
        url: process.env.API_URL + '/booking/all',
        responseType: 'json'
    }).then(function(response) {
        // handle success
        console.log(response.data);
        res.render('admin/booking/list', { title: "INDEX", layout: "admin", winery: response.data })
    }).catch(function(error) {
        // handle error
        throw error;
    });
});
/* Add new winery page. */
router.get('/list', function(req, res, next) {
    axios({
        method: 'GET',
        url: process.env.API_URL + '/booking/all',
        responseType: 'json'
    }).then(function(response) {
        // handle success
        console.log(response.data);
        res.render('admin/booking/list', { title: "INDEX", layout: "admin", winery: response.data })
    }).catch(function(error) {
        // handle error
        throw error;
    });
});

/* Add new winery page. */
router.get('/new', function(req, res, next) {

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