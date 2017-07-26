var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo/es5')(session);
var Utils = require('./app/utils/utils');
var helmet = require('helmet');
var fs = require('fs');


// var routes = require('./app/routes/index');
// var users = require('./app/routes/users');

var app = express();
//security
app.use(helmet.frameguard('deny'));
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());


var configDB = require('./config/database.js');

require('./config/passport')(passport); // pass passport for configuration

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);


app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser()).use(function(req, res, next) {
    // console.log(JSON.stringify(req.cookies));
    next();
});



mongoose.connect(configDB.dbURL());
mongoose.connection.once('open', function() {
    var sess = {
        secret: 'ilovecookies',
        cookie: { maxAge: 2 * 60 * 60 * 1000 },
        resave: true,
        key: 'sid',
        saveUninitialized: true,
        store: new MongoStore({
            url: configDB.dbURL()

        })
    }

    app.use(session(sess))
    app.use(passport.initialize());
    app.use(passport.session()); // persistent login sessions

    app.use(flash()); // use connect-flash for flash messages stored in session
    require('./app/routes.js')(app, passport);
    Utils.configTwitter();
    /// catch 404 and forwarding to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });


    /// error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
    console.log("connection open")
});





mongoose.connection.on("error", console.error.bind(console, "connection error"));

module.exports = app;
