// config/database.js
"use strict";
module.exports = {

	dbURL: function(){


		// if(process.env.NODE_ENV === "production"){
		// 	return prodURL
		// }else{
		// 	return devURL;
		// }
		var url = "mongodb://***/wherebear";
		return url;
	}

};