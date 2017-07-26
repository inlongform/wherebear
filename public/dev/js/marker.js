(function($) { // reset V17e's noConflict
    'use strict';

    window.WB = window.WB || {};
    WB.app = WB.app || {};


    WB.app.Marker = function(map, latlng, address, title, isAdd, isUser, id) {


        this.marker         = {};
        this.OPAQUE         = .4;
        this.infoWindow     = {};
        this.isAdd          = isAdd;
        this.title          = title;
        this.latlng         = latlng;
        this.id             = id;
        this.isUser         = isUser;
        this.selectedMarker = '/images/marker-selected.png';
        this.mainIcon       = '/images/map-marker.png';
        this.init(map, latlng, address, title, isAdd, isUser, id);
    };

    WB.app.Marker.prototype = {
        init: function(map, latlng, address, title, isAdd, isUser, id) {
            // console.log(id)
            var self = this;
            var addy = address;
            this.infoWindow = new google.maps.InfoWindow();
            var icon = this.mainIcon;
            if (isUser) {
                icon = '/images/user-map-marker.png';
            } else if (isAdd) {
                icon = '/images/new-map-marker.png';
            }


            this.marker = new google.maps.Marker({
                map: map,
                draggable: ((isAdd) ? true : false),
                animation: ((isAdd) ? google.maps.Animation.DROP : null),
                title: self.title,
                icon: icon,
                position: self.latlng
                // opacity: 0.5
            });


            var TIMEOUT = 500;
            var timer = {};

            google.maps.event.addListener(this.marker, 'mouseover', function() {
                // var marker = this;
                timer = setTimeout(function(){ 
                    self.infoWindow.setContent(self.title);
                    self.infoWindow.open(map, self.marker);
                 }, TIMEOUT);
                
            });

            // assuming you also want to hide the infowindow when user mouses-out
            google.maps.event.addListener(this.marker, 'mouseout', function() {
                clearTimeout(timer);
                self.closeInfo();
            });

            google.maps.event.addListener(this.marker, 'click', (function(m) {

                if (self.isAdd || self.isUser) {
                    this.latlng = this.position;
                    var marker = self;
                    var nlatlng = this.position;
                    WB.app.MapUtils.geocodeLatLng(this.position, function(address) {
      
                        var obj = {
                            address: address,
                            lat: nlatlng.lat(),
                            lng: nlatlng.lng(),
                            marker: marker
                        };
                        console.log(obj);
                        $("body").trigger(WB.CONSTANTS.OPEN_SAVE_PIN, obj);
                    });

                } else {
                    var obj = {
                        locId: self.id
                    };

                    $("body").trigger(WB.CONSTANTS.GET_MARKER_INFO, obj);

                    // $("body").trigger(WB.CONSTANTS.CLOSE_MARKER_INFO);

                    // var html = "<a href='/location/" + id + "' class='info'>" + self.title + "</a>";

                    // self.infoWindow.close();
                    // self.infoWindow.setContent(html);
                    // self.infoWindow.open(map, self.marker);
                    // $("a.info").click(function(event) {
                    //     event.preventDefault(); 
                    //     var obj = {
                    //         locId: self.id
                    //     };

                    //     $("body").trigger(WB.CONSTANTS.GET_MARKER_INFO, obj);

                    // });
                    // self.setBtn($(html));
                }

            }));

            google.maps.event.addListener(this.marker, 'dragstart', (function(m) {
                self.infoWindow.close();
            }));

            google.maps.event.addListener(this.marker, 'dragend', (function(m) {
                console.log(this.position);
                // WB.app.MapUtils.geocodeLatLng(this.position, function(address){
                //     addy = address;
                //     self.infoWindow.setContent(addy);
                //     self.infoWindow.open(map, self.marker);
                // });
            }));
        },

        // setBtn: function(btn){
        //     var self = this;
        //     btn.click(function(event) {
        //         event.preventDefault();
        //         console.log(self.id);
        //     });
        // },

        closeInfo: function() {
            this.infoWindow.close();
        },

        changeMarkerProps: function(title, id) {
            console.log("changeMarkerProps");
            this.marker.setDraggable(false);
            this.marker.setIcon(this.mainIcon);
            this.title = title;
            this.isAdd = false;
            this.isUser = false;
            this.id = id;
        },

        setOpacity: function(bool){
            var op = ((bool)?1:this.OPAQUE);
            this.marker.setOpacity(op);
            if(bool){
                this.marker.setIcon(this.mainIcon);
            }
        },

        setSelectedIcon: function(){
            this.marker.setIcon(this.selectedMarker);
            // var currentMarker = this.marker.getIcon();
        },


        getMarker: function() {
            return this.marker;
        },

        getId: function() {
            return this.id;
        },
        getIsUser: function() {
            return this.isUser;
        }
    };


}(jQuery));
