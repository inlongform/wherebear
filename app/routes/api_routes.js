// Constructor
"use strict";

var events = require('events');
var Constants = require('../../config/constants');
var Utils = require('./../utils/utils');

module.exports = function(queries, emitter) {

    var api_routes = {};
    var _queries = queries;
    var _eventEmitter = emitter;

    api_routes.checkLogin = function(req, res) {

        res.setHeader('Content-Type', 'application/json');
        var obj = {
            authenticated: req.isAuthenticated()
        };

        // _queries.addHash();
        //just to add stuff
        // _queries.savePin(req.body);

        // if(req.isAuthenticated()){
        //     var item = {
        //         title: "Galápagos Islands",
        //         lat: -0.3839047,
        //         lng: -90.4513683,
        //         address: "Galápagos Islands, Ecuador",
        //         user_id: req.user._id,
        //         hash: ["galapagos", "darwin", "evolution"]
        //     }
        //     _queries.savePin(req.user, item);
        // }
        res.end(JSON.stringify(obj));


    };

    api_routes.getNewPins = function(req, res) {
        var evt = Constants.GET_NEWPINS_COMPLETE;
        res.setHeader('Content-Type', 'application/json');

        var complete = function(data) {
            // console.log(data)
            
            res.end(JSON.stringify(data));
            _eventEmitter.removeListener(evt, complete);
        };
        _eventEmitter.once(evt, complete);
        _queries.getNewPins(req.body);

    };

    api_routes.getUserPins = function(req, res) {

        var evt = Constants.GET_USER_PINS_COMPLETE;
        res.setHeader('Content-Type', 'application/json');
        var uid = req.body.uid;


        var complete = function(data) {
            if(!data.status != "error"){
                data.locations.forEach(function(item){
                    var nDate = new Date(item.created_time);
                    item.nDate = nDate.toDateString();
                })
                data.user.isAuth= req.isAuthenticated();
                data.user.isMe = Utils.isMe(uid, req.user);
            }
            res.end(JSON.stringify(data));
            _eventEmitter.removeListener(evt, complete);

        };

        _eventEmitter.once(evt, complete);
        _queries.getUserPins(uid);

    };

    api_routes.getMyPins = function(req, res) {
        var evt = Constants.GET_PINS_COMPLETE;
        res.setHeader('Content-Type', 'application/json');


        var complete = function(data) {

            var locations = {};

            if (!data.status != "error") {

                data.forEach(function(item) {
                    var nDate = new Date(item.created_time);
                    item.nDate = nDate.toDateString();
                });
                locations = {
                    locations: data,
                    user : {

                        user_id: req.user._id,
                        imageURL: req.user.twitter.imageURL,
                        username: req.user.twitter.username,
                        isMe: true
                    }
                };

                res.end(JSON.stringify(locations));
            }else{
                es.end(JSON.stringify(data));
            }


            _eventEmitter.removeListener(evt, complete);

        };

        _eventEmitter.once(evt, complete);
        _queries.getMyPins(req.user, req.body.hash);

    };

    api_routes.getPinsByHash = function(req, res) {
        var evt = Constants.GET_PINS_BY_HASH;
        res.setHeader('Content-Type', 'application/json');
        console.log(req.body.hash)

        var complete = function(data) {
            res.end(JSON.stringify(data));
            _eventEmitter.removeListener(evt, complete);

        };

        _eventEmitter.once(evt, complete);
        _queries.getPinsByHash(req.body.hash, ((req.user)?req.user._id:null));
    };


    api_routes.savePin = function(req, res) {
        var evt = Constants.SAVE_PIN_COMPLETE;
        console.log("save pin");
        console.log(req.body);


        var complete = function(status) {
            res.setHeader('Content-Type', 'application/json');
            console.log(status);
            res.end(JSON.stringify(status));
            _eventEmitter.removeListener(evt, complete);

        };

        _eventEmitter.once(evt, complete);
        _queries.savePin(req.user, req.body);


    };

    api_routes.getPinInfo = function(req, res) {

        var evt = Constants.GET_PININFO_COMPLETE;
        var pinId = req.body.pinId;
        var reqUser = ((req.isAuthenticated()) ? req.user._id : null);

        var complete = function(data) {
            res.setHeader('Content-Type', 'application/json');
            var nDate = new Date(data.location.created_time);
            data.location.nDate = nDate.toDateString();
            data.location.imageURL = data.user.twitter.imageURL;
            data.location.username = data.user.twitter.username;
            var obj = {
                location: data.location,
                isMe: ((req.isAuthenticated() && req.user._id == data.location.user_id) ? true : false),
                comments: data.comments,
                isAuth: req.isAuthenticated()
            };
            res.end(JSON.stringify(obj));
            _eventEmitter.removeListener(evt, complete);

        };

        _eventEmitter.once(evt, complete);
        _queries.getLocationInfo(pinId, reqUser);


    };


    api_routes.addComment = function(req, res) {
        var evt = Constants.ADD_COMMENT_COMPLETE;

        var complete = function(data) {
            res.setHeader('Content-Type', 'application/json');
            var nDate = new Date(data.created_time);
            var obj = {
                comment: data.comment,
                user_id: req.user._id,
                username: req.user.twitter.username,
                imageURL: req.user.twitter.imageURL,
                created_time: data.created_time,
                nDate: nDate.toDateString(),
                timeSince: Utils.timeSince(data.created_time),
                isMe: true,
                pId: req.body.pId,
                cId: data._id,
            };


            res.end(JSON.stringify(obj));
        };
        _eventEmitter.once(evt, complete);
        _queries.addComment(req.user, req.body);

    };

    api_routes.removeComment = function(req, res) {
        var evt = Constants.REMOVE_COMMENT_COMPLETE;
        console.log(req.body);
        var complete = function(status) {
            res.setHeader('Content-Type', 'application/json');
            console.log(status);

            res.end(JSON.stringify(status));
        };

        _eventEmitter.once(evt, complete);
        _queries.deleteComment(req.body);
    };

    api_routes.removePin = function(req, res) {
        var evt = Constants.REMOVE_PIN_COMPLETE;

        var complete = function(status) {
            res.setHeader('Content-Type', 'application/json');
            console.log(status);

            res.end(JSON.stringify(status));
        };
        console.log(req.body);
        _eventEmitter.once(evt, complete);
        _queries.deletePin(req.body.pinId, req.user);

    };

    api_routes.getShortURL = function(req, res) {
        console.log(req.body.url);
        Utils.getShortURL(req.body.url, function(response) {
            res.setHeader('Content-Type', 'application/json');


            res.end(JSON.stringify(response));
        });
    };

    api_routes.addFollowing = function(req, res) {


    };

    api_routes.removeFollowing = function(req, res) {


    };

    return api_routes;
};
