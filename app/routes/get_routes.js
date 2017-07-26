// Constructor
"use strict";
/*
 * GET home page.
 */


var Constants = require('../../config/constants');
var Utils = require('./../utils/utils');

module.exports = function(queries, emitter) {

    var get_routes = {};
    var _queries = queries;
    var _eventEmitter = emitter;


    get_routes.index = function(req, res) {


        res.render('index', {
            title: "Wherebear",
            profile: req.user,
            page: "home",
            uid: ((req.isAuthenticated())?req.user._id:null),
            isAuth: req.isAuthenticated()
        });

        //get user ip
        // var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    };

    get_routes.profile = function(req, res) {
        var evt = Constants.GET_PINS_COMPLETE;

        var complete = function(data) {
            // res.end(JSON.stringify(data));

            _eventEmitter.removeListener(evt, complete);

            for(var i = 0; i < data.location.length; i++){
                var item = data.location[i];
                var nDate = new Date(item.created_time).toDateString();
                // var nDate = Utils.timeSince(item.created_time);
                item.nDate = nDate;
            }


            res.render('profile', {
                profile: req.user,
                pins: data.location,
                title: "Wherebear " + req.user.twitter.username + " profile",
                page: "profile",
                uid: req.user._id,
                isAuth: req.isAuthenticated()
            });

        };

        _eventEmitter.once(evt, complete);
        _queries.getUserPins(req.user._id);

    };

    get_routes.locationInfo = function(req, res) {
        // req.param('pinId')
        var evt = Constants.GET_PININFO_COMPLETE;
        var pinId = req.param("pinId");
        var complete = function(data) {
            _eventEmitter.removeListener(evt, complete);
            var nDate = new Date(data.location.created_time);
            data.location.nDate = nDate.toDateString();
            res.render('locationInfo', {
                profile: req.user,
                title: "Wherebear " + data.location.title,
                page: "location",
                postUser: data.user,
                uid: data.user._id,
                location: data.location,
                comments: data.comments,
                isAuth: req.isAuthenticated()
            });

        };

        _eventEmitter.once(evt, complete);
        _queries.getLocationInfo(pinId);


    };

    get_routes.searchUser = function(req, res) {
        var userId = req.param("uid");
        var evt = Constants.GET_PINS_COMPLETE;
        var complete = function(data) {
            _eventEmitter.removeListener(evt, complete);
            for(var i = 0; i < data.location.length; i++){
                var item = data.location[i];
                var nDate = new Date(item.created_time).toDateString();
                item.nDate = nDate;
            }
            res.render('userinfo', {
                profile: req.user,
                pins: data.location,
                user: data.user,
                uid: data.user._id,
                title: "Wherebear User: " + data.user.twitter.username,
                page: "profile",
                isAuth: req.isAuthenticated()
            });

        };

        _eventEmitter.once(evt, complete);
        _queries.getUserPins(userId);
    };

    get_routes.searchHash = function(req, res) {

    };

    return get_routes;
};
