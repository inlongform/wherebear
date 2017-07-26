(function($) { // reset V17e's noConflict
    'use strict';

    window.WB = window.WB || {};
    WB.app = WB.app || {};


    WB.app.MapUtils = function() {};

    WB.app.MapUtils.prototype = {};

    WB.app.MapUtils.geocodeLatLng = function(latlng, func) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'latLng': latlng
        }, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    func(results[0].formatted_address);

                } else {
                    alert('No results found');
                }
            } else {
                alert("please drag marker to another location")
                    // alert('Geocoder failed due to: ' + status);
            }
        });
    };



    WB.app.MapUtils.getMapOptions = function(myLatlng) {
        var stylers = [{
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#d3d3d3"
            }]
        }, {
            "featureType": "transit",
            "stylers": [{
                "color": "#808080"
            }, {
                "visibility": "off"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#b3b3b3"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ffffff"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#ffffff"
            }, {
                "weight": 1.8
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#d7d7d7"
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#ebebeb"
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [{
                "color": "#a7a7a7"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ffffff"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ffffff"
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#efefef"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#696969"
            }]
        }, {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#737373"
            }]
        }, {
            "featureType": "poi",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#d6d6d6"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {}, {
            "featureType": "poi",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#dadada"
            }]
        }]

        //check map options at google.com
        //close info window when opemning another one
        var mapOptions = {
            zoom: 13,
            backgroundColor: "#25b3ee",
            scrollwheel: true,
            overviewMapControl: true,
            disableDefaultUI: false,
            panControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            center: myLatlng,
            minZoom: 3,
            maxZoom: 17,
            // draggable: ((IBM.watson.isMobile) ? false : true),
            draggable: true,
            mapTypeControlOptions: {
                // mapTypeId: google.maps.MapTypeId.ROADMAP,
                // position:google.maps.ControlPosition.BOTTOM_RIGHT
            },
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL
            },
            styles: stylers
        };

        return mapOptions;
    };

    // WB.app.MapUtils.getMapBounds = function(bounds) {

    //     var sw = bounds.getSouthWest();
    //     var ne = bounds.getNorthEast();
    //     var obj = {
    //         sw: [sw.lat(), sw.lng()],
    //         ne: [ne.lat(), ne.lng()]
    //     };

    //     return obj;
    // };

    WB.app.MapUtils.setSearchZoom = function(obj) {
        console.log(obj)
        var type = obj[0].types[0];
        if (type == "route" || type == "street_number") {
            return 15;
        } else if (type == "neighborhood" || type == "sublocality" || type == "sublocality_level_1") {
            return 14;
        } else if (type == "locality") {
            return 11;
        } else if (type == "administrative_area_level_2") {
            return 13;
        } else if (type == "country") {
            return 5;
        } else if (type == "colloquial_area") {
            return 8;
        } else if (type == "continent") {
            return 3;
        }
        //         sublocality_level_1 or sublocality or neighborhood = neighborhood
        // locality = city
        // administrative_area_level_2 = county
        // administrative_area_level_1 = state
        // country = country
        // continent = continent
        return 6;
    }

    WB.app.MapUtils.geocodeLocation = function(loc, callBack) {
        var addy = encodeURIComponent(loc);
        var url = WB.app.GEOCODE_URL.replace("[ADDRESS]", addy);
        WB.app.Utils.getData(url, "get", null, function(json) {
            if (json.results.length > 0) {
                console.log(json.results[0])
                var obj = {
                    formatted: json.results[0].formatted_address,
                    location: json.results[0].geometry.location,
                    bounds: json.results[0].geometry.bounds,
                    zoom: WB.app.MapUtils.setSearchZoom(json.results[0].address_components)
                };
                callBack(obj);
            } else {
                alert("cant find location");
            }
        });
    };

    WB.app.MapUtils.convertBounds = function(bounds) {
        var sw = bounds.getSouthWest();
        var ne = bounds.getNorthEast();

        var nBounds = {
            northeast: {
                lat: ne.lat(),
                lng: ne.lng()
            },
            southwest: {
                lat: sw.lat(),
                lng: sw.lng()
            }
        }

        return nBounds;
    };

    WB.app.MapUtils.setBounds = function(bounds) {
        var sw = new google.maps.LatLng(bounds.southwest.lat, bounds.southwest.lng);
        var ne = new google.maps.LatLng(bounds.northeast.lat, bounds.northeast.lng);
        var nBounds = new google.maps.LatLngBounds(sw, ne);

        return nBounds;
    }


}(jQuery));
