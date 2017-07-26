(function($) { // reset V17e's noConflict
    'use strict';

    window.WB = window.WB || {};
    WB.app = WB.app || {};

    WB.app.Map = function() {
        var self = this;

        this.DEFAULT_LAT = 40.7237653;
        this.DEFAULT_LNG = -73.9942829;
        this.DEFAULT_ZOOM = 13;
        this.map = {};
        this.markers = [];
        this.bounds = {};
        this.droppedMarker = {};
        this.mapCanvas = document.getElementById("map-canvas");
        this.timeout = {};

        console.log(this.mapCanvas)


        google.maps.event.addDomListener(window, 'load', function() {
            self.init();
        });

    };

    WB.app.Map.prototype = {
        init: function() {

            var self = this;

        },

        getGeoLoc: function() {
            var self = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    self.configMap(pos);
                    // self.showLocation(pos);
                    var address = WB.app.MapUtils.geocodeLatLng(pos, function(address) {
                        //latlng, address, title, isAdd, isUser, id
                        self.createMarker(pos, address, "My Location", false, true, null);
                    });

                }, function() {
                    self.handleNoGeolocation(true);
                });
            } else {
                // Browser doesn't support Geolocation
                self.handleNoGeolocation(false);
            }

        },

        //get location from cross mark button
        getMyLocationInfo: function() {
            var self = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    self.map.panTo(pos);
                    self.map.setZoom(13);
                    self.clearMarkers();
                    // var bounds = self.map.getBounds();
                    var obj = {
                        bounds: WB.app.MapUtils.convertBounds(self.map.getBounds()),
                        zoom: self.map.getZoom()
                    }
                    $("body").trigger(WB.CONSTANTS.MAP_BOUNDS_CHANGED, obj);

                    //new search within current bounds

                }, function() {
                    alert("cant find your location")
                });
            } else {
                alert("cant find your location")
            }
        },


        setSingleLocation: function(data) {
            console.log("set single location")
            var bounds = new google.maps.LatLngBounds();
            this.clearMarkers();
            var latlng = new google.maps.LatLng(data.lat, data.lng);
            this.createMarker(latlng, data.address, data.title, false, false, data._id);
            this.map.panTo(latlng);
            this.map.setZoom(15);
        },

        panMapToBounds: function(bounds, zoom) {
            console.log(bounds, zoom);

            var nBounds = WB.app.MapUtils.setBounds(bounds);
            this.map.panTo(nBounds.getCenter());
            this.map.setZoom(zoom);
        },



        setLocations: function(data, bounds, zoom) {
            console.log("setLocations")
                // console.log(bounds)
            var self = this;
            var nBounds = new google.maps.LatLngBounds();
            if (bounds) {
                nBounds = WB.app.MapUtils.setBounds(bounds);
            }
            // console.log(data);
            // var bounds = new google.maps.LatLngBounds();

            this.clearMarkers();

            // this.clearAllMarkers();

            $.each(data, function(index, val) {

                var latlng = new google.maps.LatLng(val.lat, val.lng);
                nBounds.extend(latlng);

                //latlng, address, title, isAdd, isUser
                self.createMarker(latlng, val.address, val.title, false, false, val._id);

            });
            self.map.fitBounds(nBounds);
            self.map.panToBounds(nBounds);
            if (bounds) {

                this.map.setZoom(zoom);
            }

            // self.getMarkers();
        },



        configMap: function(pos) {
            var self = this;
            var options = WB.app.MapUtils.getMapOptions(pos);
            console.log("config map");

            this.map = new google.maps.Map(document.getElementById('map-canvas'), options);


            var hasLoaded = false;

            google.maps.event.addListener(this.map, 'idle', function() {
                //map ready
                if (!hasLoaded) {
                    var sBox = document.getElementById('location-field');
                    var autocomplete = new google.maps.places.Autocomplete(sBox, {
                        types: ['(regions)']
                    });
                    // autocomplete.addListener('places_changed', function() {
                    //     console.log(autocomplete.getPlace())
                    // });
                    $("body").trigger(WB.CONSTANTS.MAP_READY);
                    self.addMapListeners();
                    hasLoaded = true;
                }

            });




        },

        addMapListeners: function() {
            var self = this;
            // google.maps.event.addListener(this.map, 'bounds_changed', function() {


            // })


            google.maps.event.addListener(this.map, 'dragend', function() {

                self.checkDroppedPinLocation();
                self.mapMoved();

            })

            //userzoom
            this.mapCanvas.addEventListener('mousewheel', function(e) {
                self.MouseWheelHandler(e)
            }, true);
            this.mapCanvas.addEventListener('DOMMouseScroll', function(e) {
                self.MouseWheelHandler(e)
            }, true);
            // google.maps.event.addListener(this.map, 'zoom_changed', function(e) {
            // });

            google.maps.event.addDomListener(window, "resize", function() {
                var center = self.map.getCenter();
                google.maps.event.trigger(self.map, "resize");
                self.map.setCenter(center);
            });

        },

        MouseWheelHandler: function(e) {
            var self = this;
            var e = window.event || e; // old IE support
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            window.clearTimeout(this.timeout);
            this.timeout = window.setTimeout(function() {
                self.mapMoved();
                console.log("zoom_changed", self.map.getZoom())

            }, 500);
        },

        //////////this is acting funny // fix later
        mapMoved: function() {

            return;
            var obj = {
                bounds: WB.app.MapUtils.convertBounds(this.map.getBounds()),
                zoom: this.map.getZoom()
            }
            $("body").trigger(WB.CONSTANTS.MAP_BOUNDS_CHANGED, obj);
        },

        checkDroppedPinLocation: function() {
            if (!$.isEmptyObject(this.droppedMarker)) {
                //is the dropped marker visible on the map
                var marker = this.droppedMarker.getMarker();
                var isVisible = this.map.getBounds().contains(marker.getPosition());
                if (!isVisible) {
                    var mapCenter = this.map.getCenter();
                    marker.setPosition(mapCenter);
                }
            }
        },

        setDroppedPin: function() {
            this.droppedMarker = {};
        },


        // showLocation: function(latlng) {
        //     console.log("showLocation");
        //     var self = this;
        //     var address = WB.app.MapUtils.geocodeLatLng(latlng, function(address) {
        //         //atlng, address, isDrop, title, isAdd
        //         self.createMarker(latlng, address, address, true, true, null);
        //     });
        // },




        createMarker: function(latlng, address, title, isAdd, isUser, id) {
            //map, latlng, address, title, isAdd, isUser, id
            var marker = new WB.app.Marker(this.map, latlng, address, title, isAdd, isUser, id);
            this.markers.push(marker);

        },

        dropPin: function() {
            console.log("dropPin")
                //latlng, address, title, isAdd, isUser, id
            this.createMarker(this.map.getCenter(), "", "dropped pin", true, false, null);
            this.droppedMarker = this.markers[this.markers.length - 1];
            console.log(this.droppedMarker);
        },

        handleNoGeolocation: function(errorFlag) {
            console.log("handleNoGeolocation");
            var content = "";
            if (errorFlag) {
                content = 'Error: The Geolocation service failed.';
            } else {
                content = 'Error: Your browser doesn\'t support geolocation.';
            }
            //new YROK city

            var pos = new google.maps.LatLng(this.DEFAULT_LAT, this.DEFAULT_LNG);
            this.configMap(pos);

            this.map.setZoom(this.DEFAULT_ZOOM);

        },

        // clearAllMarkers: function() {
        //     if (this.markers.length > 0) {
        //         $.each(this.markers, function(index, val) {

        //             //dont remove the user marker
        //             // if (!val.getIsUser()) {
        //             val.getMarker().setMap(null);
        //             // } else {
        //             //     userMarker = val;
        //             // }


        //         });
        //         this.markers = [];
        //     }
        // },

        clearMarkers: function() {
            var self = this;
            var userMarker;
            if (this.markers.length > 0) {
                $.each(this.markers, function(index, val) {

                    //dont remove the user marker
                    if (!val.getIsUser()) {
                        val.getMarker().setMap(null);
                    } else {
                        userMarker = val;
                    }


                });
                this.markers = [userMarker];
            }
        },

        closeMarkerInfo: function() {
            var self = this;
            $.each(this.markers, function(index, val) {
                this.closeInfo();
            });
        },

        // updateMap: function(obj) {
        //     this.clearMarkers();
        //     // this.closeMarkerInfo();
        //     var pos = new google.maps.LatLng(obj.location.lat, obj.location.lng);

        //     this.map.panTo(pos);
        //     // latlng, address, title, isAdd, isUser, id
        //     this.createMarker(pos, obj.formatted, obj.formatted, true, true, null);

        // },

        //for testing
        getMarkers: function() {
            $.each(this.markers, function(index, val) {
                console.log(val)

            });
        },

        deleteMarker: function(pId) {
            var self = this;
            $.each(this.markers, function(index, val) {
                if (val.getId() == pId) {
                    val.getMarker().setMap(null);
                    self.markers.splice(index, 1);
                    return false;
                }
            });
        },


        getMap: function() {
            return this.map;
        },

        toggleMarkerOpacity: function(pId) {
            this.resetMarkerOpacity(null);
            this.markers.forEach(function(item) {
                // console.log(item)
                // console.log(item.getId())
                if (item.getId() != pId) {
                    item.setOpacity(false);
                    console.log("this is the one")
                    console.log(item)
                } else {
                    item.setSelectedIcon();
                }
            })

        },

        resetMarkerOpacity: function() {
            this.markers.forEach(function(item) {
                item.setOpacity(true);
            })
        },

        setNewBounds: function(location, zoom, func) {
            var self = this;
            var pos = new google.maps.LatLng(location.lat, location.lng);
            var bounds = new google.maps.LatLngBounds();

            this.map.panTo(pos);
            this.map.setZoom(zoom);
            google.maps.event.addListenerOnce(this.map, 'idle', function() {
                console.log('this logs after the panTo finishes.');

                var nBounds = WB.app.MapUtils.convertBounds(this.getBounds())

                func(nBounds)
            });


        }

    };


}(jQuery));
