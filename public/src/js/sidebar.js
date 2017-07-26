(function($) { // reset V17e's noConflict
    'use strict';

    window.WB = window.WB || {};
    WB.app = WB.app || {};

    WB.app.Sidebar = function() {

        console.log(this);
        this.content       = $("#content");
        this.body          = $("body");
        this.sideBar       = $("#sidebar");
        this.sideBarInner  = $("#sidebar .inner");
        this.closeBtn      = $(".close-btn");
        this.commentModal  = $("#commentModal");
        this.commentTitle  = $(".modal-header h5", this.commentModal);
        this.addCommentBtn = $("button.addCommentBtn", this.commentModal);
        this.commentField  = $("textarea#comment-field", this.commentModal);
        this.map           = $("#map-canvas");
        this.isOpen        = false;
        this.comments      = [];
        this.isInfoPanel   = false;
        this.init();
    };

    WB.app.Sidebar.prototype = {
        init: function() {
            var self = this;
            this.closeBtn.click(function(event) {
                event.preventDefault();
                self.closeSideBar();
                if(self.isInfoPanel){
                    self.body.trigger(WB.CONSTANTS.RESET_MARKER_OPACITY);                 

                }
            });

        },

        openSideBar: function() {
            var self = this;
            // this.map.animate({
            //     right: "300px"
            // }, 250);
            this.sideBar.animate({
                right: "15px"
            }, 250);

        },

        closeSideBar: function() {
            var self = this;
            // this.map.animate({
            //     right: "0"
            // }, 250);
            this.sideBar.animate({
                right: "-300px"
            }, 250);

        },

        empty: function() {
            this.sideBarInner.empty();
        },

        loginTemplate: function() {
            var self = this;
            this.empty();
            var template = WB.app.Utils.createTemplate("sideLogin", null);
            this.sideBarInner.append(template);
            $(".cancelItem").click(function(event) {
                event.preventDefault();
                self.closeSideBar();
            });
        },

        noResults: function(){
            $(".user-pins", this.sideBar).empty();
            $(".user-pins", this.sideBar).append("<p>There are no Results</p>")
            
        },

        savePinTemplate: function(obj) {
            console.log("save pin", obj)
            this.empty();
            var self = this;
            var props = obj;
            var template = WB.app.Utils.createTemplate("savePin", null);

            this.sideBarInner.append(template);

            var pinTitleField = $("#pin-title");
            pinTitleField.hashtags();
            // var hashField = $("#pin-tags");
            $(".addItem").click(function(event) {
                event.preventDefault();
                var locationTitle = pinTitleField.val();
                // var hash = WB.app.Utils.checkHash(hashField.val());

                if (locationTitle === "") {
                    alert("please enter a title");
                    return;
                }
                var title = WB.app.Utils.getTitle(locationTitle);
                var tags = WB.app.Utils.checkHash(locationTitle);


                if (tags.length <= 0) {
                    alert("please enter at least one hashtag");
                    return;
                }


                props.title = title;
                props.hash = tags;
                console.log(props)
                self.body.trigger(WB.CONSTANTS.SAVE_PIN, props);

            });

            $(".cancelItem").click(function(event) {
                event.preventDefault();
                self.closeSideBar();
            });


        },

        locationTemplate: function(data) {
            var self = this;

            this.empty();
            this.isInfoPanel = true;

            var template = WB.app.Utils.createTemplate("pinInfo", data);

            self.sideBarInner.append(template);

            var cContainer = $(".location-comments", self.sideBarInner);

            $.each(data.comments, function(index, val) {
                self.appendComment(val, index, false);
            });

            new WB.app.Social(self.sideBarInner, data);



            if (data.isAuth) {
                var infoTitle = data.location.title;
                var locationId = data.location._id;
                $(".comment").click(function(event) {
                    event.preventDefault();
                    self.addComment(infoTitle, locationId);
                });
                $(".delete-pin").click(function(event) {
                    event.preventDefault();
                    var obj = {
                        pinId: locationId
                    };
                    self.body.trigger(WB.CONSTANTS.REMOVE_PIN, obj);
                    console.log("delete pin");
                });
            }

        },

        newPinListTemplate: function(data, hash) {
            var obj = {
                locations: data,
                hash: hash
            }
            this.isInfoPanel = false;
            this.empty();
            var template = WB.app.Utils.createTemplate("newPinlist", obj);


            this.sideBarInner.append(template);
            new WB.app.Social(this.sideBarInner, null);
        },

        userPinListTemplate: function(data) {
            var self = this;
            this.isInfoPanel = false;
            this.empty();
            var template = WB.app.Utils.createTemplate("userPinlist", data);

            self.sideBarInner.append(template);
            new WB.app.Social(self.sideBarInner, data);

            $("a.delete-pin").click(function(event) {
                event.preventDefault();
                var locationId = $(this).data("id");
                var obj = {
                    pinId: locationId
                };

                self.body.trigger(WB.CONSTANTS.REMOVE_PIN_FROM_LIST, obj);

                var pinBlock = $(this).parent(".well");
                pinBlock.fadeOut("400", function() {
                    pinBlock.remove();
                });
            });
        },

        addComment: function(title, locId) {
            console.log(title, locId);
            var self = this;
            this.commentTitle.text(title);
            this.commentModal.modal('show');
            self.commentField.val("");
            setTimeout(function() {
                self.commentField.focus();
            }, 500);

            this.addCommentBtn.click(function(event) {
                event.preventDefault();
                var comment = self.commentField.val();

                if (comment.length < 4) {
                    alert("TOO SHORT");

                } else {
                    var obj = {
                        comment: comment,
                        pId: locId
                    };
                    self.body.trigger(WB.CONSTANTS.ADD_COMMENT, obj);
                    console.log("submit comment");
                }
            });

        },

        appendComment: function(obj, index, isAdd) {

            var cContainer = $(".location-comments", self.sideBarInner);
            var cTemplate = WB.app.Utils.createTemplate("appendComment", obj);
            if (isAdd) {
                cContainer.prepend(cTemplate);
            } else {
                cContainer.append(cTemplate);
            }

            var cWrapper = $($(".com-wrap", cContainer)[index]);
            var comment = new WB.app.Comment(cWrapper, obj);

            if (isAdd) {
                this.comments.unshift(comment);
            } else {
                this.comments.push(comment);
            }
        },

        removeComment: function(cId) {
            var self = this;
            $.each(this.comments, function(index, val) {
                if (val.getCID() == cId) {
                    val.removeComment();
                    self.comments.splice(index, 1);
                    return false;

                }
            });
        },

        //for TESTING//////////////////////////
        logComments: function() {

            $.each(this.comments, function(index, val) {
                console.log(val);
            });
        }

    };


}(jQuery));
