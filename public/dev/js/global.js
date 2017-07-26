(function($) { // reset V17e's noConflict
    'use strict';

    window.WB = window.WB || {};
    WB.app = WB.app || {};

	WB.app.uastring                   = window.navigator.userAgent.toLowerCase();
	WB.app.isMobile                   = (/iPhone|iPod|iPad|Android|BlackBerry/i).test(WB.app.uastring) || Modernizr.mq('(max-width: 579px)');
	WB.app.isSafari                   = (WB.app.uastring.indexOf('safari') > 0) && (WB.app.uastring.indexOf('chrome') < 1); // safari on all devices incorrectly reports html5 form validation support
	WB.app.GOOGLE_KEY                 = "AIzaSyDZ1zdyQmvBjRvqyATW7QmVnnLFWAT05xo";
	WB.app.GEOCODE_URL                = "https://maps.googleapis.com/maps/api/geocode/json?address=[ADDRESS]&key=" + WB.app.GOOGLE_KEY;
	WB.app.TWITTER_SHARE_URL          = "https://twitter.com/intent/tweet?url=";
	WB.app.FACEBOOK_SHARE_URL         = "https://www.facebook.com/sharer/sharer.php?u=";
	WB.CONSTANTS                      = WB.CONSTANTS || {};
	WB.CONSTANTS.OPEN_SAVE_PIN        = "OPEN_SAVE_PIN";
	WB.CONSTANTS.SAVE_PIN             = "SAVE_PIN";
	WB.CONSTANTS.ADD_COMMENT          = "ADD_COMMENT";
	WB.CONSTANTS.CLOSE_MARKER_INFO    = "CLOSE_MARKER_INFO";
	WB.CONSTANTS.SAVE_LOCATION        = "SAVE_LOCATION";
	WB.CONSTANTS.GET_MARKER_INFO      = "GET_MARKER_INFO";
	WB.CONSTANTS.MAP_READY            = "MAP_READY";
	WB.CONSTANTS.REMOVE_COMMENT       = "REMOVE_COMMENT";
	WB.CONSTANTS.REMOVE_PIN_FROM_LIST = "REMOVE_PIN_FROM_LIST";
	WB.CONSTANTS.REMOVE_PIN           = "REMOVE_PIN";
	WB.CONSTANTS.GET_PIN_INFO         = "GET_PIN_INFO";
	WB.CONSTANTS.SHARE_URL            = "SHARE_URL";
	WB.CONSTANTS.MAP_BOUNDS_CHANGED   = "MAP_BOUNDS_CHANGED";
	WB.CONSTANTS.RESET_MARKER_OPACITY = "RESET_MARKER_OPACITY";







}(jQuery));
