var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars')
var multer = require("multer")
var country_codes = require("./countries.json")

require('dotenv').config();

var adminWineryController = require('./controllers/admin/winery');
var adminRegionController = require('./controllers/admin/region');
var adminWineController = require('./controllers/admin/wine');
var adminController = require('./controllers/admin');
var adminBookingController = require('./controllers/admin/booking')
var s3Controller = require('./controllers/s3/handler');
var app = express();

var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        CountryResolve: function(value, options) {
            return country_codes[value]
        },
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

// view engine setup
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({ dest: './uploads/' }).any());

app.use('/admin', adminController);
app.use('/admin/winery', adminWineryController);
app.use('/admin/region', adminRegionController);
app.use('/admin/wine', adminWineController);
app.use('/admin/booking', adminBookingController);
app.use('/s3', s3Controller);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;