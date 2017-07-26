"use strict";
var googl = require('goo.gl');
var configAuth = require('../../config/auth');
var underscore = require('underscore');
var Constants = require('../../config/constants');

function Utils() {}

Utils.isLoggedIn = function(req, res, next) {
    console.log("is auth", req.isAuthenticated());
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
};

Utils.configTwitter = function() {
    configAuth = configAuth.auth();
    googl.setKey(configAuth.googleAuth.apiKey);
}

Utils.getShortURL = function(data, callBack) {

    var url = data.url;
    console.log(url)
    if (process.env.NODE_ENV != "production") {
        url = "http://www.google.com";
    }
    // var configAuth = configAuth.auth();
    // googl.setKey(configAuth.googleAuth.apiKey);
    googl.shorten(url)
        .then(function(shortUrl) {
            console.log(shortUrl);
            var obj = {
                url: shortUrl
            };
            callBack(obj);


        })
        .catch(function(err) {
            console.log(err);
            var obj = {
                status: "error",
                message: "cant get short url"
            };
            callBack(obj);
            console.error(err.message);
        });
};
Utils.newProfileImgUrl = function(url) {
    var newUrl = url.replace("_normal", "_bigger");
    return newUrl;
};
Utils.timeSince = function(date) {
    var nDate = Date.parse(date) / 1000;
    var seconds = Math.floor(((new Date().getTime() / 1000) - nDate)),
        interval = Math.floor(seconds / 31536000);

    if (interval > 1) return interval + "y";

    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + "m";

    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d";

    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "h";

    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + "m ";

    return Math.floor(seconds) + "s";
};


Utils.isUserAction = function(req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {

        return next();
    } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            loggedin: false
        }));
    }

    res.redirect('/');
};

Utils.createTwitterOauth = function() {

    var auth = configAuth.auth();
    var oa = new OAuth(
        "https://twitter.com/oauth/request_token",
        "https://twitter.com/oauth/access_token",
        auth.twitterAuth.consumerKey,
        auth.twitterAuth.consumerSecret,
        "1.0A",
        null,
        "HMAC-SHA1"
    );



    return oa;
};

Utils.isNegative = function(val) {
    if (Number(val) > 0) {
        return 1;
    } else {
        return -1;
    }

};

