this["JST"] = this["JST"] || {};

this["JST"]["public/src/templates/appendComment"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "        	<a href=\"#\" class=\"glyphicon glyphicon-remove remove-comment\"></a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "\n    <div class=\"well well-sm\">\n        <div class=\"info\">\n            <span class=\"glyphicon glyphicon-comment\" aria-hidden=\"true\"></span>\n            <img src=\""
    + alias3(((helper = (helper = helpers.imageURL || (depth0 != null ? depth0.imageURL : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"imageURL","hash":{},"data":data}) : helper)))
    + "\" />\n        </div>\n        <div class=\"desc\">\n            <p><a href=\"/?uid="
    + alias3(((helper = (helper = helpers.user_id || (depth0 != null ? depth0.user_id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"user_id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.username || (depth0 != null ? depth0.username : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"username","hash":{},"data":data}) : helper)))
    + "</a> "
    + alias3(((helper = (helper = helpers.timeSince || (depth0 != null ? depth0.timeSince : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"timeSince","hash":{},"data":data}) : helper)))
    + "</p>\n            <p>"
    + alias3(((helper = (helper = helpers.comment || (depth0 != null ? depth0.comment : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"comment","hash":{},"data":data}) : helper)))
    + "</p>\n        </div>\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isMe : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n\n";
},"useData":true});

this["JST"]["public/src/templates/newPinlist"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper;

  return "	<h3>#"
    + this.escapeExpression(((helper = (helper = helpers.hash || (depth0 != null ? depth0.hash : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"hash","hash":{},"data":data}) : helper)))
    + "<a href=\"#\" class=\"share-twitter\"><img src=\"/images/twitter_icon_inv.png\" /></a>\n	<a href=\"#\" class=\"share-facebook\"><img src=\"/images/fb_icon_inv.png\" /></a></h3>\n";
},"3":function(depth0,helpers,partials,data) {
    return "\n\n	<h3>Newest Pins	<a href=\"#\" class=\"share-twitter\"><img src=\"/images/twitter_icon_inv.png\" /></a>\n		<a href=\"#\" class=\"share-facebook\"><img src=\"/images/fb_icon_inv.png\" /></a></h3>\n";
},"5":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression, alias3="function";

  return "		<div class=\"well well-sm\">\n			<!--"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isMe : depth0),{"name":"if","hash":{},"fn":this.program(6, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "-->\n	        <div class=\"info\">\n	            <span>"
    + alias2((helpers.inc || (depth0 && depth0.inc) || alias1).call(depth0,(data && data.index),{"name":"inc","hash":{},"data":data}))
    + ".</span><img src=\""
    + alias2(((helper = (helper = helpers.imageURL || (depth0 != null ? depth0.imageURL : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"imageURL","hash":{},"data":data}) : helper)))
    + "\" />\n	        </div>\n	        <div class=\"desc\">\n	            <p><a href=\"/?pid="
    + alias2(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias2(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</a>&nbsp;"
    + alias2(((helper = (helper = helpers.nDate || (depth0 != null ? depth0.nDate : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"nDate","hash":{},"data":data}) : helper)))
    + "</p>\n	            <p><a href=\"/?uid="
    + alias2(((helper = (helper = helpers.user_id || (depth0 != null ? depth0.user_id : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"user_id","hash":{},"data":data}) : helper)))
    + "\">"
    + alias2(((helper = (helper = helpers.username || (depth0 != null ? depth0.username : depth0)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"username","hash":{},"data":data}) : helper)))
    + "</a></p>\n	            <p>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.hash : depth0),{"name":"each","hash":{},"fn":this.program(8, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "				</p>\n	        </div>\n	    </div>\n";
},"6":function(depth0,helpers,partials,data) {
    return "\n        		<a href=\"#\" class=\"glyphicon glyphicon-remove remove-comment\"></a>\n    		";
},"8":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "						<a class=\"hash\" href=\"/?hash="
    + alias2(alias1(depth0, depth0))
    + "\">#"
    + alias2(alias1(depth0, depth0))
    + "</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hash : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "<hr/>\n<div class=\"user-pins new\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.locations : depth0),{"name":"each","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true});

this["JST"]["public/src/templates/pinInfo"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " <a href=\"#\" class=\"glyphicon glyphicon-remove delete-pin\"></a> ";
},"3":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "		<a href=\"/?hash="
    + alias2(alias1(depth0, depth0))
    + "\">#"
    + alias2(alias1(depth0, depth0))
    + "</a>, \n";
},"5":function(depth0,helpers,partials,data) {
    return "<a href=\"#\" class=\"glyphicon glyphicon-plus add-follow\"></a>";
},"7":function(depth0,helpers,partials,data) {
    var stack1;

  return "<a href=\"#\" class=\"glyphicon glyphicon-plus comment\" data-pid=\""
    + this.escapeExpression(this.lambda(((stack1 = (depth0 != null ? depth0.location : depth0)) != null ? stack1._id : stack1), depth0))
    + "\"></a>";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<h4>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.location : depth0)) != null ? stack1.title : stack1), depth0))
    + " "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isMe : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</h4>\n<p>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.location : depth0)) != null ? stack1.nDate : stack1), depth0))
    + "</p>\n<p>\n"
    + ((stack1 = helpers.each.call(depth0,((stack1 = (depth0 != null ? depth0.location : depth0)) != null ? stack1.hash : stack1),{"name":"each","hash":{},"fn":this.program(3, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</p>\n<hr/>\n<h4><img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.location : depth0)) != null ? stack1.imageURL : stack1), depth0))
    + "\" /><a href=\"/?uid="
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.location : depth0)) != null ? stack1.user_id : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.location : depth0)) != null ? stack1.username : stack1), depth0))
    + "</a>"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isAuth : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "<a href=\"#\" class=\"share-twitter\"><img src=\"/images/twitter_icon_inv.png\" /></a><a href=\"#\" class=\"share-facebook\"><img src=\"/images/fb_icon_inv.png\" /></a></p></h4>\n\n<hr/>\n<div class=\"com-wrap\">\n	<h4>Comments"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isAuth : depth0),{"name":"if","hash":{},"fn":this.program(7, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</h4>\n</div>\n<div class=\"location-comments\">\n\n</div>";
},"useData":true});

