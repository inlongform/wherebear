"use strict";
var User = require('./models/user');
var Location = require('./models/location');
var Utils = require('./utils/utils');
var events = require('events');
var Constants = require('../config/constants');
var underscore = require('underscore');


function Queries(emitter) {

    this.emitter = emitter;


}
// Queries.prototype.addHash = function(){
//     Location.find({}, function(err, doc) {
//         if(err){
//             console.log("there was an error")
//         }else{
//             doc.forEach(function(item) {
//                 var nArray = [];
//                 item.hash.forEach(function(h){
//                     var name = h.substring(1);
//                     nArray.push(name);
//                 })
//                 item.hash = nArray;
//                 console.log(item.hash)
//                 item.save(function(err) {
//                     if(err){
//                         console.log("error saving item")
//                     }else{
//                         console.log("done")
//                     }
//                 });


//             });
//         }
//     });
// }


Queries.prototype.getNewPins = function(params) {

    var self = this;
    var hash = params.hash;
    var bounds = ((params.bounds) ? Utils.getMapBoundsParams(params.bounds) : null);
    var query = {};
    var json = {};
    // console.log(params);
    // console.log("getNewPins////////////");
    // console.log(params.bounds);


    if (bounds) {

        if (hash === "") {
            query = Location.find({
                lat: {
                    $gt: bounds.latGt,
                    $lt: bounds.latLt
                },
                lng: {
                    $gt: bounds.lngGt,
                    $lt: bounds.lngLt
                }
            });
        } else {
            query = Location.find({
                hash: hash,
                lat: {
                    $gt: bounds.latGt,
                    $lt: bounds.latLt
                },
                lng: {
                    $gt: bounds.lngGt,
                    $lt: bounds.lngLt
                }
            });
        }
    } else {
        if (hash === "") {
            query = Location.find({});
        } else {
            query = Location.find({
                hash: hash
            });
        }
    }

    query.limit(Constants.INDEX_LIMIT)
        .sort({
            created_time: -1
        })
        .exec(function(err, docs) {
            if (err) {
                json = JSON.parse(JSON.stringify({
                    status: "error",
                    message: "error getting pins"
                }));

                self.emitter.emit(Constants.GET_NEWPINS_COMPLETE, json);
                return console.log("error getting top pins");
            } else {


                var ids = underscore.pluck(docs, "user_id");

                User.find({
                    _id: {
                        $in: ids
                    }
                })

                .exec(function(err, users) {
                    if (err) {
                        json = JSON.parse(JSON.stringify({
                            status: "error",
                            message: "error getting pin user data"
                        }));
                        self.emitter.emit(Constants.GET_NEWPINS_COMPLETE, json);
                    } else {


                        var locations = Utils.formatDBPinObj(docs, users);

                        json = JSON.parse(JSON.stringify(locations));
                        self.emitter.emit(Constants.GET_NEWPINS_COMPLETE, json);

                    }
                });


            }
        });
};

Queries.prototype.getMyPins = function(user, hash) {
    var self = this;
    var query = {};
    var json = {};
    if (hash === "") {
        query = Location.find({
            _id: {
                $in: user.pins,
            },
        });
    } else {
        query = Location.find({
            _id: {
                $in: user.pins,
            },
            hash: hash
        });
    }

    query.sort({
        created_time: -1
    }).exec(function(err, docs) {
        if (err) {
            json = JSON.parse(JSON.stringify({
                status: "error",
                message: "error getting pins"
            }));
            self.emitter.emit(Constants.GET_PINS_COMPLETE, json);
            return console.log("error getting pins");
        } else {


            


            json = JSON.parse(JSON.stringify(docs));


            self.emitter.emit(Constants.GET_PINS_COMPLETE, json);
        }
    });
};

