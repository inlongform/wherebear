(function($) { // reset V17e's noConflict
    'use strict';

    window.WB = window.WB || {};
    WB.app = WB.app || {};

    WB.app.Social = function(wrapper, data) {

        this.init(wrapper, data);

    };

    WB.app.Social.prototype = {
        init: function(wrapper, data) {
            var self = this;
            var shareURL = {};
            var wrapper = $(wrapper);
            if(!data){
                //share hash
                shareURL.url = document.location.href;
            }else if(data.location){
                //share location
                shareURL = WB.app.Utils.checkShareUrl("pid", data.location._id);
            }else{
                //share user

                shareURL = WB.app.Utils.checkShareUrl("uid", data.user.user_id);
            }


            $(".share-twitter", wrapper).click(function(event) {
                event.preventDefault();
                var obj = shareURL;
                obj.service = "tw";

                $("body").trigger(WB.CONSTANTS.SHARE_URL, obj);

            });

            $(".share-facebook", wrapper).click(function(event) {
                /* Act on the event */
                event.preventDefault();
                var obj = shareURL;
                obj.service = "fb";
                $("body").trigger(WB.CONSTANTS.SHARE_URL, obj);
                console.log(this)
            });

            $(".add-follow", wrapper).click(function(event){
                event.preventDefault();
                alert("follow user # " + uid)
            })

        }
    };


}(jQuery));
