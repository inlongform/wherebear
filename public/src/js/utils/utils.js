(function($) { // reset V17e's noConflict
    'use strict';

    window.WB = window.WB || {};
    WB.app = WB.app || {};


    WB.app.Utils = function() {};

    WB.app.Utils.prototype = {};



    WB.app.Utils.checkLogin = function(func) {
        WB.app.Utils.getData('/api/checkLogin', 'GET', null, function(response) {
            func(response.authenticated);
        });
    };
    WB.app.Utils.checkShareUrl = function(type, id) {


        var obj = {};
        if (type == "pid") {
            obj.url = document.location.origin + "/?pid=" + id
        } else {
            obj.url = document.location.origin + "/?uid=" + id
        }

        return obj;
    };

    

    WB.app.Utils.getData = function(url, type, obj, func, eFunc) {
        $.ajax({
            type: type,
            url: url,
            data: obj,
            dataType: "json",
            success: function(data) {
                func(data);

            },
            error: function(err) {
                if (eFunc) {
                    eFunc();
                } else {
                    alert(err.status + " - " + err.statusText);
                }
            }
        });
    };

    WB.app.Utils.createTemplate = function(tempName, data) {

        var temp_prefix = "public/src/templates/";
        var template = JST[temp_prefix + tempName];
        var context = data;
        var html = template(context);

        return html;

    };

    WB.app.Utils.getTitle = function(title){
        console.log(title.indexOf("#"));
        var hashIndex = title.indexOf("#");
        if(hashIndex != -1){
            return title.substring(0, hashIndex)
        }

        return title;
    };

    WB.app.Utils.checkHash = function(tags) {

        // tags = tags.replace(/,/g, "");
        // tags = tags.replace(/#/g, "");
        // tags = tags.split(" ");
        // if (tags[0] === "") {
        //     tags.pop();
        // }
        var t = tags.match(/#\w+/g);
        var rTags = [];
        t.forEach(function(item){
            rTags.push(item.substring(1));
        })

        return rTags;
    };

    WB.app.Utils.getURLParams = function() {
        var oGetVars = new(function(sSearch) {
            if (sSearch.length > 1) {
                for (var aItKey, nKeyId = 0, aCouples = sSearch.substr(1).split("&"); nKeyId < aCouples.length; nKeyId++) {
                    aItKey = aCouples[nKeyId].split("=");
                    this[unescape(aItKey[0])] = aItKey.length > 1 ? unescape(aItKey[1]) : "";
                }
            }
        })(window.location.search);

        return oGetVars;
    };
    //Handlebars helpers
    Handlebars.registerHelper("inc", function(value, options) {
        return parseInt(value) + 1;
    });


}(jQuery));