Queries.prototype.getPinsByHash = function(hash, uid) {
    console.log(hash, uid);
    var self = this;
    var json = {};
    Location.find({
        hash: hash
    }).sort({
        created_time: -1
    }).exec(function(err, docs) {
        if (err) {
            json = JSON.parse(JSON.stringify({
                status: "error",
                message: "error getting pins my hash"
            }));
            self.emitter.emit(Constants.GET_PINS_BY_HASH, json);
            return console.log("error getting hash pins");
        } else {
            var ids = underscore.pluck(docs, "user_id");
            console.log(docs)
            User.find({
                _id: {
                    $in: ids
                }
            })

            .exec(function(err, users) {
                if (err) {
                    json = JSON.parse(JSON.stringify({
                        status: "error",
                        message: "error getting hash pin user data"
                    }));
                    self.emitter.emit(Constants.GET_NEWPINS_COMPLETE, json);
                } else {


                    var locations = Utils.formatDBPinObj(docs, users, uid);

                    json = JSON.parse(JSON.stringify(locations));
                    self.emitter.emit(Constants.GET_PINS_BY_HASH, json);

                }
            });
        }
    });
};

Queries.prototype.getUserPins = function(uid) {
    // console.log(user.pins);
    var self = this;
    var json = {};
    User.findById(String(uid), function(err, userData) {
        if (err) {
            json = JSON.parse(JSON.stringify({
                status: "error",
                message: "error user pins"
            }));
            self.emitter.emit(Constants.GET_USER_PINS_COMPLETE, json);
            return console.log("error getting user pins");
        } else {

            Location.find({
                _id: {
                    $in: userData.pins
                }
            }).sort({
                created_time: -1
            }).exec(function(err, docs) {
                if (err) {
                    json = JSON.parse(JSON.stringify({
                        status: "error"
                    }));
                    self.emitter.emit(Constants.GET_USER_PINS_COMPLETE, json);
                    return console.log("error getting pins");
                } else {

                    var obj = {
                        locations: docs,
                        user: {
                            imageURL: userData.twitter.imageURL,
                            username: userData.twitter.username,
                            user_id: userData._id

                        }
                    };
                    json = JSON.parse(JSON.stringify(obj));

                    self.emitter.emit(Constants.GET_USER_PINS_COMPLETE, json);
                }
            });
        }
    });
};



//add a pin to user
Queries.prototype.savePin = function(user, obj) {


    var self = this;
    var json = {};
    var pin = Utils.createPin(obj, user._id);
    var locationItem = new Location(pin);

    locationItem.save(function(err) {
        if (err) {
            return console.log("cant save location");
        } else {
            Location.findById(locationItem, function(err, doc) {
                if (err) {
                    return console.log("cant find id");
                } else {
                    user.pins.push(doc._id);
                    user.save(function(err) {
                        if (err) {
                            json = JSON.parse(JSON.stringify({
                                status: "error",
                                message: "error saving pin"
                            }));
                            self.emitter.emit(Constants.SAVE_PIN_COMPLETE, json);
                            return console.log("error saving user");
                        } else {

                            json = JSON.parse(JSON.stringify({
                                status: "success",
                                id: doc._id
                            }));

                            self.emitter.emit(Constants.SAVE_PIN_COMPLETE, json);
                        }
                    });
                }
            });
        }
    });
};

Queries.prototype.getLocationInfo = function(pinId, meId) {
    var self = this;
    var json = {};
    //get location info
    Location.findById(String(pinId), function(err, loc) {
        if (err) {
            json = JSON.parse(JSON.stringify({
                status: "error",
                info: "location error"
            }));
            self.emitter.emit(Constants.GET_PININFO_COMPLETE, json);
        } else {
            //get location user
            User.findById(String(loc.user_id), function(err, user) {
                if (err) {
                    json = JSON.parse(JSON.stringify({
                        status: "error",
                        message: "user error"
                    }));
                    self.emitter.emit(Constants.GET_PININFO_COMPLETE, json);
                    return console.log("error getting user info");
                } else {
                    // console.log("comments", loc.comments)
                    //get comment user info
                    var ids = underscore.pluck(loc.comments, "user_id");

                    var userComments = [];
                    User.find({
                            _id: {
                                $in: ids
                            }
                        })
                        // .sort({created_time: -1})
                        .exec(function(err, users) {
                            if (err) {
                                json = JSON.parse(JSON.stringify({
                                    status: "error",
                                    message: "error getting user comments"
                                }));
                                self.emitter.emit(Constants.GET_PININFO_COMPLETE, json);
                            } else {

                                var obj = {
                                    location: loc,
                                    user: user,
                                    comments: Utils.sortCommentsforLocation(users, loc.comments, meId, loc._id)
                                };

                                json = JSON.parse(JSON.stringify(obj));
                                self.emitter.emit(Constants.GET_PININFO_COMPLETE, json);
                            }
                        });
                }
            });
        }
    });
};

