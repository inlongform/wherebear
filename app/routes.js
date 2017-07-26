"use strict";
var Utils = require('./utils/utils');
var Queries = require('./queries');
var Events = require('events').EventEmitter;

module.exports = function(app, passport) {

    var _eventEmitter = new Events();
    var _queries = new Queries(_eventEmitter);
    var _authorization = require("./routes/authorization")(passport);
    var _get_routes = require("./routes/get_routes")(_queries, _eventEmitter);
    var _api_routes = require("./routes/api_routes")(_queries, _eventEmitter);


    // GET ROUTES --------------------------------
    app.get('/', _get_routes.index);

    // app.get("/profile", Utils.isLoggedIn, _get_routes.profile);

    app.get('/logout', _authorization.logout);

    // app.get('/location/:pinId', _get_routes.locationInfo);

    // app.get('/search/:hash', _get_routes.searchHash);

    // app.get('/user/:uid', _get_routes.searchUser);

    // AUTH GET ROUTES --------------------------------

    // TWITTER --------------------------------

    // send to twitter to do the authentication
    app.get('/auth/twitter', _authorization.authTwitter);
    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback', _authorization.authTwitterCallBack);
    app.get('/connect/twitter', _authorization.connectTwitter);
    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback', _authorization.connectTwitterCallBack);

    // AUTH GET ROUTES --------------------------------

    //api routes
    app.post('/api/getPinInfo', _api_routes.getPinInfo);
    app.post('/api/savePin', _api_routes.savePin);
    app.post('/api/getUserPins', _api_routes.getUserPins);
    app.post('/api/getNewPins', _api_routes.getNewPins);
    app.get('/api/checkLogin', _api_routes.checkLogin);
    app.post('/api/addComment', _api_routes.addComment);
    app.post('/api/removeComment', _api_routes.removeComment);
    app.post('/api/removePin', _api_routes.removePin);
    app.post('/api/getMyPins', _api_routes.getMyPins);
    app.post('/api/getPinsByHash', _api_routes.getPinsByHash);
    app.post('/api/getShortURL', _api_routes.getShortURL);



        //404 redirect
    app.all("*", function(req, res) {
        res.redirect("/");
    });
};
