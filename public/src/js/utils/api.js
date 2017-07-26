(function($) { // reset V17e's noConflict
    'use strict';

    window.WB = window.WB || {};
    WB.app = WB.app || {};


    WB.app.Api = function() {};

    WB.app.Api.prototype = {};


    //SEARCH//////////////////////
    WB.app.Api.getMarkerInfo = function(pid, callBack) {
        var obj = {
            pinId: pid
        };

        WB.app.Utils.getData('/api/getPinInfo', 'POST', obj, function(response) {
            console.log(response);
            callBack(response);

        });
    };

    WB.app.Api.getMyPins = function(hash, callBack) {
        var obj = {
            hash: hash
        };

        WB.app.Utils.getData('/api/getMyPins', 'POST', obj, function(response) {

            if (!response.error) {
                callBack(response);
            } else {
                alert("error getting my pins");
            }

        });
    };

    WB.app.Api.getUserPins = function(uid, callBack) {

        var obj = {
            uid: uid
        };

        WB.app.Utils.getData('/api/getUserPins', 'POST', obj, function(response) {

            callBack(response);

        });
    };

    WB.app.Api.getNewPins = function(hash, bounds, callBack) {

        var obj = {
            hash: hash,
            bounds: bounds
        };


        WB.app.Utils.getData('/api/getNewPins', 'POST', obj, function(response) {

            if (response.status != "error") {
                callBack(response);

            } else {
                alert(response.message);
            }
        });
    };

    //COMMENTS///////////////////
    WB.app.Api.addComment = function(obj, callBack) {
        WB.app.Utils.getData('/api/addComment', 'POST', obj, function(response) {
            if (!response.error) {
                callBack(response);
            } else {
                alert("error adding comment");
            }

        });
    };

    WB.app.Api.removeComment = function(obj, callBack) {
        WB.app.Utils.getData('/api/removeComment', 'POST', obj, function(response) {
            console.log(response);

            if (response.status == "success") {
                callBack(response.cId);
            } else {
                alert("error removing comment");
            }
        });
    };

    //PINS/////////////////////////
    WB.app.Api.removePin = function(obj, callBack) {
        var self = this;
        WB.app.Utils.getData('/api/removePin', 'POST', obj, function(response) {
            console.log(response);
            if (response.status == "success") {
                callBack(response.pId);
            } else {
                alert("error removing pin");
            }
        });
    };

    WB.app.Api.savePin = function(props, callBack) {
        var obj = {
            address: props.address,
            lat: props.lat,
            lng: props.lng,
            hash: props.hash,
            title: props.title

        };
        WB.app.Utils.getData('/api/savePin', 'POST', obj, function(response) {
            console.log(response);
            if (response.status == "success") {
                callBack(response.id);
            } else {
                alert("error saving pin");
            }

        });
    };

    WB.app.Api.getPinsByHash = function(hash, callBack) {
        var obj = {
            hash: hash
        };

        WB.app.Utils.getData('/api/getPinsByHash', 'POST', obj, function(response) {
            console.log(response)
            if (!response.error) {
                callBack(response);
            } else {
                alert("error getting pins");
            }

        });
    };
    WB.app.Api.getShortURL = function(url, callBack) {
        console.log(url);
        var obj = {
            url: url
        };

        WB.app.Utils.getData('/api/getShortURL', 'POST', obj, function(response) {
            if (response.status == "error") {
                alert(response.message);
            } else {
                callBack(response);
                
            }

        });
    };


}(jQuery));