Queries.prototype.getUserInfo = function(uid) {

};

Queries.prototype.addComment = function(user, data) {

    var self = this;
    var json = {};
    Location.findById(String(data.pId), function(err, doc) {
        if (err) {
            json = JSON.parse(JSON.stringify({
                status: "error",
                message: "error finding location"
            }));
            self.emitter.emit(Constants.ADD_COMMENT_COMPLETE, json);
        } else {
            var obj = {
                created_time: new Date(),
                comment: data.comment,
                user_id: user._id
            };
            doc.comments.push(obj);
            doc.save(function(err) {
                if (err) {
                    json = JSON.parse(JSON.stringify({
                        status: "save error",
                        message: "error saving location"
                    }));
                    self.emitter.emit(Constants.ADD_COMMENT_COMPLETE, json);
                } else {
                    // console.log(doc)
                    var newComment = doc.comments[doc.comments.length - 1];
                    json = JSON.parse(JSON.stringify(newComment));
                    self.emitter.emit(Constants.ADD_COMMENT_COMPLETE, json);
                }
            });
        }
    });
};

Queries.prototype.deletePin = function(pinId, user) {
    var self = this;
    var json = {};
    var obj = {};
    Location.remove({
        _id: String(pinId)
    }, function(err) {
        if (err) {
            json = JSON.parse(JSON.stringify({
                status: "remove error",
                message: "error deleting pin"
            }));
            self.emitter.emit(Constants.REMOVE_PIN_COMPLETE, json);
        } else {
            var nIndex = user.pins.indexOf(pinId);
            user.pins.splice(nIndex, 1);
            user.save(function(err) {
                if (err) {

                    obj = {
                        status: "error"
                    };

                    json = JSON.parse(JSON.stringify(obj));
                    self.emitter.emit(Constants.REMOVE_PIN_COMPLETE, json);

                    return console.error("save user pins error", err);
                } else {

                    obj = {
                        status: "success",
                        pId: pinId
                    };

                    json = JSON.parse(JSON.stringify(obj));
                    self.emitter.emit(Constants.REMOVE_PIN_COMPLETE, json);
                }
            });
        }
    });
};

Queries.prototype.deleteComment = function(options, user) {
    var self = this;
    var json = {};
    var obj = {};
    Location.findById(String(options.pId), function(err, doc) {
        if (err) {
            var obj = {
                status: "error",
                message: "error deleting comment"
            };

            json = JSON.parse(JSON.stringify(obj));
            self.emitter.emit(Constants.REMOVE_COMMENT_COMPLETE, json);

            return console.error("save user pins error", err);
        } else {
            // console.log(doc)
            var comments = doc.comments;
            for (var i = 0; i < comments.length; i++) {
                var item = comments[i];
                console.log(item._id, options.cId);
                if (item._id == options.cId) {
                    comments.splice(i, 1);
                    doc.save(function(err) {
                        if (err) {
                            obj = {
                                status: "error",
                                message: "error saving location"
                            };

                            json = JSON.parse(JSON.stringify(obj));
                            self.emitter.emit(Constants.REMOVE_COMMENT_COMPLETE, json);
                        } else {
                            obj = {
                                status: "success",
                                cId: item._id
                            };
                            json = JSON.parse(JSON.stringify(obj));
                            self.emitter.emit(Constants.REMOVE_COMMENT_COMPLETE, json);
                        }
                    });
                    break;
                }
            }
            console.log("---------------");
            console.log(comments);
        }
    });
};

Queries.prototype.ratePin = function(user) {

};



// export the class
module.exports = Queries;
