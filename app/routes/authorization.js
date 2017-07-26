// Constructor
"use strict";
/*
 * GET home page.
 */

// var Constants = require('../../config/constants');

module.exports = function(passport) {

    var authorization = {};


    authorization.logout = function(req, res) {
        console.log("logout");
        var user = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            req.logout();
            req.session.destroy();
            res.redirect('/');
        });
    };

    authorization.login = function(req, res) {
        res.render('login', {
            message: req.flash('loginMessage')
        });
    };




    //twitter
    authorization.authTwitter = passport.authenticate('twitter', {
        scope: 'email'
    });

    authorization.authTwitterCallBack = passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/'
    });

    authorization.connectTwitter = passport.authorize('twitter', {
        scope: 'email'
    });

    authorization.connectTwitterCallBack = passport.authorize('twitter', {
        successRedirect: '/',
        failureRedirect: '/'
    });

    authorization.unlinkTwitter = function(req, res) {
        var user = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    };


    return authorization;
};