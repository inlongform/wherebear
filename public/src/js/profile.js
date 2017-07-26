(function($) { // reset V17e's noConflict
    'use strict';

    window.WB = window.WB || {};
    WB.app = WB.app || {};

    WB.app.Pofile = function(cat) {

        var self = this;

    };

    WB.app.Pofile.prototype = {
        init: function() {
            var self          = this;          
            this.mapContainer = $(".map");           
            this.map          = new WB.app.Map();
            this.getUserPins();

        },

        getUserPins: function(){
            //this needs to be fixed
            var self = this;
            var obj = {
                uid: $("body").data("uid")
            };
            WB.app.Utils.getData('/api/getUserPins', 'POST', obj, function(response) {
                console.log(response);
                if(response.location.length <= 0){
                    self.mapContainer.html("<h4>you dont have any saved pins</h4>");
                    console.log(self.mapContainer);
                    return;
                }
                self.map.setUserLocations(response.location);

            });

        }
    };


}(jQuery));