Utils.getMapBoundsParams = function(obj) {
    console.log("bounds")
    console.log(obj);
    console.log("/////////")



    var objStats = {
        swlat: Utils.isNegative(obj.southwest.lat),
        nelat: Utils.isNegative(obj.northeast.lat),
        swlng: Utils.isNegative(obj.southwest.lng),
        nelng: Utils.isNegative(obj.northeast.lng)
    }

    console.log()

    var gtlt = {
        latGt: Number(obj.southwest.lat),
        latLt: Number(obj.northeast.lat),
        lngGt: Number(obj.southwest.lng),
        lngLt: Number(obj.northeast.lng)
    };




    //SAME//////////////////
    //Math.sign(obj.southwest.lat) == 1, Math.sign(obj.northeast.lat) == 1, Math.sign(obj.southwest.lng == 1,
    // Math.sign(obj.northeast.lng) == 1)

    //Math.sign(obj.southwest.lat) == -1, Math.sign(obj.northeast.lat) == 1, Math.sign(obj.southwest.lng == 1,
    // Math.sign(obj.northeast.lng) == 1)

    //Math.sign(obj.southwest.lat) == -1, Math.sign(obj.northeast.lat) == -1, Math.sign(obj.southwest.lng == //,Math.sign(obj.northeast.lng) == 1)



    // sw: [ '-13.212661839949892', '-37.04274477092281' ],
    //   ne: [ '-31.028920383125783', '80.29123960407719' ] }
    if (objStats.swlat == -1 && objStats.nelat == -1 && objStats.swlng == -1 && objStats.nelng == 1) {
        //lat < obj.southwest.lat && lat > obj.northeast.lat
        //lng > obj.southwest.lng && lng < obj.northeast.lng
        console.log("got here")
        gtlt = {
            latGt: obj.northeast.lat,
            latLt: obj.southwest.lat,
            lngGt: obj.southwest.lng,
            lngLt: obj.northeast.lng,
        };
    }


    //SAME//////////////////
    // sw: [ '-13.212661839949892', '-37.04274477092281' ],
    //   ne: [ '-31.028920383125783', '-80.29123960407719' ] }
    if (objStats.swlat == -1 && objStats.nelat == -1 && objStats.swlng == -1 && objStats.nelng == -1) {
        //lat < obj.southwest.lat && lat > obj.northeast.lat
        //lng < obj.southwest.lng && lng > obj.northeast.lng
        console.log("got here 2")
        gtlt = {
            latGt: obj.northeast.lat,
            latLt: obj.southwest.lat,
            lngGt: obj.northeast.lng,
            lngLt: obj.southwest.lng,
        };
    }

    // sw: [ '13.212661839949892', '-37.04274477092281' ],
    //   ne: [ '-31.028920383125783', '-80.29123960407719' ] }
    if (objStats.swlat == 1 && objStats.nelat == -1 && objStats.swlng == -1 && objStats.nelng == -1) {
        //lat < obj.southwest.lat && lat > obj.northeast.lat
        //lng < obj.southwest.lng && lng > obj.northeast.lng
        console.log("got here 3")
        gtlt = {
            latGt: obj.northeast.lat,
            latLt: obj.southwest.lat,
            lngGt: obj.northeast.lng,
            lngLt: obj.southwest.lng,
        };
    }

    // sw: [ '13.212661839949892', '37.04274477092281' ],
    //   ne: [ '-31.028920383125783', '-80.29123960407719' ] }
    if (objStats.swlat == 1 && objStats.nelat == -1 && objStats.swlng == 1 && objStats.nelng == -1) {
        //lat < obj.southwest.lat && lat > obj.northeast.lat
        //lng < obj.southwest.lng && lng > obj.northeast.lng
        console.log("got here 4")
        gtlt = {
            latGt: obj.northeast.lat,
            latLt: obj.southwest.lat,
            lngGt: obj.northeast.lng,
            lngLt: obj.southwest.lng,
        };
    }

    // sw: [ '13.212661839949892', '37.04274477092281' ],
    //   ne: [ '31.028920383125783', '-80.29123960407719' ] }
    if (objStats.swlat == 1 && objStats.nelat == 1 && objStats.swlng == 1 && objStats.nelng == -1) {
        //lat > obj.southwest.lat && lat < obj.northeast.lat
        //lng < obj.southwest.lng && lng > obj.northeast.lng
        console.log("got here 5")
        gtlt = {
            latGt: obj.southwest.lat,
            latLt: obj.northeast.lat,
            lngGt: obj.northeast.lng,
            lngLt: obj.southwest.lng,
        };

//hong kong
// southwest: Object
// lat: 3.2730210109380664
// lng: 13.324725099998773
// northeast: Object
// lat: 48.29839579187635
// lng: -154.19480615000123

// lat > 3.2730210109380664 && lat < 48.29839579187635
// lng > -154.19480615000123 && lng < 13.324725099998773

// "lat": 22.35192550942798,
//     "lng": 114.17780779394525,


    }
    // sw: [ '-20.693641363061698', '16.137225099998773' ],
    // ne: [ '29.478624492564947', '-151.38230615000123' ] }
    if(objStats.swlat == -1 && objStats.neLat == 1 && objStats.swlng == 1 && objStats.nelng == -1){
        gtlt = {
            latGt: obj.southwest.lat,
            latLt: obj.northeast.lat,
            lngGt: obj.northeast.lng,
            lngLt: obj.southwest.lng,
        };
    }

    return gtlt;


};

Utils.isMe = function(uid, me){
    if(me){
        if(String(uid) === String(me._id)){
            return true;
        }
    }
    return false;
};

Utils.sortCommentsforLocation = function(users, comments, meId, locId) {

    var filteredComments = [];
    comments.forEach(function(item) {
        var obj = {
            comment: item.comment,
            user_id: item.user_id,
            created_time: item.created_time,
            nDate: new Date(item.created_time).toDateString(),
            timeSince: Utils.timeSince(item.created_time),
            cId: item._id,
            isMe: ((item.user_id == meId) ? true : false),
            imageURL: null,
            username: null,
            pId: locId
        };
        users.forEach(function(user) {
            if (item.user_id == user._id) {
                obj.imageURL = user.twitter.imageURL;
                obj.username = user.twitter.username;
            }
        });
        filteredComments.push(obj);
    });
    return filteredComments.reverse();
};

Utils.createComment = function(data) {
    var obj = {
        user_id: String,
        comment: String,
        created_time: Date,
        rating: Number
    };

    return obj;
};

Utils.createPin = function(data, id) {
    var obj = {
        created_time: new Date(),
        title: data.title,
        lat: Number(data.lat),
        lng: Number(data.lng),
        address: data.address,
        user_id: id,
        hash: data.hash

    };
    return obj;
};

Utils.formatDBPinObj = function(docs, users, uid) {
    var locations = [];
    //this is such a hack
    var nDocs = JSON.parse(JSON.stringify(docs))
    for (var i = 0; i < nDocs.length; i++) {
        var doc = nDocs[i];
        var nDate = new Date(doc.created_time);
        doc.nDate = nDate.toDateString();
        doc.timeSince = Utils.timeSince(doc.created_time);
        var obj = doc;
        locations.push(obj);
        for (var j = 0; j < users.length; j++) {
            if (doc.user_id == users[j]._id) {
                doc.username = users[j].twitter.username;
                doc.imageURL = users[j].twitter.imageURL;
                doc.user_id = users[j]._id;
                doc.isMe = ((String(users[j]._id) == String(uid))?true:false);
                break;
            }
        }
    }

    return locations;
};

module.exports = Utils;
