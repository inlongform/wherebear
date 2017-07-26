// load all the things we need


var TwitterStrategy = require('passport-twitter').Strategy;
var Utils = require("../app/utils/utils");




// load up the user model
var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {


    configAuth = configAuth.auth();


    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });




    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================

    // =========================================================================
    // GOOGLE ================================================================
    // =========================================================================


    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

            consumerKey: configAuth.twitterAuth.consumerKey,
            consumerSecret: configAuth.twitterAuth.consumerSecret,
            callbackURL: configAuth.twitterAuth.callbackURL,
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function(req, token, tokenSecret, profile, done) {
            console.log("got here")

            // asynchronous
            process.nextTick(function() {
                // console.log(req)
                // check if the user is already logged in
                if (!req.user) {

                    console.log(profile)
                    User.findOne({
                        'twitter.id': profile.id
                    }, function(err, user) {
                        if (err)
                            return done(err);
                        if (user) {
                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.twitter.token) {
                                user.twitter.id = profile.id;
                                user.twitter.location = profile._json.location;
                                user.twitter.username = profile.username;
                                user.twitter.displayName = profile.displayName;
                                user.twitter.imageURL = Utils.newProfileImgUrl(profile._json.profile_image_url);
                                user.twitter.token = token;
                                user.twitter.tokenSecret = tokenSecret;
                                user.save(function(err) {
                                    if (err)
                                        throw err;
                                    return done(null, user);
                                });
                            }
                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user, create them
                            console.log("there is no user")
                            var newUser = new User();
                            newUser.twitter.id = profile.id;
                            newUser.twitter.location = profile._json.location;
                            newUser.twitter.username = profile.username;
                            newUser.twitter.displayName = profile.displayName;
                            newUser.twitter.imageURL = Utils.newProfileImgUrl(profile._json.profile_image_url);
                            newUser.twitter.token = token;
                            newUser.twitter.tokenSecret = tokenSecret;
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session
                    user.twitter.id = profile.id;
                    user.twitter.location = profile._json.location;
                    user.twitter.username = profile.username;
                    user.twitter.displayName = profile.displayName;
                    user.twitter.imageURL = Utils.newProfileImgUrl(profile._json.profile_image_url);
                    user.twitter.token = token;
                    user.twitter.tokenSecret = tokenSecret;

                    user.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }

            });

        }));


};
