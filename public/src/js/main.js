(function($) { // reset V17e's noConflict
    'use strict';

    window.WB = window.WB || {};
    WB.app = WB.app || {};

    WB.app.Main = function(cat) {

        console.log(this);
        var self = this;
        this.isOpen = false;
        var page = $("body").attr("class");
        console.log(page);
        if (page == "home") {
            var home = new WB.app.Home();
            
        } else if (page == "profile") {
            // var profile = new WB.app.Pofile();
            // profile.init();
        }

   
        this.init();
    };

    WB.app.Main.prototype = {
        init: function() {
            var self = this;
            this.config();


        },

        config: function(){
            
        },

    };


    $(function() {
        new WB.app.Main();
    });


}(jQuery));
