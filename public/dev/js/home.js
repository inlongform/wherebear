(function($) { // reset V17e's noConflict
    'use strict';

    window.WB = window.WB || {};
    WB.app = WB.app || {};

    WB.app.Home = function() {

        console.log(this);
        var self = this;
        this.init();
    };

    WB.app.Home.prototype = {
        init: function() {
            var self           = this;
            this.map           = new WB.app.Map();
            this.sideBar       = new WB.app.Sidebar();
            this.commentModal  = $("#commentModal");
            this.isLoggedIn    = false;
            // this.hasChanged = false;
            this.searchInfo    = $("#search-info");
            this.addpin_btn    = $(".addpin-btn");
            this.hash_field    = $("#hash-field");
            this.sortSelect    = $("select.sort-select");
            this.loader        = $(".loader");
            //saved search params
            this.currentSearch = {};
            this.map.getGeoLoc();


            var urlParams = WB.app.Utils.getURLParams();
            console.log("urlParams", urlParams);

            WB.app.Utils.checkLogin(function(isAuth) {
                console.log("isAuth", isAuth);
                self.isLoggedIn = isAuth;

                if (!isAuth) {
                    self.addpin_btn.attr("disabled", true);
                    self.addEvents(2);
                } else {
                    self.addEvents(1);
                }
            });

            //on initial load no url params
            //if logged in  show all user pins 
            // getMyPins("")
            //if not logged in show 
            // getNewPins("") no bounds

            //for initial load with url params
            //if url params uid == something 
            // getUserPins(urlParams.uid)
            //if url params uid == something && pid == something 
            // getPinByUser(urlParams.uid, urlParams.pid)
            //if url params pid == something 
            // getPinInfo(urlParams.pid)

            //for search My Pins
            // if hash == "" && loc == "" && select == "My Pins" 
            //getMyPins("")
            // if hash == "" && loc == something && select == "My Pins" 
            //locationSearch() then getMyPins("") with bounds

            // if hash == something && loc == something && select == "My Pins" 
            //locationSearch() then getMyPins(hash) with bounds

            //for search Latest Pins
            // if hash == "" && loc == "" && select == "Latest Pins" 
            //getNewPins() no bounds
            // if hash == "" && loc == something && select == "Latest Pins" 
            //locationSearch() then getNewPins() with bounds
            // if hash == something && loc == something && select == "Latest Pins" 
            //locationSearch() then getNewPins(hash) with bounds

            //LISTENERS
            $("body").bind(WB.CONSTANTS.ADD_COMMENT, function(event, result) {

                self.addComment(result);
            });

            $("body").bind(WB.CONSTANTS.REMOVE_COMMENT, function(event, result) {
                console.log(result);
                self.removeComment(result);

            });


            $("body").bind(WB.CONSTANTS.REMOVE_PIN, function(event, result) {
                console.log(result);
                self.removePin(result);

            });
            $("body").bind(WB.CONSTANTS.REMOVE_PIN_FROM_LIST, function(event, result) {
                console.log(result);
                self.removePinFromList(result);

            });


            $("body").bind(WB.CONSTANTS.OPEN_SAVE_PIN, function(event, result) {

                if (self.isLoggedIn) {
                    console.log(result)
                    self.sideBar.savePinTemplate(result);
                    self.sideBar.openSideBar();
                    self.map.closeMarkerInfo();
                } else {
                    self.sideBar.loginTemplate();
                    self.sideBar.openSideBar();
                }
            });


            $("body").bind(WB.CONSTANTS.SHARE_URL, function(event, result) {

                self.shareURL(result);

            });

            $("body").bind(WB.CONSTANTS.SAVE_PIN, function(event, result) {

                self.savePin(result);
            });


            $("body").bind(WB.CONSTANTS.GET_MARKER_INFO, function(event, result) {

                // console.log(result)
                WB.app.Api.getMarkerInfo(result.locId, function(response) {
                    self.sideBar.locationTemplate(response);
                    self.map.toggleMarkerOpacity(result.locId);
                });
                self.sideBar.openSideBar();

            });
            $("body").bind(WB.CONSTANTS.CLOSE_MARKER_INFO, function(event, result) {
                console.log("close marker info");
                self.map.closeMarkerInfo();
            });

            $("body").bind(WB.CONSTANTS.MAP_READY, function(event, result) {
                console.log("map ready");
                self.checkPageState(urlParams);


            });

            $("body").bind(WB.CONSTANTS.MAP_BOUNDS_CHANGED, function(event, result) {
                // console.log("MAP_BOUNDS_CHANGED", result);
                
                self.boundsChanged(result);
            });

            $("body").bind(WB.CONSTANTS.RESET_MARKER_OPACITY, function(event, result) {
                // console.log("MAP_BOUNDS_CHANGED", result);
                self.map.resetMarkerOpacity();
            });

        },
        
        //current location button
        boundsChanged: function(obj){
            console.log(this.currentSearch)
            this.getNewPins("", obj.bounds, obj.zoom, true);

            // if(this.hasChanged){
                // console.log(obj.bounds)
                // if(this.currentSearch){
                //     console.log("got here")
                //     if(this.currentSearch.type == "new"){
                //         // hash, nBounds, response.zoom
                //         this.getNewPins(this.currentSearch.hash, obj.bounds, obj.zoom, true);
                //     }else{
                //         return;
                //     }
                // }
            // }

            // this.hasChanged = true;
            
        },

        addEvents: function(val) {
            var self = this;
            var location_field = $("#location-field");
            var search_btn = $(".search-btn");
            var myloc_btn = $(".myloc-btn");
            var sortVal = val;



            this.sortSelect.bind("change", function(event) {
                console.log($(this).val());
                sortVal = $(this).val();
            });

            search_btn.click(function(event) {
                event.preventDefault();
                var hVal = self.hash_field.val();
                var lVal = location_field.val();

                console.log("search for stuff");
                self.sideBar.closeSideBar();
                self.searchClick(hVal, lVal, sortVal);
                // self.locationSearch(lVal, hVal, sortVal);
                // self.map.locationSearch(lVal, hVal, sortVal)
            });

            myloc_btn.click(function(event) {
                event.preventDefault();
                self.map.getMyLocationInfo();
                console.log("get my current loc")
            });

            this.addpin_btn.click(function(event) {
                event.preventDefault();
                console.log("drop pin")
                self.map.dropPin();
                $(this).attr("disabled", true);
            });

        },

        searchClick: function(hash, loc, sort) {
            var self = this;
            if (sort == 1) {
                //my pins
                if (loc) {
                    WB.app.MapUtils.geocodeLocation(loc, function(response) {
                        // var bounds = self.map.getGeoBounds(response.bounds);
                        console.log(response);
                        alert("this doesnt work yet")
                            // self.map.updateMap(obj);
                    });
                } else {
                    self.getMyPins(hash);
                }

            } else if (sort == 2) {
                //latest pins
                if (loc) {
                    WB.app.MapUtils.geocodeLocation(loc, function(response) {
                        console.log(response);
                        console.log(response.bounds)
                        if (!response.bounds) {
                            self.map.setNewBounds(response.location, response.zoom, function(nBounds) {
                                self.getNewPins(hash, nBounds, response.zoom);

                            });

                        } else {
                            self.getNewPins(hash, response.bounds, response.zoom);
                        }
                        // var bounds = self.map.getGeoBounds(response.bounds);
                        // self.getNewPins(hash, response.bounds, response.zoom, response);
                    });
                } else {
                    self.getNewPins(hash, null);
                }


            }
            console.log("loc", loc);
            console.log("hash", hash);
            console.log("sort", sort);
        },

        checkPageState: function(params) {
            console.log("checkPageState", params);
            if (!$.isEmptyObject(params)) {

                if (params.uid) {
                    this.getUserPins(params.uid);
                    console.log("show user map id= " + params.uid);
                } else if (params.pid) {
                    this.getPinInfo(params.pid);
                    console.log("show pin id= ", params.pid + " info");
                } else if (params.hash) {
                    this.getPinsByHash(params.hash);
                    console.log("show pins with the hash " + params.hash);
                }
                self.currentSearch = null;
            } else {
                //NO URL PARAMS
                this.getNewPins("", null, 6);

                // if (this.isLoggedIn) {
                //     this.getMyPins("");
                //     console.log("load logged in user map");
                // } else {
                //     this.getNewPins("", null, 6);
                //     console.log("show latest pins");
                // }
            }
        },

        savePin: function(props) {
            var self = this;

            var okGlyph = $("#sidebar .glyphicon-ok");

            WB.app.Api.savePin(props, function(pid) {

                props.marker.changeMarkerProps(props.title, pid);
                okGlyph.show();
                self.map.setDroppedPin();
                self.addpin_btn.removeAttr("disabled");
                setTimeout(function() {
                    self.sideBar.closeSideBar();
                }, 500);
            });

        },

        removePinFromList: function(obj) {
            var self = this;
            WB.app.Api.removePin(obj, function(pId) {
                self.map.deleteMarker(pId);
            });
        },

        removePin: function(obj) {
            var self = this;
            self.searchInfo.empty();
            WB.app.Api.removePin(obj, function(pId) {
                self.sideBar.closeSideBar();
                self.map.deleteMarker(pId);
            });
        },

        getNewPins: function(hash, bounds, zoom, isPan) {
            console.log("getNewPins")
            var self = this;
            self.currentSearch = {
                type: "new",
                hash: hash,
                zoom: zoom
            }
            self.searchInfo.empty();
            this.loader.show();
            WB.app.Api.getNewPins(hash, bounds, function(response) {
            console.log(response)
                self.loader.hide();
                if (response.length <= 0) {
                    console.log("there are no results")
                    if (!bounds) {
                        alert("there are no bounds and no entries try again");
                    } else {
                        self.map.clearMarkers();
                        self.map.panMapToBounds(bounds, zoom);
                        self.sideBar.noResults();
                        // self.sideBar.closeSideBar();
                    }
                }else if(isPan || response.length > 1){
                    self.map.setLocations(response, bounds, zoom);
                    self.sideBar.newPinListTemplate(response, hash);
                    self.sideBar.openSideBar();

                }else if(!isPan && response.length == 1){
                    //only show the single zoomed in location if it is not from panning and there is only 1 entry
                    self.map.setSingleLocation(response[0]);
                    self.sideBar.newPinListTemplate(response, hash);
                    self.sideBar.openSideBar();

                }


            });
        },



        getMyPins: function(hash) {
            console.log("getMyPins");
            var self = this;
            self.currentSearch = {
                type: "my",
                hash: hash
            }
            this.loader.show();
            self.searchInfo.empty();
            WB.app.Api.getMyPins(hash, function(response) {
                self.loader.hide();
                console.log("response", response)
                if (response.locations.length <= 0) {
                    alert("thre are no results")
                } else {

                    self.map.setLocations(response.locations);
                    self.sideBar.userPinListTemplate(response);
                    self.sideBar.openSideBar();
                }
            });
        },

        addComment: function(obj) {
            var self = this;
            console.log(obj);
            WB.app.Api.addComment(obj, function(response) {
                self.commentModal.modal('hide');
                self.sideBar.appendComment(response, 0, true);
            });
        },



        removeComment: function(obj) {
            console.log(obj);
            var self = this;
            WB.app.Api.removeComment(obj, function(cId) {
                self.sideBar.removeComment(cId);
            });
        },

        //deep link////////////////

        getPinInfo: function(pid) {
            var self = this;
            this.loader.show();
            self.searchInfo.empty();
            WB.app.Api.getMarkerInfo(pid, function(response) {
                self.loader.hide();
                self.map.setSingleLocation(response.location);
                self.sideBar.locationTemplate(response);
                self.sideBar.openSideBar();
                self.searchInfo.empty();
                var html = '<a href="#" class="share-twitter"><img src="/images/twitter_icon.png"/></a><a href="#" class="share-facebook"><img src="/images/fb_icon.png"/></a><h4>' + response.location.title + '</h4>';
                self.searchInfo.html(html);
                self.enableShare();
                // self.map.toggleMarkerOpacity();
                // console.log(response);
            });
        },

        getUserPins: function(uid) {
            var self = this;
            self.searchInfo.empty();
            this.loader.show();
            WB.app.Api.getUserPins(uid, function(response) {
                self.loader.hide();
                console.log(response)
                self.map.setLocations(response.locations);
                self.searchInfo.empty();
                var html = '<a href="#" class="share-twitter"><img src="/images/twitter_icon.png"/></a><a href="#" class="share-facebook"><img src="/images/fb_icon.png"/></a><img src="' + response.user.imageURL + '"> <h4>' + response.user.username + '</h4>';

                self.searchInfo.html(html);
                self.sideBar.userPinListTemplate(response);
                self.sideBar.openSideBar();
                self.enableShare();
                console.log(response);
            });
        },

        getPinsByHash: function(hash) {
            var self = this;
            this.loader.show();
            self.searchInfo.empty();
            this.hash_field.val(hash);
            this.sortSelect.val(2);
            WB.app.Api.getPinsByHash(hash, function(response) {
                self.loader.hide();
                console.log(response)
                if (response.length <= 0) {
                    alert("THERE ARE NO RESULTS");
                } else {
                    if (response.length == 1) {
                        self.map.setSingleLocation(response[0]);
                    } else {
                        self.map.setLocations(response);
                    }
                    self.sideBar.newPinListTemplate(response, hash);
                    self.sideBar.openSideBar();
                    var html = '<a href="#" class="share-twitter"><img src="/images/twitter_icon.png" /></a><a href="#" class="share-facebook"><img src="/images/fb_icon.png"/></a><h4>#' + hash + '</h4>';
                    self.searchInfo.html(html);

                    self.enableShare();
                }
            });
        },

        enableShare: function() {
            new WB.app.Social(this.searchInfo, null);
        },

        shareURL: function(obj) {
            console.log(obj);

            WB.app.Api.getShortURL(obj, function(response) {
                if (obj.service == "tw") {

                    window.open(WB.app.TWITTER_SHARE_URL + response.url, "Wherebear Share Pin", "resizable,scrollbars=yes,status=1,width=658, height=354");
                } else {
                    window.open(WB.app.FACEBOOK_SHARE_URL + response.url, "Wherebear Share Pin", "resizable,scrollbars=yes,status=1,width=550, height=350");
                }

            });
        }

    };



}(jQuery));
