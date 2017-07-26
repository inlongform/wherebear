module.exports = {


	auth: function(){
		var devCallBack  = "http://127.0.0.1:3000/";
		var prodCallBack = "http://myap.herokuapp.com/"; //your prod url
		var URL_prefix   = devCallBack;

		if(process.env.NODE_ENV === "production"){
			URL_prefix = prodCallBack;
		}

		var info = {
			"domain": URL_prefix,

			'twitterAuth' : {
				'consumerKey' 		: '123', //your consumer key
				'consumerSecret' 	: '123',
				'tokenSecret'		: '123',
				'callbackURL' 		: URL_prefix + 'auth/twitter/callback'
			},

			'googleAuth' : {
				'apiKey'		: '123'
			}
		}



		return info;
	}


};
