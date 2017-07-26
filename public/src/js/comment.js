(function($) { // reset V17e's noConflict
    'use strict';

    window.WB = window.WB || {};
    WB.app = WB.app || {};


    WB.app.Comment = function(wrap, obj) {

        this.init(wrap, obj);
    };

    WB.app.Comment.prototype = {
        init: function(wrap, obj) {
            this.cId   = obj.cId;
            this.uId   = obj.user_id;
            this.pId   = obj.pId;
            this.title = obj.comment;
            this.wrap  = $(wrap);
            var self   = this;


            $("a.remove-comment", wrap).click(function(event) {
                event.preventDefault();
                var obj = {
                    cId: self.cId,
                    uId: self.uId,
                    pId: self.pId,
                    title: self.title
                };
                $("body").trigger(WB.CONSTANTS.REMOVE_COMMENT, obj);
            });


        },

        removeComment: function() {
            this.wrap.fadeOut(300, function() {

                this.remove();
            });

        },

        getComment: function() {
            return this.title;
        },

        getCID: function() {
            return this.cId;
        },

        getUID: function() {
            return this.uId;
        },

        getPID: function() {
            return this.pId;
        }




    };


}(jQuery));