this["JST"]["public/src/templates/savePin"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<h3>SAVE PIN</h3>\n<div class=\"form-group\">\n    <p>\n        <textarea placeholder=\"joes #beer house\" class=\"form-control\" id=\"pin-title\" rows=\"3\"></textarea>\n    </p>\n</div>\n\n<span class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span>\n<button type=\"button\" class=\"btn btn-default cancelItem\">Cancel</button>\n<button type=\"button\" class=\"btn btn-primary addItem\">Add</button>\n";
},"useData":true});

this["JST"]["public/src/templates/sideLogin"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<h3>SAVE PIN</h3>\n<h4>please login to save a pin</h4>\n\n<button type=\"button\" class=\"btn btn-default cancelItem\">Cancel</button>\n\n";
},"useData":true});

this["JST"]["public/src/templates/userPinlist"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return "<a href=\"#\" class=\"glyphicon glyphicon-plus add-follow\">";
},"3":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression, alias3=this.lambda;

  return "		<div class=\"well well-sm\">\n			\n"
    + ((stack1 = helpers['if'].call(depth0,((stack1 = (depths[1] != null ? depths[1].user : depths[1])) != null ? stack1.isMe : stack1),{"name":"if","hash":{},"fn":this.program(4, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n			<span>"
    + alias2((helpers.inc || (depth0 && depth0.inc) || alias1).call(depth0,(data && data.index),{"name":"inc","hash":{},"data":data}))
    + ".</span>\n			<div class=\"holder\">\n\n				<a href=\"/?pid="
    + alias2(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\n					<p><strong>"
    + alias2(alias3((depth0 != null ? depth0.title : depth0), depth0))
    + "</strong></p>\n					<p>"
    + alias2(alias3((depth0 != null ? depth0.nDate : depth0), depth0))
    + "</p>\n				</a>\n					<p>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.hash : depth0),{"name":"each","hash":{},"fn":this.program(6, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "					</p>\n			</div>\n		</div>\n";
},"4":function(depth0,helpers,partials,data) {
    var helper;

  return "				<a href=\"#\" class=\"glyphicon glyphicon-remove delete-pin\" data-id="
    + this.escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"_id","hash":{},"data":data}) : helper)))
    + "></a>\n";
},"6":function(depth0,helpers,partials,data) {
    var alias1=this.lambda, alias2=this.escapeExpression;

  return "							<a class=\"hash\" href=\"/?hash="
    + alias2(alias1(depth0, depth0))
    + "\">#"
    + alias2(alias1(depth0, depth0))
    + "</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<h3>Locations</h3>\n<h4><img src=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.imageURL : stack1), depth0))
    + "\" /><a href=\"/?uid="
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.user_id : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.username : stack1), depth0))
    + "</a>\n	"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isAuth : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</a>\n	<a href=\"#\" class=\"share-twitter\"><img src=\"/images/twitter_icon_inv.png\" /></a>\n	<a href=\"#\" class=\"share-facebook\"><img src=\"/images/fb_icon_inv.png\" /></a>\n</h4>\n\n<hr/>\n<div class=\"user-pins\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.locations : depth0),{"name":"each","hash":{},"fn":this.program(3, data, 0, blockParams, depths),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "</div>";
},"useData":true,"useDepths":true});